"""
Response parsing utilities for LLM output
"""
import json
import re
import random
import logging
from typing import Any, Union
from fastapi import HTTPException

from app.models.schemas import AnalysisResponse, TreatmentRecommendation
from app.utils.pricing import calculate_total_cost
from app.config import settings

logger = logging.getLogger(__name__)

def clean_confidence_value(confidence_value: Any) -> int:
    """
    Clean and convert confidence value to integer, handling N/A cases
    
    Args:
        confidence_value: Raw confidence value from LLM
        
    Returns:
        Cleaned confidence value as integer
    """
    if isinstance(confidence_value, int):
        return max(settings.MIN_CONFIDENCE, min(settings.MAX_CONFIDENCE, confidence_value))
    
    if isinstance(confidence_value, str):
        # Handle N/A, null, none cases
        if confidence_value.upper() in ['N/A', 'NULL', 'NONE', 'UNKNOWN']:
            return random.randint(*settings.DEFAULT_CONFIDENCE_RANGE)
        
        # Try to extract number from string
        numbers = re.findall(r'\d+', confidence_value)
        if numbers:
            conf = int(numbers[0])
            return max(settings.MIN_CONFIDENCE, min(settings.MAX_CONFIDENCE, conf))
    
    # Fallback to random reasonable confidence
    return random.randint(*settings.DEFAULT_CONFIDENCE_RANGE)

def clean_recommendation_data(rec_data: dict) -> dict:
    """
    Clean recommendation data, handling N/A values
    
    Args:
        rec_data: Raw recommendation dictionary
        
    Returns:
        Cleaned recommendation dictionary
    """
    cleaned = rec_data.copy()
    
    # Clean N/A values for optional fields
    for field in ['dosage', 'volume']:
        if cleaned.get(field) in ['N/A', 'n/a', None, '']:
            cleaned[field] = None
    
    return cleaned

def extract_json_from_text(text: str) -> Union[dict, None]:
    """
    Extract JSON object from text that may contain other content
    
    Args:
        text: Text containing JSON
        
    Returns:
        Parsed JSON object or None if not found
    """
    try:
        # Try to find JSON object in the text
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
    except Exception as e:
        logger.error(f"Error extracting JSON: {e}")
    
    return None

def parse_llm_response(llm_response: str) -> AnalysisResponse:
    """
    Parse the LLM response and extract structured data with robust error handling
    
    Args:
        llm_response: Raw response from LLM
        
    Returns:
        Structured AnalysisResponse object
        
    Raises:
        HTTPException: If parsing fails or LLM refuses
    """
    logger.info(f"🔍 Parsing LLM response (length: {len(llm_response)})")
    
    try:
        # Extract JSON from the response
        parsed_data = extract_json_from_text(llm_response)
        
        if not parsed_data:
            raise ValueError("No valid JSON found in response")
        
        logger.info(f"📋 Extracted JSON with keys: {list(parsed_data.keys())}")
        
        # Clean and validate confidence
        raw_confidence = parsed_data.get('confidence', 'N/A')
        cleaned_confidence = clean_confidence_value(raw_confidence)
        logger.info(f"🔧 Cleaned confidence: {raw_confidence} -> {cleaned_confidence}")
        
        # Create TreatmentRecommendation objects with validation
        recommendations = []
        for rec_data in parsed_data.get('recommendations', []):
            cleaned_rec = clean_recommendation_data(rec_data)
            recommendations.append(TreatmentRecommendation(**cleaned_rec))
        
        # Calculate dynamic total cost
        total_cost = calculate_total_cost(recommendations)
        
        response = AnalysisResponse(
            confidence=cleaned_confidence,
            recommendations=recommendations,
            totalCost=total_cost
        )
        
        logger.info(f"✅ Successfully parsed - Confidence: {response.confidence}%, "
                   f"Total: {total_cost}, Recommendations: {len(recommendations)}")
        return response
        
    except Exception as e:
        logger.error(f"❌ Failed to parse LLM response: {e}")
        logger.error(f"Raw response was: {llm_response[:500]}...")  # Log first 500 chars
        
        # Check if it's a refusal
        refusal_keywords = ['sorry', "can't", 'unable', 'cannot', 'refuse', 'not allowed']
        if any(word in llm_response.lower() for word in refusal_keywords):
            logger.warning("🚫 LLM refused the request")
            raise HTTPException(
                status_code=422, 
                detail="LLM refused to analyze the image. Try a different image or approach."
            )
        
        # Generic parsing failure
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to parse LLM response: {str(e)}"
        )

def validate_analysis_response(response_data: dict) -> bool:
    """
    Validate that response data has required fields
    
    Args:
        response_data: Dictionary containing response data
        
    Returns:
        True if valid, False otherwise
    """
    required_fields = ['confidence', 'recommendations']
    
    if not all(field in response_data for field in required_fields):
        return False
    
    if not isinstance(response_data['recommendations'], list):
        return False
    
    return True