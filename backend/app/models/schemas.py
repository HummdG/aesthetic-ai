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
    firebase: str = Field(..., description="Firebase Admin SDK status")

class ErrorResponse(BaseModel):
    """Model for error responses"""
    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Optional error code")

class TreatmentRecommendation(BaseModel):
    """Model for individual treatment recommendation"""
    treatment: str = Field(..., description="Treatment name (e.g., 'Lip Enhancement Filler')")
    area: str = Field(..., description="Treatment area (e.g., 'Lip volume and definition')")
    severity: str = Field(..., description="Severity level (e.g., 'Mild', 'Moderate', 'Enhancement')")
    dosage: Optional[str] = Field(None, description="Recommended dosage (e.g., '15-20 units')")
    volume: Optional[str] = Field(None, description="Volume required (e.g., '0.5-1.0ml')")
    estimatedCost: str = Field(..., description="Estimated cost range (e.g., '£400-500')")


# Product matching schemas
class ProductMatchRequest(BaseModel):
    """Model for product matching request"""
    country: str = Field(..., description="ISO country code (e.g., 'GB')")
    location: Optional[dict] = Field(None, description="Location details with optional postcode, lat, lon")
    required_ingredients: List[str] = Field(..., description="List of required skincare ingredients")
    avoid_ingredients: Optional[List[str]] = Field(default=[], description="List of ingredients to avoid")
    max_price: Optional[float] = Field(None, description="Maximum price filter")
    currency: Optional[str] = Field(None, description="Preferred currency (inferred from country if not provided)")


class MatchedProduct(BaseModel):
    """Model for matched product result"""
    id: str = Field(..., description="Product ID")
    retailer: str = Field(..., description="Retailer name")
    retailer_sku: str = Field(..., description="Retailer SKU")
    brand: str = Field(..., description="Product brand")
    name: str = Field(..., description="Product name")
    country: str = Field(..., description="Country code")
    currency: str = Field(..., description="Currency code")
    price: Optional[float] = Field(None, description="Current price")
    price_per_ml: Optional[float] = Field(None, description="Price per ml")
    formatted_price: Optional[str] = Field(None, description="Formatted price string")
    pdp_url: str = Field(..., description="Product detail page URL")
    image_url: Optional[str] = Field(None, description="Product image URL")
    ingredients_normalised: List[str] = Field(..., description="Normalised ingredient list")
    availability: str = Field(..., description="Availability status")
    score: float = Field(..., description="Matching score")
    last_verified: Optional[str] = Field(None, description="Last verification timestamp")


class ProductMatchResponse(BaseModel):
    """Model for product matching response"""
    generated_at: str = Field(..., description="Response generation timestamp")
    currency: str = Field(..., description="Currency used for pricing")
    results: List[MatchedProduct] = Field(..., description="List of matched products")



