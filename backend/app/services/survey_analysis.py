# backend/app/services/survey_analysis.py
from typing import List, Dict, Any
import json
from .survey_schemas import UserSurveyData

class SurveyAnalysisService:
    """Service for processing user survey data and generating analysis context"""
    
    @staticmethod
    def create_llm_context(survey_data: UserSurveyData) -> str:
        """Create context string for LLM based on survey data"""
        context_parts = []
        
        # Basic information
        context_parts.append(f"User Profile: {survey_data.username}")
        context_parts.append(f"Age: {survey_data.basic_info.age}")
        context_parts.append(f"Skin Type: {survey_data.skin_info.skin_type}")
        
        # Medical considerations
        if survey_data.medical_history.allergies:
            context_parts.append(f"Known Allergies: {', '.join(survey_data.medical_history.allergies)}")
        
        if survey_data.medical_history.chronic_conditions:
            context_parts.append(f"Chronic Conditions: {', '.join(survey_data.medical_history.chronic_conditions)}")
        
        if survey_data.medical_history.current_medications:
            context_parts.append(f"Current Medications: {', '.join(survey_data.medical_history.current_medications)}")
        
        # Pregnancy status
        if survey_data.basic_info.is_pregnant:
            context_parts.append("IMPORTANT: User is pregnant or nursing - recommend pregnancy-safe ingredients only!")
        
        # Skincare experience
        if survey_data.skin_info.has_used_skincare:
            context_parts.append("User has previous skincare experience")
        else:
            context_parts.append("User is new to skincare - recommend gentle, beginner-friendly products")
        
        # Previous reactions
        if survey_data.medical_history.previous_reactions:
            context_parts.append(f"Previous Adverse Reactions: {', '.join(survey_data.medical_history.previous_reactions)}")
        
        # Sun exposure
        context_parts.append(f"Sun Exposure Level: {survey_data.basic_info.sun_exposure}")
        
        # Family history
        if survey_data.basic_info.genetic_conditions:
            context_parts.append(f"Family History: {', '.join(survey_data.basic_info.genetic_conditions)}")
        
        # Previous procedures
        if survey_data.skin_info.cosmetic_procedures:
            context_parts.append(f"Previous Cosmetic Procedures: {', '.join(survey_data.skin_info.cosmetic_procedures)}")
        
        return "\n".join(context_parts)
    
    @staticmethod
    def generate_safety_warnings(survey_data: UserSurveyData) -> List[str]:
        """Generate safety warnings based on user survey data"""
        warnings = []
        
        # Pregnancy warnings
        if survey_data.basic_info.is_pregnant:
            warnings.append("Avoid retinoids, salicylic acid, and hydroquinone during pregnancy")
            warnings.append("Use mineral sunscreens instead of chemical ones")
        
        # Allergy warnings
        if "Fragrances" in survey_data.medical_history.allergies:
            warnings.append("Avoid fragranced products")
        
        if "Sulfates" in survey_data.medical_history.allergies:
            warnings.append("Avoid sulfate-containing cleansers")
        
        if "Parabens" in survey_data.medical_history.allergies:
            warnings.append("Choose paraben-free products")
        
        # Condition-specific warnings
        if "Eczema" in survey_data.medical_history.chronic_conditions:
            warnings.append("Use gentle, fragrance-free products to avoid eczema flare-ups")
            warnings.append("Avoid products with high alcohol content")
        
        if "Rosacea" in survey_data.medical_history.chronic_conditions:
            warnings.append("Avoid alcohol-based products and strong acids that may trigger rosacea")
            warnings.append("Use products with anti-inflammatory ingredients")
        
        if "Psoriasis" in survey_data.medical_history.chronic_conditions:
            warnings.append("Gentle exfoliation only - avoid harsh scrubs")
            warnings.append("Focus on moisturizing and barrier repair")
        
        # Sun exposure warnings
        if survey_data.basic_info.sun_exposure == 'excessive':
            warnings.append("Daily broad-spectrum SPF 30+ is critical due to high sun exposure")
            warnings.append("Consider antioxidant serums for additional protection")
        
        return warnings
    
    @staticmethod
    def get_age_recommendations(age: int) -> List[str]:
        """Get age-appropriate skincare recommendations"""
        if age < 25:
            return [
                "Focus on gentle cleansing and basic moisturizing",
                "Establish a consistent sun protection routine",
                "Address specific concerns like acne with targeted treatments"
            ]
        elif age < 35:
            return [
                "Incorporate preventive anti-aging ingredients like vitamin C",
                "Maintain consistent sun protection",
                "Consider gentle exfoliation with AHA/BHA"
            ]
        elif age < 50:
            return [
                "Introduce retinoids for anti-aging benefits",
                "Focus on hydration and barrier repair",
                "Use products with peptides and antioxidants"
            ]
        else:
            return [
                "Emphasize gentle but effective anti-aging treatments",
                "Prioritize hydration and skin barrier support",
                "Consider professional treatments for enhanced results"
            ]
    
    @staticmethod
    def get_skin_type_recommendations(skin_type: str) -> List[str]:
        """Get skin type-specific recommendations"""
        recommendations = {
            'oily': [
                "Use gel-based or lightweight moisturizers",
                "Incorporate BHA (salicylic acid) for pore care",
                "Look for non-comedogenic products"
            ],
            'dry': [
                "Use rich, creamy moisturizers",
                "Incorporate hyaluronic acid for hydration",
                "Avoid harsh cleansers and over-exfoliation"
            ],
            'combination': [
                "Use different products for different zones",
                "Balance oil control with hydration",
                "Consider targeted treatments for specific areas"
            ],
            'sensitive': [
                "Choose fragrance-free, hypoallergenic products",
                "Introduce new products gradually",
                "Avoid harsh actives and physical exfoliants"
            ],
            'normal': [
                "Maintain balance with gentle, effective products",
                "Focus on prevention and maintenance",
                "Can tolerate most ingredients with proper introduction"
            ]
        }
        return recommendations.get(skin_type, [])
