// src/app/types/skinAnalysis.ts
export interface IngredientRecommendation {
  ingredient: string;           // e.g., "Retinol"
  purpose: string;             // e.g., "Reduces acne and improves skin texture"
  concentration?: string;      // e.g., "0.5-1%"
  application: string;         // e.g., "Apply PM, 2-3 times per week"
  benefits: string;           // e.g., "Unclogs pores, reduces inflammation"
}

export interface SkinAnalysisResult {
  confidence: number;                              // AI confidence percentage
  primaryCondition: string;                        // Main skin condition detected
  secondaryConditions: string[];                   // Additional conditions
  skinType: string;                               // Overall skin type
  ingredientRecommendations: IngredientRecommendation[];  // Ingredient suggestions
  description: string;                            // Detailed analysis description
}

export interface CameraState {
  showCamera: boolean;        // Whether camera UI is visible
  cameraStream: MediaStream | null;  // Camera video stream
  cameraLoading: boolean;     // Loading state for camera initialization
}

export interface SkinCondition {
  name: string;              // e.g., "Acne-prone skin"
  description: string;       // Brief description
  commonIngredients: string[]; // Common ingredients for this condition
}