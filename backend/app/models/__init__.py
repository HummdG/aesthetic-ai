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

# Database models
from .database import Base, get_db, create_tables, drop_tables
from .user import User, UserSurvey, SkinAnalysis

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
    "UserSurveyData",
    
    # Database models
    "Base",
    "get_db",
    "create_tables",
    "drop_tables",
    "User",
    "UserSurvey",
    "SkinAnalysis"
]