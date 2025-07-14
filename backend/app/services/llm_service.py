"""
LLM service for handling OpenAI model interactions - Skin Condition Analysis
"""
import logging
import base64
from typing import Optional, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi import HTTPException

from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """Service for managing OpenAI LLM interactions for skin analysis"""
    
    def __init__(self):
        self._client: Optional[ChatOpenAI] = None
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize the OpenAI client with error handling"""
        try:
            if not settings.openai_key_available:
                logger.warning("⚠️ OpenAI API key not available - LLM service disabled")
                self._client = None
                return
            
            self._client = ChatOpenAI(
                model=settings.OPENAI_MODEL,
                temperature=settings.OPENAI_TEMPERATURE,
                api_key=settings.OPENAI_API_KEY  # type: ignore
            )
            
            logger.info(f"✅ LLM service initialized with model: {settings.OPENAI_MODEL}")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize LLM client: {e}")
            self._client = None
    
    @property
    def is_available(self) -> bool:
        """Check if the LLM service is available"""
        return self._client is not None and settings.openai_key_available
    
    def get_status(self) -> dict:
        """Get service status information"""
        return {
            "status": "available" if self.is_available else "unavailable",
            "model": settings.OPENAI_MODEL if self.is_available else None,
            "temperature": settings.OPENAI_TEMPERATURE if self.is_available else None,
            "api_key_configured": settings.openai_key_available
        }
    
    async def analyze_skin_image(
        self, 
        base64_image: str, 
        analysis_id: int,
        survey_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Analyze an image for skin condition assessment using OpenAI's vision model
        
        Args:
            base64_image: Base64 encoded image string
            analysis_id: Unique analysis identifier for logging
            survey_data: Optional user survey data for personalization
            
        Returns:
            Raw response from the LLM
            
        Raises:
            HTTPException: If analysis fails or service unavailable
        """
        if not self.is_available:
            logger.error(f"❌ Analysis {analysis_id} failed - LLM service unavailable")
            raise HTTPException(
                status_code=503,
                detail="LLM service is currently unavailable"
            )
        
        try:
            logger.info(f"🤖 Starting skin analysis {analysis_id} with {'personalized' if survey_data else 'basic'} context")
            
            # Create the system prompt with user data
            system_prompt = self._create_enhanced_system_prompt(survey_data)
            
            # Create the user prompt for analysis
            user_prompt = self._create_analysis_prompt(survey_data)
            
            # Create the messages
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(
                    content=[
                        {
                            "type": "text",
                            "text": user_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                )
            ]
            
            # Get response from LLM
            response = await self._client.ainvoke(messages)  # type: ignore
            response_text = str(response.content)
            
            logger.info(f"✅ Skin analysis {analysis_id} completed - Response length: {len(response_text)}")
            
            return response_text
            
        except Exception as e:
            logger.error(f"❌ Skin analysis {analysis_id} failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Skin analysis failed: {str(e)}"
            )
    
    def _create_enhanced_system_prompt(self, survey_data: Optional[Dict[str, Any]]) -> str:
        """Create enhanced system prompt including user survey data"""
        base_prompt = """You are an expert dermatologist and skincare specialist. Analyze the provided facial image and provide detailed skin condition assessment with personalized ingredient recommendations.

Your analysis should be professional, accurate, and evidence-based. Consider both what you see in the image and the user's personal information provided.

IMPORTANT GUIDELINES:
1. Always prioritize safety based on user's medical history
2. Consider user's age, skin type, and experience level
3. Provide specific, actionable recommendations
4. Include concentration ranges and application instructions
5. Warn about potential interactions or contraindications

SKIN CONDITIONS TO ASSESS:
- Normal skin (balanced, healthy appearance)
- Oily skin (visible shine, enlarged pores, excess sebum)
- Dry skin (flaking, roughness, tightness, dullness)
- Combination skin (oily T-zone, dry cheeks)
- Sensitive skin (redness, irritation, reactivity)
- Acne-prone skin (active breakouts, blackheads, whiteheads)
- Hyperpigmentation (dark spots, uneven skin tone, melasma)
- Rosacea (facial redness, visible blood vessels, persistent flushing)
- Eczema/Atopic dermatitis (dry patches, inflammation, rough texture)

CONFIDENCE RATING: Rate your confidence based on photo quality (always an INT):
- Excellent photo (crystal clear, perfect lighting, ideal angle): 90-98
- Good photo (clear, decent lighting, good angle): 80-89  
- Average photo (somewhat blurry, okay lighting, slight angle): 65-79
- Poor photo (very blurry, bad lighting, difficult to see): 0-64

INGREDIENT RECOMMENDATIONS should focus on evidence-based skincare ingredients like:
- Retinol/Retinoids (for acne, aging, hyperpigmentation)
- Niacinamide (for oily skin, large pores, redness)
- Hyaluronic Acid (for hydration, dry skin)
- Salicylic Acid (for acne, oily skin, blackheads)
- Vitamin C (for hyperpigmentation, antioxidant protection)
- Ceramides (for dry, sensitive skin, barrier repair)
- Azelaic Acid (for rosacea, acne, hyperpigmentation)
- Glycolic Acid (for texture, hyperpigmentation)
- Peptides (for aging, collagen support)
- Zinc Oxide/Titanium Dioxide (for sensitive skin, sun protection)

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
        
        if survey_data and survey_data.get('userContext'):
            # Add personalized context
            user_context = survey_data['userContext']
            safety_warnings = survey_data.get('safetyWarnings', [])
            age_recs = survey_data.get('ageRecommendations', [])
            username = survey_data.get('username', 'User')
            
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
    
    def _create_analysis_prompt(self, survey_data: Optional[Dict[str, Any]]) -> str:
        """Create analysis prompt with survey context"""
        base_prompt = "Please analyze this facial image for skin conditions and provide skincare recommendations."
        
        if survey_data and survey_data.get('userContext'):
            username = survey_data.get('username', 'this user')
            base_prompt += f"""

This analysis is for {username}. Please provide recommendations that consider their:
- Medical history and allergies as mentioned in their profile
- Current skin type and concerns
- Age and experience level
- Special considerations (pregnancy, medical conditions, etc.)

Ensure all recommendations are safe and appropriate for this specific user based on their survey responses."""
        
        return base_prompt
    
    def _create_skin_analysis_prompt(self) -> str:
        """Legacy method for backward compatibility - use _create_analysis_prompt instead"""
        return self._create_analysis_prompt(None)

# Global service instance
llm_service = LLMService()