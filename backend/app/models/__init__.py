"""
Data models and schemas for the Aesthetic AI Backend
"""

# Core analysis models
from .schemas import (
    IngredientRecommendation,
    SkinAnalysisResponse,
    HealthCheckResponse,
    ErrorResponse,
    TreatmentRecommendation,
    ProductMatchRequest,
    MatchedProduct,
    ProductMatchResponse
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
from .product import Product, LiveSnapshot

__all__ = [
    # Core analysis models
    "IngredientRecommendation",
    "SkinAnalysisResponse", 
    "HealthCheckResponse",
    "ErrorResponse",
    "TreatmentRecommendation",
    "ProductMatchRequest",
    "MatchedProduct",
    "ProductMatchResponse",
    
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
    "SkinAnalysis",
    "Product",
    "LiveSnapshot"
]