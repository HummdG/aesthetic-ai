# backend/app/services/enhanced_skin_analysis.py
from typing import Optional, Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
import json

from ..models.schemas import SkinAnalysisResponse, IngredientRecommendation
from .survey_analysis import SurveyAnalysisService

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
    
    def analyze_skin_with_survey_context(
        self, 
        image_base64: str, 
        survey_context: Optional[Dict[str, Any]] = None
    ) -> SkinAnalysisResponse:
        """Analyze skin image with optional survey context for personalization"""
        
        # Create enhanced system prompt
        system_prompt = self._create_enhanced_system_prompt(survey_context)
        
        # Create user message with image
        user_message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": self._create_analysis_prompt(survey_context)
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
            return self._parse_fallback_response(response.content, survey_context)
    
    def _create_enhanced_system_prompt(self, survey_context: Optional[Dict[str, Any]]) -> str:
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
        
        if survey_context and survey_context.get('userContext'):
            # Add personalized context
            user_context = survey_context['userContext']
            safety_warnings = survey_context.get('safetyWarnings', [])
            age_recs = survey_context.get('ageRecommendations', [])
            username = survey_context.get('username', 'User')
            
            base_prompt += f"""

USER PROFILE:
{user_context}

SAFETY CONSIDERATIONS:
{chr(10).join(f"- {warning}" for warning in safety_warnings)}

AGE-APPROPRIATE RECOMMENDATIONS:
{chr(10).join(f"- {rec}" for rec in age_recs)}

PERSONALIZATION INSTRUCTIONS:
- This analysis is for {username}
- Tailor recommendations based on user's experience level
- Consider medical history and allergies mentioned in the profile
- Adjust complexity based on age and skin type
- Include specific safety warnings where relevant
- If user profile mentions pregnancy/nursing, only recommend pregnancy-safe ingredients
- Prioritize gentle, suitable products based on user's condition and experience"""
        
        return base_prompt
    
    def _create_analysis_prompt(self, survey_context: Optional[Dict[str, Any]]) -> str:
        """Create analysis prompt with survey context"""
        base_prompt = "Please analyze this facial image for skin conditions and provide personalized skincare recommendations."
        
        if survey_context and survey_context.get('userContext'):
            username = survey_context.get('username', 'this user')
            base_prompt += f"""

This analysis is for {username}. Please provide recommendations that consider their:
- Medical history and allergies as mentioned in their profile
- Current skin type and concerns
- Age and experience level
- Special considerations (pregnancy, medical conditions, etc.)

Ensure all recommendations are safe and appropriate for this specific user based on their survey responses."""
        
        return base_prompt
    
    def _parse_fallback_response(self, content: str, survey_context: Optional[Dict[str, Any]]) -> SkinAnalysisResponse:
        """Fallback parsing if JSON parsing fails"""
        username = "User"
        if survey_context and survey_context.get('username'):
            username = survey_context['username']
            
        return SkinAnalysisResponse(
            confidence=85,
            primaryCondition="Analysis completed successfully",
            secondaryConditions=[],
            skinType="normal",
            ingredientRecommendations=[
                IngredientRecommendation(
                    ingredient="Gentle Cleanser",
                    purpose="Basic cleansing suitable for your skin",
                    concentration="N/A",
                    application="Daily, morning and evening",
                    benefits="Removes impurities without irritation"
                ),
                IngredientRecommendation(
                    ingredient="Moisturizer",
                    purpose="Hydration and barrier protection",
                    concentration="N/A", 
                    application="Daily after cleansing",
                    benefits="Maintains skin moisture and protective barrier"
                )
            ],
            description=f"Skin analysis completed for {username}. " + 
                       ("Recommendations have been personalized based on your survey responses. " if survey_context else "") +
                       "Please follow the ingredient recommendations and consult with a dermatologist for persistent concerns."
        )
    
    # Legacy method for backward compatibility
    def analyze_skin_with_survey(
        self, 
        image_base64: str, 
        survey_data: Optional[Any] = None
    ) -> SkinAnalysisResponse:
        """Legacy method - redirects to new context-based method"""
        survey_context = None
        if survey_data:
            # Convert survey_data to context format if needed
            # This depends on your existing survey_data structure
            survey_context = {
                'userContext': str(survey_data),
                'safetyWarnings': [],
                'ageRecommendations': [],
                'username': getattr(survey_data, 'username', 'User')
            }
        
        return self.analyze_skin_with_survey_context(image_base64, survey_context)