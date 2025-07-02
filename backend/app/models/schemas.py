"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class TreatmentRecommendation(BaseModel):
    """Model for individual treatment recommendation"""
    treatment: str = Field(..., description="Name of the recommended treatment")
    area: str = Field(..., description="Facial area to be treated")
    severity: str = Field(..., description="Severity level: Mild, Moderate, or Significant")
    dosage: Optional[str] = Field(None, description="Recommended dosage if applicable")
    volume: Optional[str] = Field(None, description="Recommended volume if applicable")
    estimatedCost: str = Field(..., description="Estimated cost range in GBP")

class AnalysisResponse(BaseModel):
    """Model for complete analysis response"""
    confidence: int = Field(..., ge=1, le=100, description="Confidence percentage (1-100)")
    recommendations: List[TreatmentRecommendation] = Field(..., description="List of treatment recommendations")
    totalCost: str = Field(..., description="Total estimated cost range in GBP")

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