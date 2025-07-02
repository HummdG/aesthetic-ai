"""
Configuration settings for the Aesthetic AI Backend
"""
import os
import logging
from typing import List

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings:
    """Application settings"""
    
    # App metadata
    APP_TITLE: str = "Aesthetic AI Backend"
    APP_DESCRIPTION: str = "FastAPI service for AI-powered aesthetic facial analysis using OpenAI models"
    APP_VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = "localhost"
    PORT: int = 8000
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"  # Allow all origins for development
    ]
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_TEMPERATURE: float = 0.9
    
    # File upload settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_CONTENT_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    
    # Analysis settings
    MIN_CONFIDENCE: int = 60
    MAX_CONFIDENCE: int = 98
    DEFAULT_CONFIDENCE_RANGE: tuple = (75, 85)
    
    # Pricing settings
    CURRENCY: str = "GBP"
    CURRENCY_SYMBOL: str = "£"
    
    @property
    def openai_key_available(self) -> bool:
        """Check if OpenAI API key is available"""
        return bool(self.OPENAI_API_KEY)

# Global settings instance
settings = Settings()

# Log configuration status
if settings.openai_key_available:
    logger.info("✅ OpenAI API key configured")
else:
    logger.warning("⚠️ OPENAI_API_KEY not found in environment variables")

logger.info(f"🔧 Configuration loaded - Model: {settings.OPENAI_MODEL}, Currency: {settings.CURRENCY}")