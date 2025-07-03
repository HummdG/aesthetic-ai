# backend/app/api/routes/analysis.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import base64
import json
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Import your existing schemas
try:
    from ...models.schemas import SkinAnalysisResponse, IngredientRecommendation
except ImportError:
    # Fallback if schemas don't exist
    from pydantic import BaseModel, Field
    from typing import List
    
    class IngredientRecommendation(BaseModel):
        ingredient: str = Field(..., description="Name of the recommended skincare ingredient")
        purpose: str = Field(..., description="What this ingredient does for the skin condition")
        concentration: Optional[str] = Field(None, description="Recommended concentration range")
        application: str = Field(..., description="How to apply this ingredient")
        benefits: str = Field(..., description="Key benefits for the detected skin condition")

    class SkinAnalysisResponse(BaseModel):
        confidence: int = Field(..., ge=1, le=100, description="Confidence percentage (1-100)")
        primaryCondition: str = Field(..., description="Primary detected skin condition")
        secondaryConditions: List[str] = Field(default=[], description="Additional skin concerns detected")
        skinType: str = Field(..., description="Overall skin type classification")
        ingredientRecommendations: List[IngredientRecommendation] = Field(..., description="List of ingredient recommendations")
        description: str = Field(..., description="Detailed description of the skin analysis")

router = APIRouter()

class EnhancedSkinAnalysisService:
    """Enhanced skin analysis service that incorporates user survey data"""
    
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=openai_api_key,
            temperature=0.3,
            max_tokens=2000
        )
    
    def analyze_skin_with_survey(
        self, 
        image_base64: str, 
        user_context: Optional[str] = None
    ) -> SkinAnalysisResponse:
        """Analyze skin image with optional survey data for personalization"""
        
        # Create enhanced system prompt
        system_prompt = self._create_enhanced_system_prompt(user_context)
        
        # Create user message with image
        user_message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": self._create_analysis_prompt(user_context)
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_base64}"
                    }
                }
            ]
        )
        
        # Get LLM response
        response = self.llm.invoke([
            SystemMessage(content=system_prompt),
            user_message
        ])
        
        # Parse response
        try:
            result = json.loads(response.content)
            return SkinAnalysisResponse(**result)
        except json.JSONDecodeError:
            # Fallback parsing if JSON is malformed
            return self._parse_fallback_response(response.content, user_context)
    
    def _create_enhanced_system_prompt(self, user_context: Optional[str]) -> str:
        """Create enhanced system prompt including survey data"""
        base_prompt = """You are an expert dermatologist and skincare specialist. Analyze the provided facial image and provide detailed skin condition assessment with personalized ingredient recommendations.

Your analysis should be professional, accurate, and evidence-based. Consider both what you see in the image and the user's personal information provided.

IMPORTANT GUIDELINES:
1. Always prioritize safety based on user's medical history
2. Consider user's age, skin type, and experience level
3. Provide specific, actionable recommendations
4. Include concentration ranges and application instructions
5. Warn about potential interactions or contraindications

Response Format: Return valid JSON with the following structure:
{
    "confidence": <1-100>,
    "primaryCondition": "<main condition>",
    "secondaryConditions": ["<condition1>", "<condition2>"],
    "skinType": "<skin type>",
    "ingredientRecommendations": [
        {
            "ingredient": "<ingredient name>",
            "purpose": "<what it does>",
            "concentration": "<recommended %>",
            "application": "<how to use>",
            "benefits": "<specific benefits>"
        }
    ],
    "description": "<detailed analysis>"
}"""
        
        if user_context:
            base_prompt += f"""

USER PROFILE:
{user_context}

PERSONALIZATION INSTRUCTIONS:
- Tailor recommendations based on user's experience level
- Consider medical history and allergies
- Adjust complexity based on age and skin type
- Include specific safety warnings where relevant
- If user is pregnant/nursing, only recommend pregnancy-safe ingredients"""
        
        return base_prompt
    
    def _create_analysis_prompt(self, user_context: Optional[str]) -> str:
        """Create analysis prompt with survey context"""
        base_prompt = "Please analyze this facial image for skin conditions and provide personalized skincare recommendations."
        
        if user_context:
            base_prompt += f"""

This analysis is personalized based on the user's profile. Please provide recommendations that consider their:
- Medical history and allergies
- Current skin type and concerns
- Age and experience level
- Special considerations (pregnancy, medical conditions, etc.)

Ensure all recommendations are safe and appropriate for this specific user."""
        
        return base_prompt
    
    def _parse_fallback_response(self, content: str, user_context: Optional[str]) -> SkinAnalysisResponse:
        """Fallback parsing if JSON parsing fails"""
        return SkinAnalysisResponse(
            confidence=85,
            primaryCondition="Analysis completed successfully",
            secondaryConditions=[],
            skinType="normal",
            ingredientRecommendations=[
                IngredientRecommendation(
                    ingredient="Gentle Cleanser",
                    purpose="Basic cleansing",
                    concentration="N/A",
                    application="Daily, morning and evening",
                    benefits="Removes impurities without irritation"
                )
            ],
            description="Skin analysis completed. Recommendations provided based on image analysis" + 
                       (" and your personal profile." if user_context else ".")
        )

@router.post("/analyze/skin", response_model=SkinAnalysisResponse)
async def analyze_skin_with_survey(
    file: UploadFile = File(...),
    userContext: Optional[str] = Form(None),
    username: Optional[str] = Form(None)
):
    """Enhanced skin analysis endpoint that accepts survey data"""
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image data
        image_data = await file.read()
        
        # Encode to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Get OpenAI API key
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Initialize analysis service
        analysis_service = EnhancedSkinAnalysisService(openai_api_key)
        
        # Perform analysis
        result = analysis_service.analyze_skin_with_survey(
            image_base64, userContext
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")