# backend/app/api/routes/enhanced_analysis.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import base64
import json
from ...services.enhanced_skin_analysis import EnhancedSkinAnalysisService
from ...models.survey_schemas import UserSurveyData
from ...models.schemas import SkinAnalysisResponse
from ...config import settings

router = APIRouter()

@router.post("/analyze/skin", response_model=SkinAnalysisResponse)
async def analyze_skin_with_survey(
    file: UploadFile = File(...),
    user_context: Optional[str] = Form(None),
    safety_warnings: Optional[str] = Form(None),
    age_recommendations: Optional[str] = Form(None),
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
        survey_data = None
        if user_context and username:
            # In a real implementation, you might reconstruct UserSurveyData
            # from the context or load it from a database
            # For now, we'll create a minimal structure
            survey_data = _create_survey_data_from_context(
                username, user_context, safety_warnings, age_recommendations
            )
        
        # Initialize analysis service
        analysis_service = EnhancedSkinAnalysisService(
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        # Perform analysis
        result = analysis_service.analyze_skin_with_survey(
            image_base64, survey_data
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def _create_survey_data_from_context(
    username: str, 
    context: str, 
    warnings: Optional[str], 
    age_recs: Optional[str]
) -> UserSurveyData:
    """Helper function to create survey data from context string"""
    # This is a simplified version - in production, you'd want to 
    # properly parse the context or load from database
    
    # Extract basic info from context
    age = 25  # Default
    skin_type = "unknown"
    is_pregnant = False
    
    # Simple parsing of context
    for line in context.split('\n'):
        if line.startswith('Age:'):
            try:
                age = int(line.split(':')[1].strip())
            except:
                pass
        elif line.startswith('Skin Type:'):
            skin_type = line.split(':')[1].strip()
        elif 'pregnant' in line.lower():
            is_pregnant = True
    
    # Create minimal survey data structure
    from ...models.survey_schemas import UserSurveyData, UserBasicInfo, UserSkinInfo, UserMedicalHistory
    from datetime import datetime
    
    return UserSurveyData(
        username=username,
        basic_info=UserBasicInfo(
            age=age,
            is_pregnant=is_pregnant,
            sun_exposure="moderate",
            family_history=[],
            genetic_conditions=[]
        ),
        skin_info=UserSkinInfo(
            skin_type=skin_type,
            has_used_skincare=True,
            previous_reactions=[],
            cosmetic_procedures=[]
        ),
        medical_history=UserMedicalHistory(
            allergies=[],
            chronic_conditions=[],
            current_medications=[],
            cosmetic_procedures=[],
            previous_reactions=[]
        ),
        completed_at=datetime.now().isoformat(),
        version="1.0"
    )