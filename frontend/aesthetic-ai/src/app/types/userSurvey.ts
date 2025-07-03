// src/app/types/userSurvey.ts
export interface UserMedicalHistory {
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  cosmeticProcedures: string[];
  previousReactions: string[];
}

export interface UserSkinInfo {
  hasUsedSkincare: boolean;
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal' | 'unknown';
  previousReactions: string[];
  cosmeticProcedures: string[];
}

export interface UserBasicInfo {
  age: number;
  isPregnant: boolean;
  sunExposure: 'minimal' | 'moderate' | 'frequent' | 'excessive';
  familyHistory: string[];
  geneticConditions: string[];
}

export interface UserSurveyData {
  username: string;
  medicalHistory: UserMedicalHistory;
  skinInfo: UserSkinInfo;
  basicInfo: UserBasicInfo;
  completedAt: string;
  version: string; // For future survey updates
}

export interface SurveyStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
}

export interface SurveyFormProps {
  onComplete: (data: UserSurveyData) => void;
  onSkip: () => void;
  existingUser?: UserSurveyData | null;
}

// Common options for select fields
export const SKIN_TYPES = [
  { value: 'oily', label: 'Oily - Shiny, enlarged pores' },
  { value: 'dry', label: 'Dry - Tight, flaky, rough texture' },
  { value: 'combination', label: 'Combination - Oily T-zone, dry cheeks' },
  { value: 'sensitive', label: 'Sensitive - Easily irritated, reactive' },
  { value: 'normal', label: 'Normal - Balanced, healthy appearance' },
  { value: 'unknown', label: 'Not sure / Unknown' }
];

export const SUN_EXPOSURE_OPTIONS = [
  { value: 'minimal', label: 'Minimal - Mostly indoors, always use sunscreen' },
  { value: 'moderate', label: 'Moderate - Regular outdoor activities with protection' },
  { value: 'frequent', label: 'Frequent - Often outdoors, sometimes forget sunscreen' },
  { value: 'excessive', label: 'Excessive - Frequent sun exposure, rarely use protection' }
];

export const COMMON_ALLERGIES = [
  'Fragrances', 'Preservatives', 'Sulfates', 'Parabens', 'Silicones',
  'Essential oils', 'Lanolin', 'Formaldehyde', 'Nickel', 'Latex',
  'Food allergies', 'Seasonal allergies', 'None known'
];

export const CHRONIC_CONDITIONS = [
  'PCOS', 'Eczema', 'Psoriasis', 'Rosacea', 'Seborrheic dermatitis',
  'Vitiligo', 'Melasma', 'Hormonal imbalances', 'Autoimmune conditions',
  'Diabetes', 'Thyroid disorders', 'None'
];

export const COSMETIC_PROCEDURES = [
  'Chemical peels', 'Microneedling', 'Laser treatments', 'Botox',
  'Dermal fillers', 'Microdermabrasion', 'IPL/Photo facials',
  'Surgical procedures', 'Professional extractions', 'None'
];

export const GENETIC_CONDITIONS = [
  'Family history of acne', 'Early aging/wrinkles', 'Hyperpigmentation',
  'Sensitive skin', 'Dry skin conditions', 'Oily skin conditions',
  'Skin cancer history', 'Autoimmune skin conditions', 'None known'
];