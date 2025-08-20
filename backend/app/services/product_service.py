"""
Product matching service for finding skincare products based on ingredient requirements
"""
import asyncio
import logging
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, text
from fastapi import HTTPException, Depends
import redis
import json
import hashlib

from ..models.database import get_db
from ..models.product import Product, LiveSnapshot
from ..models.schemas import ProductMatchRequest, MatchedProduct, ProductMatchResponse
from ..utils.ingredients import (
    normalise_list, 
    check_ingredient_match, 
    check_avoid_ingredients,
    expand_ingredient_search_terms
)
from ..utils.pricing import format_price
from ..config import settings
from .retailers.amazon_rainforest import AmazonRainforestAdapter
from .retailers.boots import BootsAdapter

logger = logging.getLogger(__name__)


class ProductService:
    """Service for product matching and live verification"""
    
    def __init__(self):
        # Initialize retailer adapters
        self.adapters = {
            'amazon': AmazonRainforestAdapter(),
            'boots': BootsAdapter()
        }
        
        # Redis cache for live verification (optional)
        self.redis_client = None
        try:
            redis_url = getattr(settings, 'REDIS_URL', None)
            if redis_url:
                self.redis_client = redis.from_url(redis_url, decode_responses=True)
                # Test connection
                self.redis_client.ping()
                logger.info("✅ Redis cache connected for live verification")
        except Exception as e:
            logger.warning(f"⚠️ Redis cache not available: {e}")
            self.redis_client = None
        
        # Configuration
        self.top_n_live_check = getattr(settings, 'TOP_N_LIVE_CHECK', 20)
        self.live_check_timeout = getattr(settings, 'LIVE_CHECK_TIMEOUT_SECONDS', 8)
        self.country_whitelist = getattr(settings, 'COUNTRY_WHITELIST', 'GB').split(',')
        self.cache_duration = 15 * 60  # 15 minutes
        
    def validate_request(self, request: ProductMatchRequest) -> None:
        """
        Validate product match request
        
        Args:
            request: ProductMatchRequest to validate
            
        Raises:
            HTTPException: If validation fails
        """
        # Validate country
        if request.country not in self.country_whitelist:
            raise HTTPException(
                status_code=400,
                detail=f"Country '{request.country}' is not supported. Supported countries: {', '.join(self.country_whitelist)}"
            )
        
        # Validate required ingredients
        if not request.required_ingredients:
            raise HTTPException(
                status_code=400,
                detail="At least one required ingredient must be specified"
            )
        
        # Validate max price
        if request.max_price is not None and request.max_price <= 0:
            raise HTTPException(
                status_code=400,
                detail="Maximum price must be greater than 0"
            )
        
        logger.info(f"✅ Product match request validated - Country: {request.country}, "
                   f"Required: {len(request.required_ingredients)}, "
                   f"Avoid: {len(request.avoid_ingredients or [])}")
    
    def _normalise_request_ingredients(self, request: ProductMatchRequest) -> Tuple[List[str], List[str]]:
        """Normalise and expand ingredient lists from request"""
        required_normalised = normalise_list(request.required_ingredients)
        avoid_normalised = normalise_list(request.avoid_ingredients or [])
        
        logger.info(f"🧪 Normalised ingredients - Required: {required_normalised}, Avoid: {avoid_normalised}")
        
        return required_normalised, avoid_normalised
    
    def _build_candidate_query(
        self, 
        db: Session, 
        request: ProductMatchRequest, 
        required_terms: List[str],
        avoid_terms: List[str]
    ):
        """Build SQLAlchemy query for candidate products"""
        query = db.query(Product).filter(Product.country == request.country)
        
        # Expand search terms to include aliases
        required_search_terms = expand_ingredient_search_terms(required_terms)
        avoid_search_terms = expand_ingredient_search_terms(avoid_terms) if avoid_terms else set()
        
        # Filter by required ingredients (must contain ALL)
        for term in required_search_terms:
            query = query.filter(Product.ingredients_norm_set.contains([term]))
        
        # Filter by avoid ingredients (must contain NONE)
        if avoid_search_terms:
            for term in avoid_search_terms:
                query = query.filter(~Product.ingredients_norm_set.contains([term]))
        
        # Price filter
        if request.max_price is not None:
            query = query.filter(
                or_(
                    Product.price.is_(None),
                    Product.price <= request.max_price
                )
            )
        
        # Order by last seen (fresher data first)
        query = query.order_by(Product.last_seen.desc())
        
        return query
    
    def _calculate_score(self, product: Product, required_ingredients: List[str]) -> float:
        """
        Calculate matching score for a product
        
        Scoring factors:
        - Earlier ingredient positions (ignore "water")
        - Freshness (last_seen within 30 days)
        - Price efficiency (inverse of price_per_ml)
        - Retailer reputation
        """
        score = 0.0
        
        # Ingredient position scoring (max 50 points)
        ingredients_norm = product.ingredients_norm or []
        for req_ingredient in required_ingredients:
            req_aliases = expand_ingredient_search_terms([req_ingredient])
            
            for i, ingredient in enumerate(ingredients_norm):
                if ingredient in req_aliases and ingredient.lower() != 'water':
                    # Earlier positions get higher scores
                    position_score = max(0, 10 - i) * 5
                    score += position_score
                    break
        
        # Freshness scoring (max 20 points)
        if product.last_seen:
            days_old = (datetime.now() - product.last_seen.replace(tzinfo=None)).days
            freshness_score = max(0, 20 - (days_old / 30 * 20))
            score += freshness_score
        
        # Price efficiency scoring (max 20 points)
        if product.price_per_ml and product.price_per_ml > 0:
            # Inverse relationship: lower price per ml = higher score
            price_score = min(20, 100 / product.price_per_ml)
            score += price_score
        
        # Retailer reputation scoring (max 10 points)
        retailer_scores = {
            'boots': 10,
            'amazon': 8,
            'superdrug': 7,
            'lookfantastic': 6
        }
        score += retailer_scores.get(product.retailer.lower(), 5)
        
        return round(score, 2)
    
    async def _get_cache_key(self, product: Product, postcode: Optional[str]) -> str:
        """Generate cache key for live verification"""
        key_parts = [
            'live',
            product.retailer,
            product.retailer_sku,
            postcode or 'no_postcode'
        ]
        return ':'.join(key_parts)
    
    async def _get_cached_live_result(self, cache_key: str) -> Optional[Dict]:
        """Get cached live verification result"""
        if not self.redis_client:
            return None
        
        try:
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            logger.warning(f"Failed to read from cache: {e}")
        
        return None
    
    async def _cache_live_result(self, cache_key: str, result: Dict) -> None:
        """Cache live verification result"""
        if not self.redis_client:
            return
        
        try:
            self.redis_client.setex(
                cache_key,
                self.cache_duration,
                json.dumps(result, default=str)
            )
        except Exception as e:
            logger.warning(f"Failed to write to cache: {e}")
    
    async def _perform_live_verification(
        self, 
        products: List[Tuple[Product, float]], 
        postcode: Optional[str],
        db: Session
    ) -> List[Tuple[Product, float, Dict]]:
        """Perform concurrent live verification on top products"""
        
        # Limit to top N products for live checking
        products_to_check = products[:self.top_n_live_check]
        
        async def verify_single_product(product_score_pair: Tuple[Product, float]) -> Tuple[Product, float, Dict]:
            product, score = product_score_pair
            
            # Check cache first
            cache_key = await self._get_cache_key(product, postcode)
            cached_result = await self._get_cached_live_result(cache_key)
            
            if cached_result:
                logger.debug(f"Using cached live result for {product.retailer_sku}")
                return product, score, cached_result
            
            # Check if we have recent verification (within 24 hours)
            if product.last_live_verified:
                hours_since_verified = (datetime.now() - product.last_live_verified.replace(tzinfo=None)).total_seconds() / 3600
                if hours_since_verified <= 24:
                    logger.debug(f"Using recent verification for {product.retailer_sku}")
                    live_result = {
                        'price': float(product.price) if product.price else None,
                        'currency': product.currency,
                        'in_stock': 'unknown',
                        'deliverable_postcode': postcode,
                        'ingredients_raw': product.ingredients_raw,
                        'status_code': 'recent',
                        'fetched_at': product.last_live_verified.isoformat(),
                        'source': 'database'
                    }
                    await self._cache_live_result(cache_key, live_result)
                    return product, score, live_result
            
            # Perform live check
            try:
                adapter = self.adapters.get(product.retailer.lower())
                if not adapter:
                    logger.warning(f"No adapter available for retailer: {product.retailer}")
                    return product, score, None
                
                live_result = await adapter.live_check(product, postcode)
                
                # Update product in database
                try:
                    if live_result.price is not None:
                        product.price = live_result.price
                    
                    product.last_live_verified = live_result.fetched_at
                    
                    # Create live snapshot
                    snapshot = LiveSnapshot(
                        product_id=product.id,
                        fetched_at=live_result.fetched_at,
                        price=live_result.price,
                        currency=live_result.currency,
                        in_stock=live_result.in_stock,
                        deliverable_postcode=live_result.deliverable_postcode,
                        ingredients_raw=live_result.ingredients_raw,
                        status_code=live_result.status_code,
                        source=live_result.source
                    )
                    
                    db.add(snapshot)
                    db.commit()
                    
                except Exception as e:
                    logger.error(f"Failed to update database after live check: {e}")
                    db.rollback()
                
                # Cache the result
                result_dict = {
                    'price': live_result.price,
                    'currency': live_result.currency,
                    'in_stock': live_result.in_stock,
                    'deliverable_postcode': live_result.deliverable_postcode,
                    'ingredients_raw': live_result.ingredients_raw,
                    'status_code': live_result.status_code,
                    'fetched_at': live_result.fetched_at.isoformat(),
                    'source': live_result.source
                }
                
                await self._cache_live_result(cache_key, result_dict)
                
                return product, score, result_dict
                
            except Exception as e:
                logger.error(f"Live verification failed for {product.retailer_sku}: {e}")
                return product, score, None
        
        # Perform concurrent live checks with timeout
        try:
            tasks = [verify_single_product(ps) for ps in products_to_check]
            results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=self.live_check_timeout + 5  # Add buffer to individual timeouts
            )
            
            # Filter out exceptions and failed checks
            verified_products = []
            for result in results:
                if isinstance(result, tuple) and len(result) == 3:
                    product, score, live_data = result
                    if live_data:  # Only include products with successful live verification
                        verified_products.append((product, score, live_data))
            
            logger.info(f"✅ Live verification completed: {len(verified_products)}/{len(products_to_check)} products verified")
            
            return verified_products
            
        except asyncio.TimeoutError:
            logger.warning(f"Live verification timed out after {self.live_check_timeout + 5} seconds")
            return []
        except Exception as e:
            logger.error(f"Live verification failed: {e}")
            return []
    
    async def match_products(
        self, 
        request: ProductMatchRequest, 
        db: Session = Depends(get_db)
    ) -> ProductMatchResponse:
        """
        Match products based on ingredient requirements and preferences
        
        Args:
            request: Product matching request
            db: Database session
            
        Returns:
            ProductMatchResponse with matched products
        """
        match_id = f"match-{hash(str(request.dict()))}"
        logger.info(f"🔍 Starting product match {match_id}")
        
        try:
            # Validate request
            self.validate_request(request)
            
            # Normalise ingredients
            required_normalised, avoid_normalised = self._normalise_request_ingredients(request)
            
            # Build and execute candidate query
            query = self._build_candidate_query(db, request, required_normalised, avoid_normalised)
            candidates = query.limit(200).all()  # Limit initial candidates
            
            logger.info(f"📊 Found {len(candidates)} candidate products")
            
            if not candidates:
                return ProductMatchResponse(
                    generated_at=datetime.now().isoformat(),
                    currency=request.currency or settings.CURRENCY,
                    results=[]
                )
            
            # Calculate scores and sort
            scored_products = []
            for product in candidates:
                # Double-check ingredient matching (redundant safety check)
                if (check_ingredient_match(product.ingredients_norm or [], required_normalised) and
                    not check_avoid_ingredients(product.ingredients_norm or [], avoid_normalised)):
                    
                    score = self._calculate_score(product, required_normalised)
                    scored_products.append((product, score))
            
            # Sort by score (highest first)
            scored_products.sort(key=lambda x: x[1], reverse=True)
            
            logger.info(f"🎯 Scored {len(scored_products)} matching products")
            
            # Perform live verification on top products
            postcode = None
            if request.location and isinstance(request.location, dict):
                postcode = request.location.get('postcode')
            
            verified_products = await self._perform_live_verification(scored_products, postcode, db)
            
            # Format results
            results = []
            for product, score, live_data in verified_products:
                # Determine currency
                currency = request.currency or live_data.get('currency') or product.currency or settings.CURRENCY
                
                # Format price
                formatted_price = None
                if live_data.get('price'):
                    formatted_price = format_price(int(live_data['price']))
                elif product.price:
                    formatted_price = format_price(int(product.price))
                
                matched_product = MatchedProduct(
                    id=str(product.id),
                    retailer=product.retailer,
                    retailer_sku=product.retailer_sku,
                    brand=product.brand,
                    name=product.name,
                    country=product.country,
                    currency=currency,
                    price=live_data.get('price') or (float(product.price) if product.price else None),
                    price_per_ml=float(product.price_per_ml) if product.price_per_ml else None,
                    formatted_price=formatted_price,
                    pdp_url=product.pdp_url,
                    image_url=product.image_url,
                    ingredients_normalised=product.ingredients_norm or [],
                    availability=live_data.get('in_stock', 'unknown'),
                    score=score,
                    last_verified=live_data.get('fetched_at')
                )
                
                results.append(matched_product)
            
            # Sort final results by score
            results.sort(key=lambda x: x.score, reverse=True)
            
            logger.info(f"✅ Product match {match_id} completed: {len(results)} verified products returned")
            
            return ProductMatchResponse(
                generated_at=datetime.now().isoformat(),
                currency=request.currency or settings.CURRENCY,
                results=results
            )
            
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            logger.error(f"❌ Product match {match_id} failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Product matching failed: {str(e)}"
            )


# Global service instance
product_service = ProductService() 