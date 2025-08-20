"""
Ingredient normalisation utilities for skincare product matching
"""
import re
import unicodedata
from typing import List, Dict, Set
from rapidfuzz import fuzz, process

# INCI alias dictionary for common skincare actives
INCI_ALIASES = {
    # Niacinamide variants
    "niacinamide": ["nicotinamide", "vitamin b3", "vitamin b-3"],
    "nicotinamide": ["niacinamide", "vitamin b3", "vitamin b-3"],
    
    # Salicylic acid variants
    "salicylic acid": ["bha", "beta hydroxy acid", "2-hydroxybenzoic acid"],
    "bha": ["salicylic acid", "beta hydroxy acid"],
    
    # Vitamin C variants
    "ascorbic acid": ["vitamin c", "l-ascorbic acid", "magnesium ascorbyl phosphate", "sodium ascorbyl phosphate"],
    "vitamin c": ["ascorbic acid", "l-ascorbic acid"],
    "l-ascorbic acid": ["ascorbic acid", "vitamin c"],
    "magnesium ascorbyl phosphate": ["vitamin c", "ascorbic acid", "map"],
    "sodium ascorbyl phosphate": ["vitamin c", "ascorbic acid", "sap"],
    
    # Retinol variants
    "retinol": ["vitamin a", "retinyl palmitate", "retinyl acetate"],
    "retinyl palmitate": ["retinol", "vitamin a"],
    "retinyl acetate": ["retinol", "vitamin a"],
    "tretinoin": ["retinoic acid", "all-trans retinoic acid"],
    "adapalene": ["differin"],
    
    # Alpha hydroxy acids
    "glycolic acid": ["aha", "alpha hydroxy acid", "hydroxyacetic acid"],
    "lactic acid": ["aha", "alpha hydroxy acid", "2-hydroxypropanoic acid"],
    "mandelic acid": ["aha", "alpha hydroxy acid"],
    "aha": ["glycolic acid", "lactic acid", "alpha hydroxy acid"],
    
    # Hyaluronic acid variants
    "hyaluronic acid": ["sodium hyaluronate", "ha", "hyaluronan"],
    "sodium hyaluronate": ["hyaluronic acid", "ha"],
    
    # Ceramides
    "ceramides": ["ceramide np", "ceramide ap", "ceramide eop", "phytosphingosine"],
    "ceramide np": ["ceramides"],
    "ceramide ap": ["ceramides"],
    "ceramide eop": ["ceramides"],
    
    # Azelaic acid
    "azelaic acid": ["nonanedioic acid"],
    
    # Vitamin E
    "tocopherol": ["vitamin e", "alpha-tocopherol", "tocopheryl acetate"],
    "vitamin e": ["tocopherol", "alpha-tocopherol"],
    "tocopheryl acetate": ["vitamin e", "tocopherol"],
    
    # Peptides
    "peptides": ["palmitoyl pentapeptide", "acetyl hexapeptide", "copper peptides"],
    "palmitoyl pentapeptide": ["peptides", "matrixyl"],
    "acetyl hexapeptide": ["peptides", "argireline"],
    "copper peptides": ["peptides", "copper tripeptide"],
    
    # Zinc oxide
    "zinc oxide": ["zno"],
    
    # Common ingredients
    "aqua": ["water"],
    "water": ["aqua"],
    "dimethicone": ["silicone"],
    "cyclomethicone": ["silicone"],
    "isopropyl myristate": ["ipm"],
    "butylene glycol": ["bg"],
    "propylene glycol": ["pg"],
    "phenoxyethanol": ["preservative"],
    "methylparaben": ["preservative"],
    "ethylparaben": ["preservative"],
    "sodium benzoate": ["preservative"],
    "potassium sorbate": ["preservative"],
}

