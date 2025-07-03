# backend/app/services/survey_analysis.py
from typing import List, Dict, Any
import json

# Import survey schemas if they exist
try:
    from ..models.survey_schemas import UserSurveyData
except ImportError:
    # Define minimal structure if schemas don't exist
    class UserSurveyData:
        def __init__(self, **kwargs):
            for key, value in kwargs.items():
                setattr(self, key, value)

class SurveyAnalysisService:
    """Service for processing user survey data and generating analysis context"""
    
    @staticmethod
    def create_llm_context(survey_data: UserSurveyData) -> str:
        """Create context string for LLM based on survey data"""
        context_parts = []
        
        try:
            # Basic information
            context_parts.append(f"User Profile: {getattr(survey_data, 'username', 'Unknown')}")
            
            # Handle basic info
            if hasattr(survey_data, 'basic_info'):
                basic_info = survey_data.basic_info
                context_parts.append(f"Age: {getattr(basic_info, 'age', 'Unknown')}")
                
                if getattr(basic_info, 'is_pregnant', False):
                    context_parts.append("IMPORTANT: User is pregnant or nursing - recommend pregnancy-safe ingredients only!")
                
                sun_exposure = getattr(basic_info, 'sun_exposure', 'moderate')
                context_parts.append(f"Sun Exposure Level: {sun_exposure}")
                
                genetic_conditions = getattr(basic_info, 'genetic_conditions', [])
                if genetic_conditions:
                    context_parts.append(f"Family History: {', '.join(genetic_conditions)}")
            
            # Handle skin info
            if hasattr(survey_data, 'skin_info'):
                skin_info = survey_data.skin_info
                skin_type = getattr(skin_info, 'skin_type', 'unknown')
                context_parts.append(f"Skin Type: {skin_type}")
                
                has_experience = getattr(skin_info, 'has_used_skincare', False)
                if has_experience:
                    context_parts.append("User has previous skincare experience")
                else:
                    context_parts.append("User is new to skincare - recommend gentle, beginner-friendly products")
                
                procedures = getattr(skin_info, 'cosmetic_procedures', [])
                if procedures:
                    context_parts.append(f"Previous Cosmetic Procedures: {', '.join(procedures)}")
            
            # Handle medical history
            if hasattr(survey_data, 'medical_history'):
                medical_history = survey_data.medical_history
                
                allergies = getattr(medical_history, 'allergies', [])
                if allergies:
                    context_parts.append(f"Known Allergies: {', '.join(allergies)}")
                
                chronic_conditions = getattr(medical_history, 'chronic_conditions', [])
                if chronic_conditions:
                    context_parts.append(f"Chronic Conditions: {', '.join(chronic_conditions)}")
                
                medications = getattr(medical_history, 'current_medications', [])
                if medications:
                    context_parts.append(f"Current Medications: {', '.join(medications)}")
                
                reactions = getattr(medical_history, 'previous_reactions', [])
                if reactions:
                    context_parts.append(f"Previous Adverse Reactions: {', '.join(reactions)}")
            
        except Exception as e:
            context_parts.append(f"Note: Some survey data could not be processed ({str(e)})")
        
        return "\n".join(context_parts)
    
    @staticmethod
    def generate_safety_warnings(survey_data: UserSurveyData) -> List[str]:
        """Generate safety warnings based on user survey data"""
        warnings = []
        
        try:
            # Pregnancy warnings
            if hasattr(survey_data, 'basic_info') and getattr(survey_data.basic_info, 'is_pregnant', False):
                warnings.append("Avoid retinoids, salicylic acid, and hydroquinone during pregnancy")
                warnings.append("Use mineral sunscreens instead of chemical ones")
            
            # Allergy warnings
            if hasattr(survey_data, 'medical_history'):
                allergies = getattr(survey_data.medical_history, 'allergies', [])
                
                if "Fragrances" in allergies:
                    warnings.append("Avoid fragranced products")
                
                if "Sulfates" in allergies:
                    warnings.append("Avoid sulfate-containing cleansers")
                
                if "Parabens" in allergies:
                    warnings.append("Choose paraben-free products")
                
                # Condition-specific warnings
                chronic_conditions = getattr(survey_data.medical_history, 'chronic_conditions', [])
                
                if "Eczema" in chronic_conditions:
                    warnings.append("Use gentle, fragrance-free products to avoid eczema flare-ups")
                    warnings.append("Avoid products with high alcohol content")
                
                if "Rosacea" in chronic_conditions:
                    warnings.append("Avoid alcohol-based products and strong acids that may trigger rosacea")
                    warnings.append("Use products with anti-inflammatory ingredients")
                
                if "Psoriasis" in chronic_conditions:
                    warnings.append("Gentle exfoliation only - avoid harsh scrubs")
                    warnings.append("Focus on moisturizing and barrier repair")
            
            # Sun exposure warnings
            if hasattr(survey_data, 'basic_info'):
                sun_exposure = getattr(survey_data.basic_info, 'sun_exposure', 'moderate')
                if sun_exposure == 'excessive':
                    warnings.append("Daily broad-spectrum SPF 30+ is critical due to high sun exposure")
                    warnings.append("Consider antioxidant serums for additional protection")
        
        except Exception as e:
            warnings.append(f"Unable to process some safety considerations: {str(e)}")
        
        return warnings
    
    @staticmethod
    def get_age_recommendations(age: int) -> List[str]:
        """Get age-appropriate skincare recommendations"""
        try:
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
        except:
            return ["Focus on gentle, appropriate skincare for your age group"]
    
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
        return recommendations.get(skin_type, ["Use products appropriate for your skin type"])
    
    @staticmethod
    def parse_context_string(context_string: str) -> Dict[str, Any]:
        """Parse a context string back into structured data"""
        parsed_data = {}
        
        try:
            lines = context_string.strip().split('\n')
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower().replace(' ', '_')
                    value = value.strip()
                    parsed_data[key] = value
        except Exception as e:
            parsed_data['parsing_error'] = str(e)
        
        return parsed_data