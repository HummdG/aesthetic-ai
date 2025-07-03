# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime

# Import your existing routers
from .routers import health, analysis, enhanced_analysis

# Create FastAPI app
app = FastAPI(
    title="Aesthetic AI Backend",
    description="FastAPI service for AI-powered aesthetic facial analysis with survey integration",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])
app.include_router(enhanced_analysis.router, prefix="/api/v1", tags=["enhanced-analysis"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "aesthetic-ai-backend",
        "version": "1.0.0",
        "features": ["skin-analysis", "survey-integration", "enhanced-recommendations"]
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Aesthetic AI Backend API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "basic_analysis": "/api/v1/analyze/skin/basic",
            "enhanced_analysis": "/api/v1/analyze/skin",
            "health": "/api/v1/health"
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)