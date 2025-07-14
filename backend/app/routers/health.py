"""
Health check router
"""
from datetime import datetime
from fastapi import APIRouter
from app.models.schemas import HealthCheckResponse
from app.services.llm_service import llm_service
from app.config import settings
import firebase_admin

router = APIRouter(
    prefix="/health",
    tags=["health"]
)

@router.get("/", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint to verify service status
    
    Returns:
        HealthCheckResponse with current service status
    """
    llm_status = "enabled" if llm_service.is_available else "disabled"
    openai_key_status = "present" if settings.openai_key_available else "missing"
    
    # Check Firebase initialization
    firebase_status = "initialized"
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_status = "not_initialized"
    except Exception as e:
        firebase_status = f"error: {str(e)}"
    
    return HealthCheckResponse(
        status="healthy",
        langchain=llm_status,
        openai_key=openai_key_status,
        model=settings.OPENAI_MODEL,
        currency=settings.CURRENCY,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        firebase=firebase_status
    )

@router.get("/detailed")
async def detailed_health_check():
    """
    Detailed health check with more service information
    
    Returns:
        Comprehensive service status
    """
    from app.services.analysis_service import analysis_service
    
    # Check Firebase initialization
    firebase_status = "initialized"
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_status = "not_initialized"
    except Exception as e:
        firebase_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "llm": llm_service.get_status(),
            "analysis": analysis_service.get_service_status(),
            "firebase": firebase_status
        },
        "configuration": {
            "app_version": settings.APP_VERSION,
            "model": settings.OPENAI_MODEL,
            "currency": settings.CURRENCY,
            "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
            "allowed_origins": settings.ALLOWED_ORIGINS
        }
    }