# backend/app/models/survey_schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class UserMedicalHistory(BaseModel):
    """User's medical history information"""
    allergies: List[str] = Field(default=[], description="Known allergies")
    chronic_conditions: List[str] = Field(default=[], description="Chronic conditions affecting skin")
    current_medications: List[str] = Field(default=[], description="Current medications")
    cosmetic_procedures: List[str] = Field(default=[], description="Previous cosmetic procedures")
    previous_reactions: List[str] = Field(default=[], description="Previous product reactions")

class UserSkinInfo(BaseModel):
    """User's skin information and experience"""
    has_used_skincare: bool = Field(default=False, description="Has used skincare products before")
    skin_type: Literal['oily', 'dry', 'combination', 'sensitive', 'normal', 'unknown'] = Field(
        default='unknown', description="User's skin type"
    )
    previous_reactions: List[str] = Field(default=[], description="Previous skincare reactions")
    cosmetic_procedures: List[str] = Field(default=[], description="Previous cosmetic procedures")

class UserBasicInfo(BaseModel):
    """User's basic demographic information"""
    age: int = Field(ge=18, le=100, description="User's age")
    is_pregnant: bool = Field(default=False, description="Currently pregnant or nursing")
    sun_exposure: Literal['minimal', 'moderate', 'frequent', 'excessive'] = Field(
        default='moderate', description="Sun exposure level"
    )
    family_history: List[str] = Field(default=[], description="Family history of skin conditions")
    genetic_conditions: List[str] = Field(default=[], description="Genetic skin conditions")

class UserSurveyData(BaseModel):
    """Complete user survey data"""
    username: str = Field(..., description="User's username")
    medical_history: UserMedicalHistory = Field(default_factory=UserMedicalHistory)
    skin_info: UserSkinInfo = Field(default_factory=UserSkinInfo)
    basic_info: UserBasicInfo = Field(default_factory=UserBasicInfo)
    completed_at: str = Field(..., description="Survey completion timestamp")
    version: str = Field(default="1.0", description="Survey version")




