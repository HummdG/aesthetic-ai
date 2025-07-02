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
        
        logger.info(f"🚀 Starting {settings.APP_TITLE}...")
        logger.info(f"🌐 Server will be available at: http://{settings.HOST}:{settings.PORT}")
        logger.info(f"📖 API documentation: http://{settings.HOST}:{settings.PORT}/docs")
        logger.info(f"🔍 Health check: http://{settings.HOST}:{settings.PORT}/health")
        
        # Run uvicorn with the correct module path
        uvicorn.run(
            "app.main:app",  # This tells uvicorn to import app from app/main.py
            host="0.0.0.0",  # Changed to 0.0.0.0 for Docker
            port=8000,       # Fixed port for Docker
            log_level="info",
            reload=True      # Enable auto-reload for development
        )
        
    except ImportError as e:
        logger.error(f"❌ Import error: {e}")
        logger.error("Make sure all dependencies are installed and the app structure is correct")
        
        # Try to run with direct import as fallback
        try:
            logger.info("🔄 Trying direct import fallback...")
            from app.main import app
            uvicorn.run(
                app,
                host="0.0.0.0",
                port=8000,
                log_level="info",
                reload=True
            )
        except Exception as fallback_error:
            logger.error(f"❌ Fallback also failed: {fallback_error}")
            sys.exit(1)
            
    except Exception as e:
        logger.error(f"❌ Failed to start application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()