"""
Pricing calculation utilities
"""
import re
from typing import List, Tuple
from app.models.schemas import TreatmentRecommendation
from app.config import settings

def extract_price_range(cost_str: str) -> Tuple[int, int]:
    """
    Extract min and max prices from cost string like '£400-500' or '£1,200-1,500'
    
    Args:
        cost_str: Cost string containing price range
        
    Returns:
        Tuple of (min_price, max_price)
    """
    try:
        # Remove currency symbol and commas, extract numbers
        numbers = re.findall(r'\d+', cost_str.replace(',', ''))
        if len(numbers) >= 2:
            return int(numbers[0]), int(numbers[1])
        elif len(numbers) == 1:
            price = int(numbers[0])
            return price, price
        else:
            return 0, 0
    except Exception:
        return 0, 0

def calculate_total_cost(recommendations: List[TreatmentRecommendation]) -> str:
    """
    Calculate total cost range from all recommendations
    
    Args:
        recommendations: List of treatment recommendations
        
    Returns:
        Formatted total cost string in configured currency
    """
    total_min = 0
    total_max = 0
    
    for rec in recommendations:
        min_cost, max_cost = extract_price_range(rec.estimatedCost)
        total_min += min_cost
        total_max += max_cost
    
    # Format with currency symbol and commas
    if total_min == total_max:
        return f"{settings.CURRENCY_SYMBOL}{total_min:,}"
    else:
        return f"{settings.CURRENCY_SYMBOL}{total_min:,} - {settings.CURRENCY_SYMBOL}{total_max:,}"

def validate_price_format(price_str: str) -> bool:
    """
    Validate if price string follows expected format
    
    Args:
        price_str: Price string to validate
        
    Returns:
        True if format is valid, False otherwise
    """
    # Should match patterns like £400, £400-500, £1,200-1,500
    pattern = rf'^{re.escape(settings.CURRENCY_SYMBOL)}\d{{1,3}}(?:,\d{{3}})*(?:-\d{{1,3}}(?:,\d{{3}})*)?$'
    return bool(re.match(pattern, price_str))

def format_price(amount: int) -> str:
    """
    Format price amount with currency symbol and commas
    
    Args:
        amount: Price amount as integer
        
    Returns:
        Formatted price string
    """
    return f"{settings.CURRENCY_SYMBOL}{amount:,}"

def format_price_range(min_amount: int, max_amount: int) -> str:
    """
    Format price range with currency symbol and commas
    
    Args:
        min_amount: Minimum price
        max_amount: Maximum price
        
    Returns:
        Formatted price range string
    """
    if min_amount == max_amount:
        return format_price(min_amount)
    return f"{format_price(min_amount)} - {format_price(max_amount)}"