# backend/app/routers/analysis.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import json

# Import unified services and schemas
from ..services.analysis_service import analysis_service
from ..services.database_service import DatabaseService
from ..models.schemas import SkinAnalysisResponse
from ..models import get_db, User, SkinAnalysis
from ..auth import get_current_user_from_token, get_current_user_optional

router = APIRouter()

# Pydantic models for response
class AnalysisHistoryResponse(BaseModel):
    id: str
    user_id: str
    analysis_data: dict
    created_at: datetime
    survey_id: Optional[str]
    
    class Config:
        from_attributes = True

@router.post("/analyze/skin", response_model=SkinAnalysisResponse)
async def analyze_skin_with_survey(
    file: UploadFile = File(...),
    userContext: Optional[str] = Form(None),
    safetyWarnings: Optional[str] = Form(None),
    ageRecommendations: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Enhanced skin analysis endpoint that accepts survey data"""
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        db_service = DatabaseService(db)
        
        # Parse survey data if provided
        survey_data = None
        if userContext:
            survey_data = {
                'userContext': userContext,
                'safetyWarnings': json.loads(safetyWarnings) if safetyWarnings else [],
                'ageRecommendations': json.loads(ageRecommendations) if ageRecommendations else [],
                'username': username or (current_user.display_name if current_user else 'User')
            }
        
        # Perform analysis using unified service
        result = await analysis_service.analyze_skin_image(file, survey_data)
        
        # Save analysis to database if user is authenticated
        if current_user:
            # Get latest survey for context
            latest_survey = db_service.get_latest_user_survey(str(current_user.id))
            survey_id = str(latest_survey.id) if latest_survey else None
            
            # Save analysis
            db_service.create_skin_analysis(
                user_id=str(current_user.id),
                analysis_data=result.dict(),
                survey_id=survey_id
            )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/skin/basic", response_model=SkinAnalysisResponse)
async def analyze_skin_basic(
    file: UploadFile = File(...)
):
    """Basic skin analysis without survey data"""
    
    # Validate file
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Perform basic analysis using unified service
        result = await analysis_service.analyze_skin_image_basic(file)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/analyze/status")
async def get_analysis_status():
    """Get analysis service status"""
    return analysis_service.get_service_status()

# Analysis history endpoints
@router.get("/analyze/history", response_model=List[AnalysisHistoryResponse])
async def get_analysis_history(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get analysis history for authenticated user"""
    db_service = DatabaseService(db)
    analyses = db_service.get_user_analyses(str(current_user.id))
    return analyses

@router.get("/analyze/history/{analysis_id}", response_model=AnalysisHistoryResponse)
async def get_analysis_by_id(
    analysis_id: str,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get specific analysis by ID for authenticated user"""
    db_service = DatabaseService(db)
    
    # Check if analysis belongs to current user
    user_analyses = db_service.get_user_analyses(str(current_user.id))
    analysis = next((a for a in user_analyses if str(a.id) == analysis_id), None)
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return analysis

@router.get("/analyze/latest", response_model=Optional[AnalysisHistoryResponse])
async def get_latest_analysis(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get latest analysis for authenticated user"""
    db_service = DatabaseService(db)
    analysis = db_service.get_latest_user_analysis(str(current_user.id))
    return analysis