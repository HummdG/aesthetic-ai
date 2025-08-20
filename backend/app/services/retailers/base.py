"""
Base protocol for retailer adapters
"""
from typing import Protocol, List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProductSeed:
    """Data structure for product information from retailer search"""
    retailer_sku: str
    name: str
    brand: str
    price: Optional[float]
    currency: str
    pdp_url: str
    image_url: Optional[str]
    gtin: Optional[str] = None


@dataclass
class ParsedPDP:
    """Data structure for parsed product detail page"""
    name: str
    brand: str
    price: Optional[float]
    currency: str
    ingredients_raw: str
    image_url: Optional[str]
    gtin: Optional[str] = None
    availability: str = "unknown"
    volume_ml: Optional[float] = None


@dataclass
class LiveResult:
    """Data structure for live verification result"""
    price: Optional[float]
    currency: Optional[str]
    in_stock: str  # 'in_stock', 'out_of_stock', 'unknown'
    deliverable_postcode: Optional[str]
    ingredients_raw: Optional[str]
    status_code: Optional[str]
    fetched_at: datetime
    source: str = "live_check"


class RetailerAdapter(Protocol):
    """Protocol for retailer adapters"""
    
    @property
    def retailer(self) -> str:
        """Retailer name identifier"""
        ...
    
    @property
    def country(self) -> str:
        """Country code this adapter serves"""
        ...
    
    async def search(self, query: str, country: str) -> List[ProductSeed]:
        """
        Search for products by query
        
        Args:
            query: Search query string
            country: Country code
            
        Returns:
            List of ProductSeed objects
        """
        ...
    
    async def fetch_pdp(self, url_or_sku: str) -> ParsedPDP:
        """
        Fetch and parse product detail page
        
        Args:
            url_or_sku: Product URL or SKU
            
        Returns:
            ParsedPDP object with product details
        """
        ...
    
    async def live_check(self, product, postcode: Optional[str] = None) -> LiveResult:
        """
        Perform live verification of product availability and pricing
        
        Args:
            product: Product model instance
            postcode: Optional postcode for delivery check
            
        Returns:
            LiveResult object with current status
        """
        ... 