def normalise_term(ingredient: str) -> str:
    """
    Normalise a single ingredient term
    
    Args:
        ingredient: Raw ingredient string
        
    Returns:
        Normalised ingredient string
    """
    if not ingredient or not isinstance(ingredient, str):
        return ""
    
    # Convert to lowercase
    normalised = ingredient.lower().strip()
    
    # Remove accents and diacritical marks
    normalised = unicodedata.normalize('NFD', normalised)
    normalised = ''.join(char for char in normalised if unicodedata.category(char) != 'Mn')
    
    # Remove punctuation and special characters, keep spaces and hyphens
    normalised = re.sub(r'[^\w\s\-]', '', normalised)
    
    # Remove extra whitespace
    normalised = re.sub(r'\s+', ' ', normalised).strip()
    
    # Check for exact aliases first
    if normalised in INCI_ALIASES:
        return normalised
    
    # Check for fuzzy matches with known ingredients
    all_known_ingredients = set(INCI_ALIASES.keys())
    for aliases in INCI_ALIASES.values():
        all_known_ingredients.update(aliases)
    
    # Use rapidfuzz for fuzzy matching with threshold ≥ 88
    best_match = process.extractOne(
        normalised, 
        all_known_ingredients, 
        scorer=fuzz.ratio, 
        score_cutoff=88
    )
    
    if best_match:
        matched_term = best_match[0]
        # If the matched term is an alias, use the primary term
        for primary, aliases in INCI_ALIASES.items():
            if matched_term == primary or matched_term in aliases:
                return primary
        return matched_term
    
    return normalised


def normalise_list(raw_ingredients) -> List[str]:
    """
    Normalise a list or string of ingredients
    
    Args:
        raw_ingredients: Either a string (comma-separated) or list of ingredient strings
        
    Returns:
        List of normalised ingredient strings
    """
    if not raw_ingredients:
        return []
    
    # Handle string input (comma-separated)
    if isinstance(raw_ingredients, str):
        # Split by common separators
        ingredients = re.split(r'[,;]\s*', raw_ingredients)
    elif isinstance(raw_ingredients, list):
        ingredients = raw_ingredients
    else:
        return []
    
    # Normalise each ingredient
    normalised = []
    for ingredient in ingredients:
        if isinstance(ingredient, str) and ingredient.strip():
            norm_ingredient = normalise_term(ingredient.strip())
            if norm_ingredient and norm_ingredient not in normalised:
                normalised.append(norm_ingredient)
    
    return normalised


def get_ingredient_aliases(ingredient: str) -> List[str]:
    """
    Get all known aliases for an ingredient
    
    Args:
        ingredient: Normalised ingredient name
        
    Returns:
        List of aliases including the original term
    """
    normalised = normalise_term(ingredient)
    aliases = [normalised]
    
    if normalised in INCI_ALIASES:
        aliases.extend(INCI_ALIASES[normalised])
    
    # Also check if this ingredient is an alias of another
    for primary, alias_list in INCI_ALIASES.items():
        if normalised in alias_list and primary not in aliases:
            aliases.append(primary)
            aliases.extend(alias_list)
    
    return list(set(aliases))


def expand_ingredient_search_terms(ingredients: List[str]) -> Set[str]:
    """
    Expand ingredient list to include all known aliases for searching
    
    Args:
        ingredients: List of normalised ingredient names
        
    Returns:
        Set of all search terms including aliases
    """
    search_terms = set()
    
    for ingredient in ingredients:
        aliases = get_ingredient_aliases(ingredient)
        search_terms.update(aliases)
    
    return search_terms


def check_ingredient_match(product_ingredients: List[str], required_ingredients: List[str]) -> bool:
    """
    Check if product contains all required ingredients (considering aliases)
    
    Args:
        product_ingredients: List of normalised product ingredients
        required_ingredients: List of required ingredients
        
    Returns:
        True if all required ingredients are found in product
    """
    if not required_ingredients:
        return True
    
    # Expand required ingredients to include aliases
    required_terms = expand_ingredient_search_terms(required_ingredients)
    
    # Expand product ingredients to include aliases
    product_terms = expand_ingredient_search_terms(product_ingredients)
    
    # Check if any required term matches any product term
    for req_ingredient in required_ingredients:
        req_aliases = get_ingredient_aliases(req_ingredient)
        if not any(alias in product_terms for alias in req_aliases):
            return False
    
    return True


def check_avoid_ingredients(product_ingredients: List[str], avoid_ingredients: List[str]) -> bool:
    """
    Check if product contains any ingredients to avoid
    
    Args:
        product_ingredients: List of normalised product ingredients
        avoid_ingredients: List of ingredients to avoid
        
    Returns:
        True if product contains ingredients to avoid, False otherwise
    """
    if not avoid_ingredients:
        return False
    
    # Expand avoid ingredients to include aliases
    avoid_terms = expand_ingredient_search_terms(avoid_ingredients)
    
    # Expand product ingredients to include aliases
    product_terms = expand_ingredient_search_terms(product_ingredients)
    
    # Check if any avoid term matches any product term
    return bool(avoid_terms.intersection(product_terms)) 