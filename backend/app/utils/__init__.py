# Replace your app/utils/__init__.py content with this:

"""
Utility functions and helpers
"""

from .pricing import (
    extract_price_range,
    calculate_total_cost,
    validate_price_format,
    format_price,
    format_price_range
)
from .parsing import (
    parse_skin_analysis_response,    # ✅ This exists
    clean_llm_response,              # ✅ This exists
    validate_skin_analysis_response  # ✅ This exists (note the correct name)
)
from .ingredients import (
    normalise_term,
    normalise_list,
    get_ingredient_aliases,
    expand_ingredient_search_terms,
    check_ingredient_match,
    check_avoid_ingredients
)

__all__ = [
    # Pricing utilities
    "extract_price_range",
    "calculate_total_cost", 
    "validate_price_format",
    "format_price",
    "format_price_range",
    # Parsing utilities
    "parse_skin_analysis_response",
    "clean_llm_response",
    "validate_skin_analysis_response",
    # Ingredient utilities
    "normalise_term",
    "normalise_list",
    "get_ingredient_aliases",
    "expand_ingredient_search_terms",
    "check_ingredient_match",
    "check_avoid_ingredients"
]