"use client";

import React, { useState, useEffect } from "react";
import { UserSurveyData, SurveyStep } from "../types/userSurvey";
import { ProgressBar } from "./survey/shared/ProgressBar";
import { Navigation } from "./survey/shared/Navigation";
import {
  UserIcon,
  InfoIcon,
  MedicalIcon,
  SkinIcon,
} from "./survey/shared/Icons";
import { UserCheckStep } from "./survey/steps/UserCheckStep";
import { BasicInfoStep } from "./survey/steps/BasicInfoStep";
import { MedicalHistoryStep } from "./survey/steps/MedicalHistoryStep";
import { SkinTreatmentStep } from "./survey/steps/SkinTreatmentStep";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import AuthModal from "./auth/AuthModal";

interface UserSurveyFormProps {
  onComplete: (data: UserSurveyData) => void;
  onSkip: () => void;
}

const UserSurveyForm: React.FC<UserSurveyFormProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [username, setUsername] = useState("");
  const [existingData, setExistingData] = useState<UserSurveyData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, getAuthToken } = useAuth();

  // Form data state
  const [formData, setFormData] = useState<
    Omit<UserSurveyData, "completedAt" | "version">
  >({
    username: "",
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      cosmeticProcedures: [],
      previousReactions: [],
    },
    skinInfo: {
      hasUsedSkincare: false,
      skinType: "unknown",
      previousReactions: [],
      cosmeticProcedures: [],
    },
    basicInfo: {
      age: 0,
      country: "",
      isPregnant: false,
      sunExposure: "moderate",
      familyHistory: [],
      geneticConditions: [],
    },
  });

  // Scroll to "Personalized Skin Analysis" section when step changes
  useEffect(() => {
    if (currentStep > 0) {
      // Remove focus from any currently focused element to prevent auto-focus
      if (
        document.activeElement &&
        document.activeElement instanceof HTMLElement
      ) {
        document.activeElement.blur();
      }

      // Smooth scroll to the survey section with a slight delay to ensure content has rendered
      setTimeout(() => {
        const surveySection = document.getElementById(
          "personalized-skin-analysis"
        );
        if (surveySection) {
          surveySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        // Ensure no input fields are focused after rendering
        setTimeout(() => {
          if (
            document.activeElement &&
            document.activeElement instanceof HTMLElement
          ) {
            document.activeElement.blur();
          }
        }, 50);
      }, 100);
    }
  }, [currentStep]);

  // Survey steps configuration
  const steps: SurveyStep[] = [
    {
      id: "basic-info",
      title: "Basic Information",
      subtitle: "Personal details for analysis",
      icon: <InfoIcon />,
      isCompleted: currentStep > 0,
      isActive: currentStep === 0,
    },
    {
      id: "medical-history",
      title: "Medical History",
      subtitle: "Health information for safer recommendations",
      icon: <MedicalIcon />,
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      id: "skin-treatment",
      title: "Skin & Treatment",
      subtitle: "Your skincare experience",
      icon: <SkinIcon />,
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
    },
  ];

  // Load existing user survey data with retry logic
  const loadUserSurvey = async (retryCount = 0) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) {
        console.log("No auth token available");
        return;
      }

      console.log("🔑 Auth token generated:", {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + "...",
        userEmail: user?.email,
        userId: user?.uid,
        emailVerified: user?.emailVerified,
        attempt: retryCount + 1,
        timestamp: new Date().toISOString(),
      });

      const latestSurvey = await apiService.getLatestSurvey(token);
      if (
        latestSurvey &&
        typeof latestSurvey === "object" &&
        latestSurvey !== null &&
        "survey_data" in latestSurvey
      ) {
        const surveyData = (latestSurvey as any).survey_data as UserSurveyData;
        setExistingData(surveyData);
        setFormData(surveyData);
        setIsReturningUser(true);
      }
    } catch (error) {
      console.error(
        `Error loading user survey (attempt ${retryCount + 1}):`,
        error
      );

      // If it's a token authentication error and we haven't retried yet, try again
      if (
        error instanceof Error &&
        error.message.includes("Invalid authentication token") &&
        retryCount < 2
      ) {
        console.log(`🔄 Retrying in 2 seconds... (attempt ${retryCount + 2})`);
        setTimeout(() => {
          loadUserSurvey(retryCount + 1);
        }, 2000);
        return;
      }

      // Don't show error to user for missing survey - it's normal for new users
      if (error instanceof Error && !error.message.includes("not found")) {
        setError(`Failed to load survey data: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save user survey data
  const saveUserSurvey = async (data: UserSurveyData) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) return;

      await apiService.createSurvey(token, data);
    } catch (error) {
      console.error("Error saving user survey:", error);
      setError("Failed to save survey data");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authenticated and load survey data
  useEffect(() => {
    if (user) {
      // Add a longer delay to ensure Firebase token is fully ready
      const timer = setTimeout(() => {
        loadUserSurvey();
      }, 2000); // Increased from 500ms to 2000ms

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Handle form completion
  const handleComplete = async () => {
    if (!user) {
      setAuthMode("login");
      setIsAuthModalOpen(true);
      return;
    }

    const completeData: UserSurveyData = {
      ...formData,
      username: user.displayName || user.email || "User",
      completedAt: new Date().toISOString(),
      version: "1.0",
    };

    await saveUserSurvey(completeData);
    onComplete(completeData);
  };

  // Handle next step with scroll
  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Handle previous step with scroll
  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Multi-select handler
  const handleMultiSelect = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    const fieldParts = field.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }

      const finalField = fieldParts[fieldParts.length - 1];
      const currentArray = current[finalField] || [];

      if (checked) {
        current[finalField] = [...currentArray, value];
      } else {
        current[finalField] = currentArray.filter(
          (item: string) => item !== value
        );
      }

      return newData;
    });
  };

  // Single field handler
  const handleFieldChange = (field: string, value: any) => {
    const fieldParts = field.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < fieldParts.length - 1; i++) {
        current = current[fieldParts[i]];
      }

      current[fieldParts[fieldParts.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-elegant p-4 sm:p-8 mb-4 sm:mb-6">
          {!user && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-brown-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-brown-900 mb-2">
                Sign in to continue
              </h3>
              <p className="text-brown-600 font-body mb-6">
                Please sign in to access your personalized skin analysis survey
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {user && (
            <>
              {currentStep === 0 && (
                <BasicInfoStep
                  formData={formData.basicInfo}
                  handleFieldChange={handleFieldChange}
                  handleMultiSelect={handleMultiSelect}
                />
              )}

              {currentStep === 1 && (
                <MedicalHistoryStep
                  formData={formData.medicalHistory}
                  handleFieldChange={handleFieldChange}
                  handleMultiSelect={handleMultiSelect}
                />
              )}

              {currentStep === 2 && (
                <SkinTreatmentStep
                  formData={formData.skinInfo}
                  handleFieldChange={handleFieldChange}
                  handleMultiSelect={handleMultiSelect}
                />
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        {user && (
          <Navigation
            currentStep={currentStep}
            stepsLength={steps.length}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onSkip={onSkip}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default UserSurveyForm;
