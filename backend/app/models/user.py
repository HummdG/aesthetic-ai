"""
SQLAlchemy models for user management and survey data
"""
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base


class User(Base):
    """User model for authenticated users"""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    firebase_uid = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    surveys = relationship("UserSurvey", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("SkinAnalysis", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class UserSurvey(Base):
    """User survey responses model"""
    __tablename__ = "user_surveys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    survey_data = Column(JSON, nullable=False)  # Store the complete survey data as JSON
    version = Column(String(50), default="1.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="surveys")
    analyses = relationship("SkinAnalysis", back_populates="survey")
    
    def __repr__(self):
        return f"<UserSurvey(id={self.id}, user_id={self.user_id})>"


class SkinAnalysis(Base):
    """Skin analysis results model"""
    __tablename__ = "skin_analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    survey_id = Column(UUID(as_uuid=True), ForeignKey("user_surveys.id"), nullable=True)
    image_path = Column(String(500), nullable=True)  # Path to uploaded image
    analysis_data = Column(JSON, nullable=False)  # Store the complete analysis result as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    survey = relationship("UserSurvey", back_populates="analyses")
    
    def __repr__(self):
        return f"<SkinAnalysis(id={self.id}, user_id={self.user_id})>" 