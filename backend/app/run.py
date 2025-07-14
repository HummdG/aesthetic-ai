"""
Application entry point for running the FastAPI server
"""
import uvicorn
import logging
import sys
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Run the FastAPI application with uvicorn"""
    try:
        # Import settings first
        from app.config import settings
        from app.auth.firebase_auth import initialize_firebase
        
        logger.info(f"🚀 Starting {settings.APP_TITLE}...")
        logger.info(f"🌍 Environment: {settings.ENVIRONMENT}")
        logger.info(f"🌐 Server will be available at: http://{settings.HOST}:{settings.PORT}")
        logger.info(f"📖 API documentation: http://{settings.HOST}:{settings.PORT}/docs")
        logger.info(f"🔍 Health check: http://{settings.HOST}:{settings.PORT}/health")
        
        # Initialize Firebase before starting the server
        try:
            initialize_firebase()
        except Exception as e:
            logger.warning(f"⚠️ Firebase initialization failed: {e}")
            if settings.is_production:
                logger.error("❌ Firebase is required in production")
                sys.exit(1)
        
        # Run uvicorn with production-ready settings
        uvicorn_config = {
            "app": "app.main:app",
            "host": settings.HOST,
            "port": settings.PORT,
            "log_level": "info",
        }
        
        # Add development-specific settings
        if not settings.is_production:
            uvicorn_config["reload"] = True
        
        uvicorn.run(**uvicorn_config)
        
    except ImportError as e:
        logger.error(f"❌ Import error: {e}")
        logger.error("Make sure all dependencies are installed and the app structure is correct")
        sys.exit(1)
            
    except Exception as e:
        logger.error(f"❌ Failed to start application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()