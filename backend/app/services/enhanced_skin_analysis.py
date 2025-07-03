# backend/app/services/enhanced_skin_analysis.py
from typing import Optional, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from ..models.schemas import SkinAnalysisResponse, IngredientRecommendation
from ..models.survey_schemas import UserSurveyData
from .survey_analysis import SurveyAnalysisService
import json

class EnhancedSkinAnalysisService:
    """Enhanced skin analysis service that incorporates user survey data"""
    
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=openai_api_key,
            temperature=0.3,
            max_tokens=2000
        )
        self.survey_service = SurveyAnalysisService()
    
    def analyze_skin_with_survey(
        self, 
        image_data: bytes, 
        survey_data: Optional[UserSurveyData] = None
    ) -> SkinAnalysisResponse:
        """Analyze skin image with optional survey data for personalization"""
        
        # Create enhanced system prompt
        system_prompt = self._create_enhanced_system_prompt(survey_data)
        
        # Create user message with image
        user_message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": self._create_analysis_prompt(survey_data)
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_data}"
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
            return self._parse_fallback_response(response.content, survey_data)
    
    def _create_enhanced_system_prompt(self, survey_data: Optional[UserSurveyData]) -> str:
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
        
        if survey_data:
            # Add personalized context
            user_context = self.survey_service.create_llm_context(survey_data)
            safety_warnings = self.survey_service.generate_safety_warnings(survey_data)
            age_recs = self.survey_service.get_age_recommendations(survey_data.basic_info.age)
            skin_type_recs = self.survey_service.get_skin_type_recommendations(survey_data.skin_info.skin_type)
            
            base_prompt += f"""

USER PROFILE:
{user_context}

SAFETY CONSIDERATIONS:
{chr(10).join(f"- {warning}" for warning in safety_warnings)}

AGE-APPROPRIATE RECOMMENDATIONS:
{chr(10).join(f"- {rec}" for rec in age_recs)}

SKIN TYPE CONSIDERATIONS:
{chr(10).join(f"- {rec}" for rec in skin_type_recs)}

PERSONALIZATION INSTRUCTIONS:
- Tailor recommendations based on user's experience level
- Consider medical history and allergies
- Adjust complexity based on age and skin type
- Include specific safety warnings where relevant"""
        
        return base_prompt
    
    def _create_analysis_prompt(self, survey_data: Optional[UserSurveyData]) -> str:
        """Create analysis prompt with survey context"""
        base_prompt = "Please analyze this facial image for skin conditions and provide personalized skincare recommendations."
        
        if survey_data:
            base_prompt += f"""

This analysis is for {survey_data.username}. Please provide recommendations that consider their:
- Medical history and allergies
- Current skin type ({survey_data.skin_info.skin_type})
- Age ({survey_data.basic_info.age})
- Experience level ({'experienced' if survey_data.skin_info.has_used_skincare else 'beginner'})
- Special considerations (pregnancy, medical conditions, etc.)

Ensure all recommendations are safe and appropriate for this specific user."""
        
        return base_prompt
    
    def _parse_fallback_response(self, content: str, survey_data: Optional[UserSurveyData]) -> SkinAnalysisResponse:
        """Fallback parsing if JSON parsing fails"""
        # Basic fallback implementation
        return SkinAnalysisResponse(
            confidence=85,
            primaryCondition="Unable to parse detailed analysis",
            secondaryConditions=[],
            skinType=survey_data.skin_info.skin_type if survey_data else "unknown",
            ingredientRecommendations=[
                IngredientRecommendation(
                    ingredient="Gentle Cleanser",
                    purpose="Basic cleansing",
                    concentration="N/A",
                    application="Daily, morning and evening",
                    benefits="Removes impurities without irritation"
                )
            ],
            description="Analysis parsing failed. Please try again or contact support."
        )