# ===== FILE 1: backend/app/models/schemas.py =====
"""
Pydantic models for skin condition analysis request/response schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class IngredientRecommendation(BaseModel):
    """Model for individual ingredient recommendation"""
    ingredient: str = Field(..., description="Name of the recommended skincare ingredient")
    purpose: str = Field(..., description="What this ingredient does for the skin condition")
    concentration: Optional[str] = Field(None, description="Recommended concentration range")
    application: str = Field(..., description="How to apply this ingredient")
    benefits: str = Field(..., description="Key benefits for the detected skin condition")

class SkinAnalysisResponse(BaseModel):
    """Model for skin condition analysis response"""
    confidence: int = Field(..., ge=1, le=100, description="Confidence percentage (1-100)")
    primaryCondition: str = Field(..., description="Primary detected skin condition")
    secondaryConditions: List[str] = Field(default=[], description="Additional skin concerns detected")
    skinType: str = Field(..., description="Overall skin type classification")
    ingredientRecommendations: List[IngredientRecommendation] = Field(..., description="List of ingredient recommendations")
    description: str = Field(..., description="Detailed description of the skin analysis")

class HealthCheckResponse(BaseModel):
    """Model for health check response"""
    status: str = Field(..., description="Health status")
    langchain: str = Field(..., description="LangChain status")
    openai_key: str = Field(..., description="OpenAI key status")
    model: str = Field(..., description="AI model being used")
    currency: str = Field(..., description="Currency for pricing")
    timestamp: str = Field(..., description="Current timestamp")

class ErrorResponse(BaseModel):
    """Model for error responses"""
    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Optional error code")





