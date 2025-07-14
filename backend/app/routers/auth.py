"""
Authentication and user management router
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import datetime
import uuid

from ..auth import get_current_user_from_token, get_current_user_optional
from ..models import get_db, User, UserSurvey
from ..services.database_service import DatabaseService

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# Pydantic models for request/response
class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str]
    created_at: datetime
    
    @field_validator('id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True

class SurveyCreateRequest(BaseModel):
    survey_data: dict
    version: str = "1.0"

class SurveyResponse(BaseModel):
    id: str
    user_id: str
    survey_data: dict
    version: str
    created_at: datetime
    
    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_uuid_to_str(cls, v):
        if isinstance(v, uuid.UUID):
            return str(v)
        return v
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None

# Authentication endpoints
@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user_from_token)
):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    db_service = DatabaseService(db)
    
    updated_user = db_service.update_user(
        str(current_user.id),
        display_name=profile_update.display_name
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update user profile"
        )
    
    return updated_user

# Survey endpoints
@router.post("/surveys", response_model=SurveyResponse)
async def create_survey(
    survey_request: SurveyCreateRequest,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Create new survey for current user"""
    db_service = DatabaseService(db)
    
    survey = db_service.create_user_survey(
        str(current_user.id),
        survey_request.survey_data,
        survey_request.version
    )
    
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create survey"
        )
    
    return survey

@router.get("/surveys", response_model=List[SurveyResponse])
async def get_user_surveys(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get all surveys for current user"""
    db_service = DatabaseService(db)
    surveys = db_service.get_user_surveys(str(current_user.id))
    return surveys

@router.get("/surveys/latest", response_model=Optional[SurveyResponse])
async def get_latest_survey(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get latest survey for current user"""
    db_service = DatabaseService(db)
    survey = db_service.get_latest_user_survey(str(current_user.id))
    return survey

@router.put("/surveys/{survey_id}", response_model=SurveyResponse)
async def update_survey(
    survey_id: str,
    survey_request: SurveyCreateRequest,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Update existing survey"""
    db_service = DatabaseService(db)
    
    # Check if survey belongs to current user
    survey = db_service.get_user_surveys(str(current_user.id))
    if not any(s.id == survey_id for s in survey):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Survey not found"
        )
    
    updated_survey = db_service.update_user_survey(
        survey_id,
        survey_request.survey_data
    )
    
    if not updated_survey:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update survey"
        )
    
    return updated_survey

# User statistics
@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    db_service = DatabaseService(db)
    
    surveys_count = len(db_service.get_user_surveys(str(current_user.id)))
    analyses_count = len(db_service.get_user_analyses(str(current_user.id)))
    latest_survey = db_service.get_latest_user_survey(str(current_user.id))
    latest_analysis = db_service.get_latest_user_analysis(str(current_user.id))
    
    return {
        "user_id": str(current_user.id),
        "email": current_user.email,
        "surveys_count": surveys_count,
        "analyses_count": analyses_count,
        "latest_survey_date": latest_survey.created_at if latest_survey else None,
        "latest_analysis_date": latest_analysis.created_at if latest_analysis else None,
        "member_since": current_user.created_at
    } 