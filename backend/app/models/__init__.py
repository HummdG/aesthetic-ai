# ===== FILE 2: backend/app/models/__init__.py =====
"""
Pydantic models and schemas
"""

from .schemas import (
    IngredientRecommendation,
    SkinAnalysisResponse,
    HealthCheckResponse,
    ErrorResponse
)

__all__ = [
    "IngredientRecommendation",
    "SkinAnalysisResponse", 
    "HealthCheckResponse",
    "ErrorResponse"
]