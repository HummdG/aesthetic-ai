# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime

# Import your existing routers
from .routers import health, analysis, auth
from .models import create_tables
from .config import settings

# Create FastAPI app
app = FastAPI(
    title="Aesthetic AI Backend",
    description="FastAPI service for AI-powered aesthetic facial analysis with survey integration and Firebase authentication",
    version="1.0.0"
)

# Add CORS middleware with production-ready settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])
app.include_router(auth.router, prefix="/api/v1", tags=["authentication"])

# Initialize database tables on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        create_tables()
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        # Don't crash the app if DB tables fail
        pass

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "aesthetic-ai-backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "features": ["skin-analysis", "survey-integration", "enhanced-recommendations"]
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "message": "Aesthetic AI Backend API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs",
        "health_check": "/health",
        "api_prefix": "/api/v1"
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "timestamp": datetime.now().isoformat()}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)