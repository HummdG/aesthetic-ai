"""
Data models and schemas for the Aesthetic AI Backend
"""

# Core analysis models
from .schemas import (
    IngredientRecommendation,
    SkinAnalysisResponse,
    HealthCheckResponse,
    ErrorResponse,
    TreatmentRecommendation
)

# Survey models (if you need them elsewhere)
from .survey_schemas import (
    UserMedicalHistory,
    UserSkinInfo,
    UserBasicInfo,
    UserSurveyData
)

__all__ = [
    # Core analysis models
    "IngredientRecommendation",
    "SkinAnalysisResponse", 
    "HealthCheckResponse",
    "ErrorResponse",
    "TreatmentRecommendation",
    
    # Survey models
    "UserMedicalHistory",
    "UserSkinInfo", 
    "UserBasicInfo",
    "UserSurveyData"
]