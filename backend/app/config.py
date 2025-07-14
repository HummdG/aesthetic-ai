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
    
    # Environment detection
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server settings
    HOST: str = "0.0.0.0"  # Changed for Render deployment
    PORT: int = int(os.getenv("PORT", 8000))  # Use Render's PORT env var
    
    # CORS settings - Production ready
    ALLOWED_ORIGINS: List[str] = []
    
    def __post_init__(self):
        """Set CORS origins based on environment"""
        if self.ENVIRONMENT == "production":
            self.ALLOWED_ORIGINS = [
                "https://aesthetic-ai.vercel.app",  # Your production domain
                "https://aesthetic-ai-git-main.vercel.app",  # Git branch deployments
                "https://*.vercel.app",  # All Vercel preview deployments
            ]
        else:
            self.ALLOWED_ORIGINS = [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "*"  # Allow all origins for development only
            ]
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_TEMPERATURE: float = 0.9
    
    # Firebase settings
    FIREBASE_ADMIN_SDK_JSON: str = os.getenv("FIREBASE_ADMIN_SDK_JSON", "")
    FIREBASE_ADMIN_SDK_PATH: str = os.getenv("FIREBASE_ADMIN_SDK_PATH", "../firebase-admin-sdk.json")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://aesthetic_user:defaultpassword@localhost:5432/aesthetic_db")
    
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
    
    @property
    def firebase_admin_available(self) -> bool:
        """Check if Firebase Admin SDK is available"""
        return bool(self.FIREBASE_ADMIN_SDK_JSON) or os.path.exists(self.FIREBASE_ADMIN_SDK_PATH)
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT == "production"

# Global settings instance
settings = Settings()
# Initialize CORS origins
settings.__post_init__()

# Log configuration status
logger.info(f"🌍 Environment: {settings.ENVIRONMENT}")
logger.info(f"🚪 Port: {settings.PORT}")
logger.info(f"🔗 CORS Origins: {settings.ALLOWED_ORIGINS}")

if settings.openai_key_available:
    logger.info("✅ OpenAI API key configured")
else:
    logger.warning("⚠️ OPENAI_API_KEY not found in environment variables")

if settings.firebase_admin_available:
    logger.info("✅ Firebase Admin SDK configured")
else:
    logger.warning("⚠️ Firebase Admin SDK not configured")

logger.info(f"🔧 Configuration loaded - Model: {settings.OPENAI_MODEL}, Currency: {settings.CURRENCY}")