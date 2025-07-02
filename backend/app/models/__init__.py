__all__ = [
    "IngredientRecommendation",
    "SkinAnalysisResponse", 
    "HealthCheckResponse",
    "ErrorResponse",
    "TreatmentRecommendation"  # ← Add this line
]

# Import statement to add:
from .schemas import (
    IngredientRecommendation,
    SkinAnalysisResponse,
    HealthCheckResponse,
    ErrorResponse,
    TreatmentRecommendation  # ← Add this line
)