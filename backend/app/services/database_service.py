"""
Database service layer for user and survey operations
"""
import logging
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ..models import User, UserSurvey, SkinAnalysis

logger = logging.getLogger(__name__)


class DatabaseService:
    """Database service for user and survey operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    # User operations
    def get_user_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        """Get user by Firebase UID"""
        try:
            return self.db.query(User).filter(User.firebase_uid == firebase_uid).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user by Firebase UID: {e}")
            return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        try:
            return self.db.query(User).filter(User.email == email).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    def create_user(self, firebase_uid: str, email: str, display_name: Optional[str] = None) -> Optional[User]:
        """Create new user"""
        try:
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            logger.info(f"Created new user: {email}")
            return user
        except SQLAlchemyError as e:
            logger.error(f"Error creating user: {e}")
            self.db.rollback()
            return None
    
    def update_user(self, user_id: str, **kwargs) -> Optional[User]:
        """Update user information"""
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            
            self.db.commit()
            self.db.refresh(user)
            return user
        except SQLAlchemyError as e:
            logger.error(f"Error updating user: {e}")
            self.db.rollback()
            return None
    
    # Survey operations
    def create_user_survey(self, user_id: str, survey_data: Dict[str, Any], version: str = "1.0") -> Optional[UserSurvey]:
        """Create new user survey"""
        try:
            survey = UserSurvey(
                user_id=user_id,
                survey_data=survey_data,
                version=version
            )
            self.db.add(survey)
            self.db.commit()
            self.db.refresh(survey)
            logger.info(f"Created survey for user: {user_id}")
            return survey
        except SQLAlchemyError as e:
            logger.error(f"Error creating survey: {e}")
            self.db.rollback()
            return None
    
    def get_user_surveys(self, user_id: str) -> List[UserSurvey]:
        """Get all surveys for a user"""
        try:
            return self.db.query(UserSurvey).filter(UserSurvey.user_id == user_id).all()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user surveys: {e}")
            return []
    
    def get_latest_user_survey(self, user_id: str) -> Optional[UserSurvey]:
        """Get the latest survey for a user"""
        try:
            return self.db.query(UserSurvey).filter(
                UserSurvey.user_id == user_id
            ).order_by(UserSurvey.created_at.desc()).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting latest survey: {e}")
            return None
    
    def update_user_survey(self, survey_id: str, survey_data: Dict[str, Any]) -> Optional[UserSurvey]:
        """Update user survey"""
        try:
            survey = self.db.query(UserSurvey).filter(UserSurvey.id == survey_id).first()
            if not survey:
                return None
            
            survey.survey_data = survey_data
            self.db.commit()
            self.db.refresh(survey)
            return survey
        except SQLAlchemyError as e:
            logger.error(f"Error updating survey: {e}")
            self.db.rollback()
            return None
    
    # Analysis operations
    def create_skin_analysis(
        self, 
        user_id: str, 
        analysis_data: Dict[str, Any], 
        survey_id: Optional[str] = None, 
        image_path: Optional[str] = None
    ) -> Optional[SkinAnalysis]:
        """Create new skin analysis"""
        try:
            analysis = SkinAnalysis(
                user_id=user_id,
                survey_id=survey_id,
                image_path=image_path,
                analysis_data=analysis_data
            )
            self.db.add(analysis)
            self.db.commit()
            self.db.refresh(analysis)
            logger.info(f"Created analysis for user: {user_id}")
            return analysis
        except SQLAlchemyError as e:
            logger.error(f"Error creating analysis: {e}")
            self.db.rollback()
            return None
    
    def get_user_analyses(self, user_id: str) -> List[SkinAnalysis]:
        """Get all analyses for a user"""
        try:
            return self.db.query(SkinAnalysis).filter(
                SkinAnalysis.user_id == user_id
            ).order_by(SkinAnalysis.created_at.desc()).all()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user analyses: {e}")
            return []
    
    def get_latest_user_analysis(self, user_id: str) -> Optional[SkinAnalysis]:
        """Get the latest analysis for a user"""
        try:
            return self.db.query(SkinAnalysis).filter(
                SkinAnalysis.user_id == user_id
            ).order_by(SkinAnalysis.created_at.desc()).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting latest analysis: {e}")
            return None
    
    def get_analysis_by_id(self, analysis_id: str) -> Optional[SkinAnalysis]:
        """Get analysis by ID"""
        try:
            return self.db.query(SkinAnalysis).filter(SkinAnalysis.id == analysis_id).first()
        except SQLAlchemyError as e:
            logger.error(f"Error getting analysis: {e}")
            return None
    
    # Statistics and admin operations
    def get_user_count(self) -> int:
        """Get total number of users"""
        try:
            return self.db.query(User).count()
        except SQLAlchemyError as e:
            logger.error(f"Error getting user count: {e}")
            return 0
    
    def get_survey_count(self) -> int:
        """Get total number of surveys"""
        try:
            return self.db.query(UserSurvey).count()
        except SQLAlchemyError as e:
            logger.error(f"Error getting survey count: {e}")
            return 0
    
    def get_analysis_count(self) -> int:
        """Get total number of analyses"""
        try:
            return self.db.query(SkinAnalysis).count()
        except SQLAlchemyError as e:
            logger.error(f"Error getting analysis count: {e}")
            return 0 