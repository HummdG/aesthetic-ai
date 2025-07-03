// src/app/utils/analysisHelper.ts
import { UserSurveyData } from '../types/userSurvey';

export class AnalysisHelper {
  // Convert user survey data to analysis context for LLM
  static createAnalysisContext(userData: UserSurveyData): string {
    const context = [];
    
    // User basic info
    context.push(`User: ${userData.username}`);
    context.push(`Age: ${userData.basicInfo.age}`);
    context.push(`Skin Type: ${userData.skinInfo.skinType}`);
    
    // Medical considerations
    if (userData.medicalHistory.allergies.length > 0) {
      context.push(`Allergies: ${userData.medicalHistory.allergies.join(', ')}`);
    }
    
    if (userData.medicalHistory.chronicConditions.length > 0) {
      context.push(`Chronic Conditions: ${userData.medicalHistory.chronicConditions.join(', ')}`);
    }
    
    if (userData.medicalHistory.currentMedications.length > 0) {
      context.push(`Current Medications: ${userData.medicalHistory.currentMedications.join(', ')}`);
    }
    
    // Pregnancy status
    if (userData.basicInfo.isPregnant) {
      context.push(`Currently pregnant or nursing - recommend pregnancy-safe ingredients only`);
    }
    
    // Skin experience
    if (userData.skinInfo.hasUsedSkincare) {
      context.push(`Has previous skincare experience`);
    } else {
      context.push(`New to skincare - recommend gentle, beginner-friendly products`);
    }
    
    // Previous reactions
    if (userData.medicalHistory.previousReactions.length > 0) {
      context.push(`Previous adverse reactions: ${userData.medicalHistory.previousReactions.join(', ')}`);
    }
    
    // Sun exposure
    context.push(`Sun exposure level: ${userData.basicInfo.sunExposure}`);
    
    // Family history
    if (userData.basicInfo.geneticConditions.length > 0) {
      context.push(`Family history: ${userData.basicInfo.geneticConditions.join(', ')}`);
    }
    
    // Previous procedures
    if (userData.skinInfo.cosmeticProcedures.length > 0) {
      context.push(`Previous cosmetic procedures: ${userData.skinInfo.cosmeticProcedures.join(', ')}`);
    }
    
    return context.join('\n');
  }

  // Generate safety warnings based on user data
  static generateSafetyWarnings(userData: UserSurveyData): string[] {
    const warnings = [];
    
    if (userData.basicInfo.isPregnant) {
      warnings.push('Avoid retinoids, salicylic acid, and hydroquinone during pregnancy');
    }
    
    if (userData.medicalHistory.allergies.includes('Fragrances')) {
      warnings.push('Avoid fragranced products');
    }
    
    if (userData.medicalHistory.chronicConditions.includes('Eczema')) {
      warnings.push('Use gentle, fragrance-free products to avoid eczema flare-ups');
    }
    
    if (userData.medicalHistory.chronicConditions.includes('Rosacea')) {
      warnings.push('Avoid alcohol-based products and strong acids that may trigger rosacea');
    }
    
    if (userData.basicInfo.sunExposure === 'excessive') {
      warnings.push('Daily broad-spectrum SPF 30+ is critical due to high sun exposure');
    }
    
    return warnings;
  }

  // Get age-appropriate recommendations
  static getAgeRecommendations(age: number): string[] {
    const recommendations = [];
    
    if (age < 25) {
      recommendations.push('Focus on gentle cleansing and moisturizing');
      recommendations.push('Introduce sunscreen as a daily habit');
    } else if (age < 35) {
      recommendations.push('Consider preventive anti-aging ingredients like vitamin C');
      recommendations.push('Maintain consistent sun protection');
    } else if (age < 50) {
      recommendations.push('Incorporate retinoids for anti-aging benefits');
      recommendations.push('Focus on hydration and barrier repair');
    } else {
      recommendations.push('Emphasize gentle but effective anti-aging treatments');
      recommendations.push('Prioritize hydration and skin barrier support');
    }
    
    return recommendations;
  }
}

// Updated API call function to include survey data
export const analyzeSkinWithSurvey = async (
  file: File, 
  userData: UserSurveyData | null = null
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Include survey data as context
  if (userData) {
    const context = AnalysisHelper.createAnalysisContext(userData);
    const warnings = AnalysisHelper.generateSafetyWarnings(userData);
    const ageRecommendations = AnalysisHelper.getAgeRecommendations(userData.basicInfo.age);
    
    formData.append('userContext', context);
    formData.append('safetyWarnings', JSON.stringify(warnings));
    formData.append('ageRecommendations', JSON.stringify(ageRecommendations));
    formData.append('username', userData.username);
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // FIX: Add the /api/v1 prefix to match backend routing
  const response = await fetch(`${apiUrl}/api/v1/analyze/skin`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}: Analysis failed`);
  }
  
  return await response.json();
};