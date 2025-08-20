"""
Products router for skincare product matching and discovery
"""
import logging
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..models.schemas import ProductMatchRequest, ProductMatchResponse, ErrorResponse
from ..services.product_service import product_service

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.post(
    "/products/match",
    response_model=ProductMatchResponse,
    status_code=status.HTTP_200_OK,
    summary="Match skincare products based on ingredient requirements",
    description="""
    Find skincare products that match your ingredient requirements and preferences.
    
    This endpoint will:
    1. Filter products by required and avoided ingredients
    2. Score products based on ingredient position, freshness, and price
    3. Perform live verification of availability and pricing
    4. Return sorted results with last verification timestamps
    
    The matching considers ingredient aliases (e.g., niacinamide = vitamin B3) 
    and returns only products that have been verified within the last 24 hours.
    """,
    responses={
        200: {
            "description": "Successfully matched products",
            "model": ProductMatchResponse
        },
        400: {
            "description": "Invalid request parameters",
            "model": ErrorResponse
        },
        500: {
            "description": "Internal server error",
            "model": ErrorResponse
        }
    }
)
async def match_products(
    request: ProductMatchRequest,
    db: Session = Depends(get_db)
) -> ProductMatchResponse:
    """
    Match skincare products based on ingredient requirements
    
    Args:
        request: Product matching request with ingredients and preferences
        db: Database session dependency
        
    Returns:
        ProductMatchResponse with matched and verified products
        
    Raises:
        HTTPException: If matching fails or invalid parameters provided
    """
    request_id = f"req-{hash(str(request.dict()))}"
    
    logger.info(f"🛍️ Product match request {request_id} - Country: {request.country}, "
               f"Required: {request.required_ingredients}, "
               f"Avoid: {request.avoid_ingredients or []}, "
               f"Max price: {request.max_price}")
    
    try:
        # Delegate to product service
        response = await product_service.match_products(request, db)
        
        logger.info(f"✅ Product match {request_id} completed successfully - "
                   f"Results: {len(response.results)}, "
                   f"Currency: {response.currency}")
        
        return response
        
    except HTTPException as e:
        # Log and re-raise HTTP exceptions from service layer
        logger.warning(f"⚠️ Product match {request_id} failed with HTTP error: {e.detail}")
        raise e
        
    except Exception as e:
        # Log and convert unexpected errors to HTTP exceptions
        logger.error(f"❌ Product match {request_id} failed with unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Product matching failed: {str(e)}"
        )


@router.get(
    "/products/health",
    summary="Check product service health",
    description="Get the health status of the product matching service and its dependencies",
    responses={
        200: {
            "description": "Service health information"
        }
    }
)
async def get_products_health() -> dict:
    """
    Get product service health status
    
    Returns:
        Dictionary containing service health information
    """
    try:
        # Check service dependencies
        health_info = {
            "service": "products",
            "status": "healthy",
            "adapters": {},
            "cache": "not_configured",
            "configuration": {
                "top_n_live_check": product_service.top_n_live_check,
                "live_check_timeout": product_service.live_check_timeout,
                "supported_countries": product_service.country_whitelist
            }
        }
        
        # Check retailer adapters
        for name, adapter in product_service.adapters.items():
            try:
                health_info["adapters"][name] = {
                    "retailer": adapter.retailer,
                    "country": adapter.country,
                    "status": "available"
                }
            except Exception as e:
                health_info["adapters"][name] = {
                    "status": "error",
                    "error": str(e)
                }
        
        # Check Redis cache
        if product_service.redis_client:
            try:
                product_service.redis_client.ping()
                health_info["cache"] = "connected"
            except Exception as e:
                health_info["cache"] = f"error: {str(e)}"
        
        logger.info("📊 Product service health check completed")
        return health_info
        
    except Exception as e:
        logger.error(f"❌ Product service health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        ) 