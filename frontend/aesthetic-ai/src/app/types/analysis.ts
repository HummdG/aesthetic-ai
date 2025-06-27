// src/app/types/analysis.ts
export interface TreatmentRecommendation {
  treatment: string;           // e.g., "Lip Enhancement Filler"
  area: string;               // e.g., "Lip volume and definition"
  severity: string;           // e.g., "Mild", "Moderate", "Enhancement"
  dosage?: string;            // e.g., "15-20 units"
  volume?: string;            // e.g., "0.5-1.0ml"
  estimatedCost: string;      // e.g., "$400-500"
}

export interface AnalysisResult {
  confidence: number;                           // AI confidence percentage
  recommendations: TreatmentRecommendation[];   // Array of enhancement suggestions
  totalCost: string;                           // ← Added dynamic total cost
}

export interface CameraState {
  showCamera: boolean;        // Whether camera UI is visible
  cameraStream: MediaStream | null;  // Camera video stream
  cameraLoading: boolean;     // Loading state for camera initialization
}

export interface EnhancementArea {
  name: string;              // e.g., "Lips", "Eyes", "Forehead"
  emoji: string;             // Visual representation
  description: string;       // Brief description of enhancement
}

export interface ProviderInfo {
  name: string;
  location: string;
  rating: number;
  specialties: string[];
  priceRange: string;
}