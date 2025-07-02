"""
LLM service for handling OpenAI model interactions - Skin Condition Analysis
"""
import logging
import base64
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
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
                api_key=settings.OPENAI_API_KEY
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
    
    async def analyze_skin_image(self, base64_image: str, analysis_id: int) -> str:
        """
        Analyze an image for skin condition assessment using OpenAI's vision model
        
        Args:
            base64_image: Base64 encoded image string
            analysis_id: Unique analysis identifier for logging
            
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
            logger.info(f"🤖 Starting skin analysis {analysis_id}")
            
            # Create the prompt for skin condition analysis
            prompt = self._create_skin_analysis_prompt()
            
            # Create the message with image
            message = HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            )
            
            # Get response from LLM
            response = await self._client.ainvoke([message])
            response_text = response.content
            
            logger.info(f"✅ Skin analysis {analysis_id} completed - Response length: {len(response_text)}")
            
            return response_text
            
        except Exception as e:
            logger.error(f"❌ Skin analysis {analysis_id} failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Skin analysis failed: {str(e)}"
            )
    
    def _create_skin_analysis_prompt(self) -> str:
        """Create the prompt for skin condition analysis and ingredient recommendations"""
        return f"""
        You are an AI dermatology assistant specializing in skin condition analysis and skincare ingredient recommendations.

        Analyze this facial image to identify skin conditions and recommend appropriate skincare ingredients.

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

        IMPORTANT: Rate your confidence based on the photo quality - it should always be an INT:
        - Excellent photo (crystal clear, perfect lighting, ideal angle): 90-98
        - Good photo (clear, decent lighting, good angle): 80-89  
        - Average photo (somewhat blurry, okay lighting, slight angle): 65-79
        - Poor photo (very blurry, bad lighting, difficult to see): 30-64

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

        Provide recommendations in this JSON format (no markdown, pure JSON only):

        {{
            "confidence": <your confidence percentage based on photo clarity>,
            "primaryCondition": "<most prominent skin condition detected>",
            "secondaryConditions": ["<additional conditions if any>"],
            "skinType": "<overall skin type classification>",
            "description": "<detailed description of skin analysis findings>",
            "ingredientRecommendations": [
                {{
                    "ingredient": "<ingredient name>",
                    "purpose": "<what this ingredient does for the condition>",
                    "concentration": "<recommended concentration range or N/A>",
                    "application": "<how to apply - AM/PM/frequency>",
                    "benefits": "<specific benefits for detected condition>"
                }}
            ]
        }}

        Provide 3-5 ingredient recommendations based on the detected skin conditions.
        Be specific about concentrations where relevant (e.g., "0.5-1% retinol", "10-20% niacinamide").
        Focus on ingredients that directly address the identified skin concerns.
        Remember to vary your confidence based on the actual photo quality you observe.
        """

# Global service instance
llm_service = LLMService()