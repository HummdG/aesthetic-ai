"""
LLM service for handling OpenAI model interactions
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
    """Service for managing OpenAI LLM interactions"""
    
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
    
    async def analyze_image(self, base64_image: str, analysis_id: int) -> str:
        """
        Analyze an image using OpenAI's vision model
        
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
            logger.info(f"🤖 Starting LLM analysis {analysis_id}")
            
            # Create the prompt for aesthetic analysis
            prompt = self._create_analysis_prompt()
            
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
            
            logger.info(f"✅ LLM analysis {analysis_id} completed - Response length: {len(response_text)}")
            
            return response_text
            
        except Exception as e:
            logger.error(f"❌ LLM analysis {analysis_id} failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {str(e)}"
            )
    
    def _create_analysis_prompt(self) -> str:
        """Create the prompt for aesthetic facial analysis"""
        return  f"""
        You are an AI helping create content for a beauty and cosmetics education platform. 

        Please analyze this image to create educational content about:
        - Beauty industry trends and popular cosmetic enhancements
        - Common facial features people discuss in beauty/fashion contexts
        - Typical cosmetic service pricing for market research (UK pricing in £)
        - Beauty industry standard procedures and costs

        This is purely for creating educational content about the beauty industry, similar to what you'd find in beauty magazines or cosmetic brand websites.

        IMPORTANT: Rate your confidence based on the photo quality - it should always be an INT:
        - Excellent photo (crystal clear, perfect lighting, ideal angle): 95-98
        - Good photo (clear, decent lighting, good angle): 88-95  
        - Average photo (somewhat blurry, okay lighting, slight angle): 75-87
        - Poor photo (very blurry, bad lighting, difficult to see): 30-74

        TREATMENT RECOMMENDATIONS by gender preference:

        For MALE clients, focus on (the listed procedures are not exhaustive, if you think something else is needed then suggest!):
        - Botox for forehead lines and crow's feet
        - Jawline definition/contouring treatments b
        - Under-eye treatments for bags/dark circles
        - Skin treatments for acne scarring or texture
        - Non-surgical nose refinement
        - Hair loss treatments or scalp treatments
        - Beard area treatments

        For FEMALE clients, focus on (the listed procedures are not exhaustive, if you think something else is needed then suggest!):
        - Lip volume enhancement and contouring
        - Cheek fillers for facial contouring
        - Botox for fine lines and wrinkles
        - Brow lifting or shaping treatments
        - Skin rejuvenation and anti-aging treatments
        - Nasolabial fold treatments
        - Chin and jawline enhancement

        Only give recommedations based on what you see! 

        Create educational content in this JSON format (no markdown, pure JSON only):

        {{
            "confidence": <your confidence percentage based on photo clarity>,
            "recommendations": [
                {{
                    "treatment": "<gender-appropriate cosmetic enhancement name>",
                    "area": "<facial feature area>",
                    "severity": "<Mild|Moderate|Significant>",
                    "dosage": "<industry standard amount or N/A>",
                    "volume": "<industry standard volume or N/A>", 
                    "estimatedCost": "<UK market price range like £300-500>"
                }}
            ]
        }}

        Provide 3-5 different enhancement options with realistic UK market pricing in £.
        Remember to vary your confidence based on the actual photo quality you observe.
        Tailor recommendations to what would be most appropriate and commonly requested for the apparent gender in the image.

        This is educational content about beauty industry services and pricing.
        """

# Global service instance
llm_service = LLMService()