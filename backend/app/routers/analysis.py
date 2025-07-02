"""
Analysis router for image analysis endpoints
"""
from fastapi import APIRouter, File, UploadFile
from app.models.schemas import AnalysisResponse
from app.services.analysis_service import analysis_service

router = APIRouter(
    prefix="/analyze",
    tags=["analysis"]
)

@router.post("/", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze uploaded image for aesthetic recommendations
    
    Args:
        file: Image file to analyze (JPEG, PNG, GIF, WebP)
        
    Returns:
        AnalysisResponse with confidence score, recommendations, and total cost
        
    Raises:
        HTTPException: 
            - 400: Invalid file type or file too large
            - 422: LLM refused to analyze the image
            - 500: Analysis failed
            - 503: Service unavailable
    """
    return await analysis_service.analyze_image(file)

@router.get("/status")
async def get_analysis_status():
    """
    Get analysis service status and capabilities
    
    Returns:
        Dictionary with service status information
    """
    return analysis_service.get_service_status()