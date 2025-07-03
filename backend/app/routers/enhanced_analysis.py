# backend/app/routers/enhanced_analysis.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import base64
import json

# Import your existing services and schemas
from ..services.enhanced_skin_analysis import EnhancedSkinAnalysisService
from ..models.schemas import SkinAnalysisResponse
from ..models.survey_schemas import UserSurveyData
from ..utils.config import settings

router = APIRouter()

@router.post("/analyze/skin", response_model=SkinAnalysisResponse)
async def analyze_skin_with_survey(
    file: UploadFile = File(...),
    userContext: Optional[str] = Form(None),
    safetyWarnings: Optional[str] = Form(None),
    ageRecommendations: Optional[str] = Form(None),
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
        
        # Parse survey data if provided
        survey_context = None
        if userContext:
            survey_context = {
                'userContext': userContext,
                'safetyWarnings': json.loads(safetyWarnings) if safetyWarnings else [],
                'ageRecommendations': json.loads(ageRecommendations) if ageRecommendations else [],
                'username': username
            }
        
        # Initialize analysis service
        analysis_service = EnhancedSkinAnalysisService(
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        # Perform enhanced analysis with survey data
        result = analysis_service.analyze_skin_with_survey_context(
            image_base64, survey_context
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/skin/basic", response_model=SkinAnalysisResponse)
async def analyze_skin_basic(
    file: UploadFile = File(...)
):
    """Basic skin analysis without survey data (fallback)"""
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image data
        image_data = await file.read()
        
        # Encode to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Initialize analysis service
        analysis_service = EnhancedSkinAnalysisService(
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        # Perform basic analysis
        result = analysis_service.analyze_skin_with_survey_context(
            image_base64, None
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")