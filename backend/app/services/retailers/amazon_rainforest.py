"""
Amazon Rainforest API adapter for product search and live checking
"""
import asyncio
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import aiohttp
import json
import re
from urllib.parse import quote_plus

from .base import RetailerAdapter, ProductSeed, ParsedPDP, LiveResult
from ...config import settings

logger = logging.getLogger(__name__)


class AmazonRainforestAdapter:
    """Amazon adapter using Rainforest API"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'RAINFOREST_API_KEY', '')
        self.domain = getattr(settings, 'AMAZON_DOMAIN', 'amazon.co.uk')
        self.timeout = getattr(settings, 'LIVE_CHECK_TIMEOUT_SECONDS', 8)
        self.base_url = "https://api.rainforestapi.com/request"
        
        # Rate limiting
        self._request_semaphore = asyncio.Semaphore(5)  # Max 5 concurrent requests
        self._last_request_time = 0
        self._min_request_interval = 0.2  # 200ms between requests
    
    @property
    def retailer(self) -> str:
        return "amazon"
    
    @property
    def country(self) -> str:
        # Extract country from domain
        if 'amazon.co.uk' in self.domain:
            return "GB"
        elif 'amazon.com' in self.domain:
            return "US"
        elif 'amazon.de' in self.domain:
            return "DE"
        elif 'amazon.fr' in self.domain:
            return "FR"
        else:
            return "GB"  # Default
    
    async def _rate_limited_request(self, session: aiohttp.ClientSession, params: Dict[str, Any]) -> Optional[Dict]:
        """Make a rate-limited request to Rainforest API"""
        async with self._request_semaphore:
            # Enforce minimum interval between requests
            current_time = asyncio.get_event_loop().time()
            time_since_last = current_time - self._last_request_time
            if time_since_last < self._min_request_interval:
                await asyncio.sleep(self._min_request_interval - time_since_last)
            
            self._last_request_time = current_time
            
            try:
                async with session.get(
                    self.base_url,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        logger.warning(f"Rainforest API returned status {response.status}")
                        return None
            except asyncio.TimeoutError:
                logger.warning("Rainforest API request timed out")
                return None
            except Exception as e:
                logger.error(f"Rainforest API request failed: {e}")
                return None
    
    async def search(self, query: str, country: str) -> List[ProductSeed]:
        """Search for products using Rainforest API"""
        if not self.api_key:
            logger.warning("Rainforest API key not configured")
            return []
        
        params = {
            "api_key": self.api_key,
            "type": "search",
            "amazon_domain": self.domain,
            "search_term": query,
            "department": "beauty",
            "max_page": "1"
        }
        
        products = []
        
        async with aiohttp.ClientSession() as session:
            try:
                result = await self._rate_limited_request(session, params)
                
                if not result or 'search_results' not in result:
                    return products
                
                for item in result.get('search_results', []):
                    try:
                        # Extract price
                        price = None
                        currency = "GBP" if country == "GB" else "USD"
                        
                        if 'price' in item and 'value' in item['price']:
                            price = float(item['price']['value'])
                        elif 'price_string' in item:
                            # Parse price from string like "£19.99"
                            price_match = re.search(r'[\d,]+\.?\d*', item['price_string'])
                            if price_match:
                                price = float(price_match.group().replace(',', ''))
                        
                        # Extract brand from title or use "Amazon" as fallback
                        title = item.get('title', '')
                        brand = title.split()[0] if title else "Amazon"
                        
                        product = ProductSeed(
                            retailer_sku=item.get('asin', ''),
                            name=title,
                            brand=brand,
                            price=price,
                            currency=currency,
                            pdp_url=item.get('link', ''),
                            image_url=item.get('image', ''),
                            gtin=None  # Amazon doesn't provide GTIN in search
                        )
                        
                        if product.retailer_sku and product.name:
                            products.append(product)
                            
                    except Exception as e:
                        logger.warning(f"Failed to parse Amazon search result: {e}")
                        continue
                
                logger.info(f"Amazon search for '{query}' returned {len(products)} products")
                
            except Exception as e:
                logger.error(f"Amazon search failed: {e}")
        
        return products
    
    async def fetch_pdp(self, url_or_sku: str) -> ParsedPDP:
        """Fetch product detail page using Rainforest API"""
        if not self.api_key:
            raise Exception("Rainforest API key not configured")
        
        # Extract ASIN from URL or use as SKU
        asin = url_or_sku
        if 'amazon.' in url_or_sku:
            asin_match = re.search(r'/dp/([A-Z0-9]{10})', url_or_sku)
            if asin_match:
                asin = asin_match.group(1)
        
        params = {
            "api_key": self.api_key,
            "type": "product",
            "amazon_domain": self.domain,
            "asin": asin
        }
        
        async with aiohttp.ClientSession() as session:
            result = await self._rate_limited_request(session, params)
            
            if not result or 'product' not in result:
                raise Exception(f"Failed to fetch Amazon product {asin}")
            
            product_data = result['product']
            
            # Extract ingredients from description or features
            ingredients_raw = ""
            for field in ['description', 'feature_bullets', 'ingredients']:
                if field in product_data and product_data[field]:
                    if isinstance(product_data[field], list):
                        ingredients_raw += " ".join(product_data[field])
                    else:
                        ingredients_raw += str(product_data[field])
                    break
            
            # Extract price
            price = None
            currency = "GBP" if self.country == "GB" else "USD"
            if 'buybox_winner' in product_data and 'price' in product_data['buybox_winner']:
                price_info = product_data['buybox_winner']['price']
                if 'value' in price_info:
                    price = float(price_info['value'])
            
            # Extract volume in ml
            volume_ml = None
            title = product_data.get('title', '')
            volume_match = re.search(r'(\d+)\s*ml', title.lower())
            if volume_match:
                volume_ml = float(volume_match.group(1))
            
            return ParsedPDP(
                name=product_data.get('title', ''),
                brand=product_data.get('brand', ''),
                price=price,
                currency=currency,
                ingredients_raw=ingredients_raw,
                image_url=product_data.get('main_image', {}).get('link', ''),
                gtin=None,  # Amazon doesn't typically provide GTIN
                availability=product_data.get('availability', {}).get('type', 'unknown'),
                volume_ml=volume_ml
            )
    
    async def live_check(self, product, postcode: Optional[str] = None) -> LiveResult:
        """Perform live check using Rainforest API"""
        if not self.api_key:
            return LiveResult(
                price=None,
                currency=None,
                in_stock="unknown",
                deliverable_postcode=postcode,
                ingredients_raw=None,
                status_code="no_api_key",
                fetched_at=datetime.now(),
                source="live_check"
            )
        
        try:
            # Use the PDP fetch to get current information
            pdp_data = await self.fetch_pdp(product.retailer_sku)
            
            # Determine stock status
            in_stock = "unknown"
            if pdp_data.availability:
                if any(status in pdp_data.availability.lower() for status in ['in stock', 'available']):
                    in_stock = "in_stock"
                elif any(status in pdp_data.availability.lower() for status in ['out of stock', 'unavailable']):
                    in_stock = "out_of_stock"
            
            return LiveResult(
                price=pdp_data.price,
                currency=pdp_data.currency,
                in_stock=in_stock,
                deliverable_postcode=postcode,
                ingredients_raw=pdp_data.ingredients_raw,
                status_code="200",
                fetched_at=datetime.now(),
                source="live_check"
            )
            
        except Exception as e:
            logger.error(f"Amazon live check failed for {product.retailer_sku}: {e}")
            return LiveResult(
                price=None,
                currency=None,
                in_stock="unknown",
                deliverable_postcode=postcode,
                ingredients_raw=None,
                status_code="error",
                fetched_at=datetime.now(),
                source="live_check"
            ) 