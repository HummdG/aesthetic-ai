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
      id: "user-check",
      title: "Welcome",
      subtitle: "Let's get to know you",
      icon: <UserIcon />,
      isCompleted: currentStep > 0,
      isActive: currentStep === 0,
    },
    {
      id: "basic-info",
      title: "Basic Information",
      subtitle: "Personal details for analysis",
      icon: <InfoIcon />,
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
    },
    {
      id: "medical-history",
      title: "Medical History",
      subtitle: "Health information for safer recommendations",
      icon: <MedicalIcon />,
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
    },
    {
      id: "skin-treatment",
      title: "Skin & Treatment",
      subtitle: "Your skincare experience",
      icon: <SkinIcon />,
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
    },
  ];

  // Load existing user data
  const loadUserData = (username: string) => {
    const userData = localStorage.getItem(`skinAnalysis_${username}`);
    if (userData) {
      try {
        const parsedData: UserSurveyData = JSON.parse(userData);
        setExistingData(parsedData);
        setFormData(parsedData);
        return true;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    return false;
  };

  // Save user data
  const saveUserData = (data: UserSurveyData) => {
    localStorage.setItem(`skinAnalysis_${data.username}`, JSON.stringify(data));
  };

  // Handle username submission
  const handleUsernameSubmit = () => {
    if (username.trim()) {
      const userExists = loadUserData(username.trim());
      if (userExists) {
        setIsReturningUser(true);
        // Skip to completion with existing data
        const completeData: UserSurveyData = {
          ...existingData!,
          completedAt: new Date().toISOString(),
          version: "1.0",
        };
        onComplete(completeData);
      } else {
        setFormData((prev) => ({ ...prev, username: username.trim() }));
        setCurrentStep(1);
      }
    }
  };

  // Handle form completion
  const handleComplete = () => {
    const completeData: UserSurveyData = {
      ...formData,
      completedAt: new Date().toISOString(),
      version: "1.0",
    };
    saveUserData(completeData);
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
          {currentStep === 0 && (
            <UserCheckStep
              username={username}
              setUsername={setUsername}
              handleUsernameSubmit={handleUsernameSubmit}
            />
          )}

          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData.basicInfo}
              handleFieldChange={handleFieldChange}
              handleMultiSelect={handleMultiSelect}
            />
          )}

          {currentStep === 2 && (
            <MedicalHistoryStep
              formData={formData.medicalHistory}
              handleFieldChange={handleFieldChange}
              handleMultiSelect={handleMultiSelect}
            />
          )}

          {currentStep === 3 && (
            <SkinTreatmentStep
              formData={formData.skinInfo}
              handleFieldChange={handleFieldChange}
              handleMultiSelect={handleMultiSelect}
            />
          )}
        </div>

        {/* Navigation */}
        <Navigation
          currentStep={currentStep}
          stepsLength={steps.length}
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
          onSkip={onSkip}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default UserSurveyForm;
