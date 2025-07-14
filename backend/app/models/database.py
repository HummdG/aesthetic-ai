"""
Database configuration and session management for Aesthetic AI
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..config import settings

# Database URL from settings
DATABASE_URL = settings.DATABASE_URL

# Create engine with production-ready settings
if settings.is_production:
    engine_kwargs = {
        "future": True,
        "echo": False,  # Disable SQL logging in production
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,  # Verify connections before use
        "pool_recycle": 300,    # Recycle connections every 5 minutes
    }
else:
    engine_kwargs = {
        "future": True,
        "echo": True,  # Enable SQL logging in development
    }

# Create engine
engine = create_engine(DATABASE_URL, **engine_kwargs)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine,
    future=True
)

# Base class for ORM models
Base = declarative_base()

def get_db():
    """Database session dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """Drop all database tables (use with caution!)"""
    Base.metadata.drop_all(bind=engine) 