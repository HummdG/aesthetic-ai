"""
FastAPI application setup and configuration
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, analysis

# Setup logging
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """
    Create and configure FastAPI application
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title=settings.APP_TITLE,
        description=settings.APP_DESCRIPTION,
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(health.router)
    app.include_router(analysis.router)
    
    # Add startup event
    @app.on_event("startup")
    async def startup_event():
        """Log application startup"""
        logger.info(f"🚀 {settings.APP_TITLE} v{settings.APP_VERSION} starting up...")
        logger.info(f"📋 Documentation available at: http://{settings.HOST}:{settings.PORT}/docs")
    
    # Add shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        """Log application shutdown"""
        logger.info(f"🛑 {settings.APP_TITLE} shutting down...")
    
    # Root endpoint
    @app.get("/")
    async def root():
        """Root endpoint with basic API information"""
        return {
            "name": settings.APP_TITLE,
            "version": settings.APP_VERSION,
            "status": "running",
            "docs": "/docs",
            "health": "/health",
            "analyze": "/analyze"
        }
    
    return app

# Create the app instance
app = create_app()