# ===== FILE 3: backend/app/utils/parsing.py =====
"""
Parsing utilities for skin analysis LLM responses
"""
import json
import re
import logging
from typing import Dict, Any

from fastapi import HTTPException
from app.models.schemas import SkinAnalysisResponse, IngredientRecommendation

logger = logging.getLogger(__name__)

def parse_skin_analysis_response(llm_response: str) -> SkinAnalysisResponse:
    """
    Parse LLM response text into SkinAnalysisResponse object
    
    Args:
        llm_response: Raw text response from LLM
        
    Returns:
        SkinAnalysisResponse object with parsed data
        
    Raises:
        HTTPException: If parsing fails or response is invalid
    """
    try:
        logger.info("🔍 Parsing skin analysis response...")
        
        # Clean the response text
        cleaned_response = clean_llm_response(llm_response)
        
        # Parse JSON
        try:
            response_data = json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON parsing failed: {e}")
            logger.error(f"Response text: {cleaned_response[:500]}...")
            raise HTTPException(
                status_code=422,
                detail="Invalid response format from analysis service"
            )
        
        # Validate required fields
        if not validate_skin_analysis_response(response_data):
            raise HTTPException(
                status_code=422,
                detail="Incomplete analysis response - missing required fields"
            )
        
        # Parse ingredient recommendations
        ingredient_recommendations = []
        for ingredient_data in response_data.get('ingredientRecommendations', []):
            try:
                ingredient = IngredientRecommendation(**ingredient_data)
                ingredient_recommendations.append(ingredient)
            except Exception as e:
                logger.warning(f"⚠️ Skipping invalid ingredient recommendation: {e}")
                continue
        
        # Create response object
        analysis_response = SkinAnalysisResponse(
            confidence=response_data['confidence'],
            primaryCondition=response_data['primaryCondition'],
            secondaryConditions=response_data.get('secondaryConditions', []),
            skinType=response_data['skinType'],
            ingredientRecommendations=ingredient_recommendations,
            description=response_data.get('description', 'Skin analysis completed successfully.')
        )
        
        logger.info(f"✅ Successfully parsed skin analysis response - "
                   f"Condition: {analysis_response.primaryCondition}, "
                   f"Ingredients: {len(ingredient_recommendations)}")
        
        return analysis_response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"❌ Failed to parse skin analysis response: {str(e)}")
        
        # Check for specific error types
        if "refused" in str(e).lower() or "cannot" in str(e).lower():
            raise HTTPException(
                status_code=422,
                detail="Unable to analyze this image. Please try a different image with better lighting and clarity."
            )
        
        # Generic parsing failure
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to parse analysis response: {str(e)}"
        )

def clean_llm_response(response: str) -> str:
    """
    Clean LLM response text to extract JSON content
    
    Args:
        response: Raw response text from LLM
        
    Returns:
        Cleaned JSON string
    """
    # Remove markdown code blocks
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*$', '', response)
    response = re.sub(r'^```\s*', '', response)
    
    # Remove any leading/trailing whitespace
    response = response.strip()
    
    # Try to find JSON object boundaries
    start_idx = response.find('{')
    end_idx = response.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        response = response[start_idx:end_idx + 1]
    
    return response

def validate_skin_analysis_response(response_data: dict) -> bool:
    """
    Validate that response data has required fields for skin analysis
    
    Args:
        response_data: Dictionary containing response data
        
    Returns:
        True if valid, False otherwise
    """
    required_fields = ['confidence', 'primaryCondition', 'skinType', 'ingredientRecommendations']
    
    if not all(field in response_data for field in required_fields):
        logger.error(f"❌ Missing required fields. Found: {list(response_data.keys())}")
        return False
    
    if not isinstance(response_data['ingredientRecommendations'], list):
        logger.error("❌ ingredientRecommendations must be a list")
        return False
    
    if not isinstance(response_data['confidence'], int):
        logger.error("❌ confidence must be an integer")
        return False
    
    if not (1 <= response_data['confidence'] <= 100):
        logger.error("❌ confidence must be between 1 and 100")
        return False
    
    return True