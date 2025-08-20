"""
Boots UK scraping adapter for product information
"""
import asyncio
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import aiohttp
import re
from urllib.parse import urljoin, quote_plus
from selectolax.parser import HTMLParser

from .base import RetailerAdapter, ProductSeed, ParsedPDP, LiveResult
from ...config import settings

logger = logging.getLogger(__name__)


class BootsAdapter:
    """Boots UK adapter using web scraping"""
    
    def __init__(self):
        self.timeout = getattr(settings, 'LIVE_CHECK_TIMEOUT_SECONDS', 8)
        self.base_url = "https://www.boots.com"
        self.search_url = "https://www.boots.com/search"
        
        # Rate limiting
        self._request_semaphore = asyncio.Semaphore(3)  # Max 3 concurrent requests
        self._last_request_time = 0
        self._min_request_interval = 1.0  # 1 second between requests for politeness
        
        # User agent for scraping
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    @property
    def retailer(self) -> str:
        return "boots"
    
    @property
    def country(self) -> str:
        return "GB"
    
    async def _rate_limited_request(self, session: aiohttp.ClientSession, url: str, **kwargs) -> Optional[str]:
        """Make a rate-limited request to Boots website"""
        async with self._request_semaphore:
            # Enforce minimum interval between requests
            current_time = asyncio.get_event_loop().time()
            time_since_last = current_time - self._last_request_time
            if time_since_last < self._min_request_interval:
                await asyncio.sleep(self._min_request_interval - time_since_last)
            
            self._last_request_time = current_time
            
            try:
                async with session.get(
                    url,
                    headers=self.headers,
                    timeout=aiohttp.ClientTimeout(total=self.timeout),
                    **kwargs
                ) as response:
                    if response.status == 200:
                        return await response.text()
                    else:
                        logger.warning(f"Boots request returned status {response.status} for {url}")
                        return None
            except asyncio.TimeoutError:
                logger.warning(f"Boots request timed out for {url}")
                return None
            except Exception as e:
                logger.error(f"Boots request failed for {url}: {e}")
                return None
    
    def _extract_price(self, price_text: str) -> Optional[float]:
        """Extract price from text like '£19.99' or '£1.99 - £19.99'"""
        if not price_text:
            return None
        
        # Look for price patterns
        price_match = re.search(r'£(\d+(?:\.\d{2})?)', price_text.replace(',', ''))
        if price_match:
            return float(price_match.group(1))
        return None
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalise text content"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())
    
    async def search(self, query: str, country: str) -> List[ProductSeed]:
        """Search for products on Boots website"""
        search_params = {
            'text': query,
            'categoryId': 'skincare'  # Focus on skincare category
        }
        
        products = []
        
        async with aiohttp.ClientSession() as session:
            try:
                # Build search URL
                search_url = f"{self.search_url}?text={quote_plus(query)}&categoryId=skincare"
                
                html_content = await self._rate_limited_request(session, search_url)
                
                if not html_content:
                    return products
                
                parser = HTMLParser(html_content)
                
                # Find product tiles (Boots uses different selectors)
                product_tiles = parser.css('.product-tile, .estore_product_tile, .product-item')
                
                for tile in product_tiles[:20]:  # Limit to first 20 results
                    try:
                        # Extract product name
                        name_elem = tile.css_first('.product-name, .product-title, .estore_product_name')
                        name = self._clean_text(name_elem.text()) if name_elem else ""
                        
                        # Extract brand (often in a separate element)
                        brand_elem = tile.css_first('.product-brand, .brand-name, .estore_brand')
                        brand = self._clean_text(brand_elem.text()) if brand_elem else name.split()[0] if name else "Boots"
                        
                        # Extract price
                        price_elem = tile.css_first('.price, .product-price, .estore_price')
                        price = None
                        if price_elem:
                            price = self._extract_price(price_elem.text())
                        
                        # Extract product URL
                        link_elem = tile.css_first('a')
                        product_url = ""
                        if link_elem and link_elem.attributes.get('href'):
                            product_url = urljoin(self.base_url, link_elem.attributes['href'])
                        
                        # Extract image URL
                        img_elem = tile.css_first('img')
                        image_url = ""
                        if img_elem and img_elem.attributes.get('src'):
                            image_url = urljoin(self.base_url, img_elem.attributes['src'])
                        
                        # Extract product ID from URL or data attributes
                        product_id = ""
                        if product_url:
                            id_match = re.search(r'/(\d+)/?$', product_url)
                            if id_match:
                                product_id = id_match.group(1)
                        
                        if not product_id:
                            # Try to extract from data attributes
                            product_id = tile.attributes.get('data-product-id', '')
                        
                        if name and product_id and product_url:
                            product = ProductSeed(
                                retailer_sku=product_id,
                                name=name,
                                brand=brand,
                                price=price,
                                currency="GBP",
                                pdp_url=product_url,
                                image_url=image_url
                            )
                            products.append(product)
                            
                    except Exception as e:
                        logger.warning(f"Failed to parse Boots product tile: {e}")
                        continue
                
                logger.info(f"Boots search for '{query}' returned {len(products)} products")
                
            except Exception as e:
                logger.error(f"Boots search failed: {e}")
        
        return products
    
    async def fetch_pdp(self, url_or_sku: str) -> ParsedPDP:
        """Fetch and parse Boots product detail page"""
        
        # Determine if we have a URL or SKU
        if url_or_sku.startswith('http'):
            product_url = url_or_sku
        else:
            # Construct URL from SKU (this is a simplified approach)
            product_url = f"{self.base_url}/product/{url_or_sku}"
        
        async with aiohttp.ClientSession() as session:
            html_content = await self._rate_limited_request(session, product_url)
            
            if not html_content:
                raise Exception(f"Failed to fetch Boots product page: {product_url}")
            
            parser = HTMLParser(html_content)
            
            # Extract product name
            name_elem = parser.css_first('h1.product-name, h1.pdp-product-name, .product-title h1')
            name = self._clean_text(name_elem.text()) if name_elem else ""
            
            # Extract brand
            brand_elem = parser.css_first('.product-brand, .brand-name, .pdp-brand')
            brand = self._clean_text(brand_elem.text()) if brand_elem else name.split()[0] if name else "Boots"
            
            # Extract price
            price_elem = parser.css_first('.price, .product-price, .current-price')
            price = None
            if price_elem:
                price = self._extract_price(price_elem.text())
            
            # Extract ingredients from various possible locations
            ingredients_raw = ""
            
            # Look for ingredients section
            ingredients_sections = parser.css('.ingredients, .product-ingredients, .ingredient-list')
            for section in ingredients_sections:
                if section.text():
                    ingredients_raw += self._clean_text(section.text()) + " "
            
            # If no dedicated ingredients section, look in product details/description
            if not ingredients_raw:
                detail_sections = parser.css('.product-details, .product-description, .pdp-description')
                for section in detail_sections:
                    text = section.text() or ""
                    # Look for ingredients in the text
                    if 'ingredients' in text.lower():
                        # Extract text after "ingredients:"
                        ingredients_match = re.search(r'ingredients[:\s]+([^.]+)', text.lower())
                        if ingredients_match:
                            ingredients_raw = ingredients_match.group(1)
                        break
            
            # Extract image URL
            img_elem = parser.css_first('.product-image img, .pdp-image img')
            image_url = ""
            if img_elem and img_elem.attributes.get('src'):
                image_url = urljoin(self.base_url, img_elem.attributes['src'])
            
            # Extract availability
            availability = "unknown"
            stock_elem = parser.css_first('.stock-status, .availability, .product-availability')
            if stock_elem:
                stock_text = stock_elem.text().lower()
                if 'in stock' in stock_text or 'available' in stock_text:
                    availability = "in_stock"
                elif 'out of stock' in stock_text or 'unavailable' in stock_text:
                    availability = "out_of_stock"
            
            # Extract volume in ml
            volume_ml = None
            if name:
                volume_match = re.search(r'(\d+)\s*ml', name.lower())
                if volume_match:
                    volume_ml = float(volume_match.group(1))
            
            return ParsedPDP(
                name=name,
                brand=brand,
                price=price,
                currency="GBP",
                ingredients_raw=self._clean_text(ingredients_raw),
                image_url=image_url,
                availability=availability,
                volume_ml=volume_ml
            )
    
    async def live_check(self, product, postcode: Optional[str] = None) -> LiveResult:
        """Perform live check by fetching current product page"""
        try:
            # Use the PDP fetch to get current information
            pdp_data = await self.fetch_pdp(product.pdp_url)
            
            # Map availability
            in_stock = "unknown"
            if pdp_data.availability == "in_stock":
                in_stock = "in_stock"
            elif pdp_data.availability == "out_of_stock":
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
            logger.error(f"Boots live check failed for {product.retailer_sku}: {e}")
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