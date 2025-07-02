"""
Analysis service for orchestrating skin condition analysis workflow
"""
import base64
import random
import logging
from typing import BinaryIO
from fastapi import HTTPException, UploadFile

from app.models.schemas import SkinAnalysisResponse
from app.services.llm_service import llm_service
from app.utils.parsing import parse_skin_analysis_response
from app.config import settings

logger = logging.getLogger(__name__)

class AnalysisService:
    """Service for managing the complete skin analysis workflow"""
    
    def __init__(self):
        self.llm_service = llm_service
    
    def validate_upload_file(self, file: UploadFile) -> None:
        """
        Validate uploaded file type and size
        
        Args:
            file: FastAPI UploadFile object
            
        Raises:
            HTTPException: If file validation fails
        """
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, 
                detail="Invalid file type. Please upload an image."
            )
        
        # Check if content type is in allowed list
        if file.content_type not in settings.ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format. Allowed formats: {', '.join(settings.ALLOWED_CONTENT_TYPES)}"
            )
        
        # Check file size
        if file.size and file.size > settings.MAX_FILE_SIZE:
            max_size_mb = settings.MAX_FILE_SIZE / (1024 * 1024)
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {max_size_mb:.0f}MB."
            )
    
    async def encode_image_to_base64(self, file: UploadFile) -> str:
        """
        Read and encode image file to base64
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            Base64 encoded image string
            
        Raises:
            HTTPException: If encoding fails
        """
        try:
            contents = await file.read()
            base64_str = base64.b64encode(contents).decode("utf-8")
            
            logger.info(f"✅ File encoded successfully - Original size: {len(contents)} bytes, "
                       f"Base64 length: {len(base64_str)}")
            
            return base64_str
            
        except Exception as e:
            logger.error(f"❌ Failed to encode image: {e}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to process image: {str(e)}"
            )
    
    async def analyze_skin_image(self, file: UploadFile) -> SkinAnalysisResponse:
        """
        Perform complete skin condition analysis workflow
        
        Args:
            file: FastAPI UploadFile object
            
        Returns:
            SkinAnalysisResponse with skin condition and ingredient recommendations
            
        Raises:
            HTTPException: If analysis fails
        """
        analysis_id = random.randint(1000, 9999)
        
        logger.info(f"🔬 Starting skin analysis {analysis_id} - File: {file.filename}, "
                   f"Size: {file.size}, Type: {file.content_type}")
        
        # Validate file
        self.validate_upload_file(file)
        
        # Check if LLM is available
        if not self.llm_service.is_available:
            raise HTTPException(
                status_code=503, 
                detail="Skin analysis service is currently unavailable. Please try again later."
            )
        
        try:
            # Encode image
            base64_image = await self.encode_image_to_base64(file)
            
            # Get LLM analysis
            llm_response = await self.llm_service.analyze_skin_image(base64_image, analysis_id)
            
            # Parse response
            analysis_response = parse_skin_analysis_response(llm_response)
            
            logger.info(f"✅ Skin analysis {analysis_id} completed successfully - "
                       f"Primary condition: {analysis_response.primaryCondition}, "
                       f"Confidence: {analysis_response.confidence}%, "
                       f"Ingredients: {len(analysis_response.ingredientRecommendations)}")
            
            return analysis_response
            
        except HTTPException:
            # Re-raise HTTP exceptions (these are already handled)
            raise
        except Exception as e:
            logger.error(f"❌ Skin analysis {analysis_id} failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {str(e)}"
            )
    
    def get_service_status(self) -> dict:
        """
        Get comprehensive service status
        
        Returns:
            Dictionary containing service status information
        """
        llm_status = self.llm_service.get_status()
        
        return {
            "analysis_service": "available",
            "llm_service": llm_status,
            "supported_formats": settings.ALLOWED_CONTENT_TYPES,
            "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
            "skin_conditions": [
                "Normal skin",
                "Oily skin", 
                "Dry skin",
                "Combination skin",
                "Sensitive skin",
                "Acne-prone skin",
                "Hyperpigmentation",
                "Rosacea",
                "Eczema"
            ]
        }

# Global service instance
analysis_service = AnalysisService()