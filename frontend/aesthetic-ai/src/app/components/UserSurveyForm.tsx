"use client";

import React, { useState, useEffect } from "react";
import {
  UserSurveyData,
  UserMedicalHistory,
  UserSkinInfo,
  UserBasicInfo,
  SurveyStep,
  SKIN_TYPES,
  SUN_EXPOSURE_OPTIONS,
  COMMON_ALLERGIES,
  CHRONIC_CONDITIONS,
  COSMETIC_PROCEDURES,
  GENETIC_CONDITIONS,
} from "../types/userSurvey";

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
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown-900 mb-2 select-none">
            AI-Powered Skin Analysis
          </h1>
          <p className="text-base sm:text-lg text-brown-700 font-body select-none px-4">
            Discover your skin condition and get personalized ingredient
            recommendations powered by AI
          </p>
        </div>

        {/* Survey Section Header */}
        {currentStep > 0 && (
          <div
            id="personalized-skin-analysis"
            className="text-center mb-6 sm:mb-8 select-none"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brown-900 mb-2 select-none">
              Personalized Skin Analysis
            </h2>
            <p className="text-base sm:text-lg text-brown-700 font-body select-none px-4">
              Help us provide you with the most accurate recommendations
            </p>
          </div>
        )}

        {/* Progress Steps */}
        {currentStep > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4 sm:mb-6 overflow-x-auto px-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 select-none ${
                      step.isCompleted
                        ? "bg-primary text-white"
                        : step.isActive
                        ? "bg-primary text-white"
                        : "bg-nude-200 text-brown-600"
                    }`}
                  >
                    <div className="scale-75 sm:scale-100">
                      {step.isCompleted ? <CheckIcon /> : step.icon}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300 select-none ${
                        step.isCompleted ? "bg-primary" : "bg-nude-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center select-none px-4">
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-brown-900 mb-1 select-none">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-sm sm:text-base text-brown-600 font-body select-none">
                {steps[currentStep]?.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-elegant p-4 sm:p-8 mb-4 sm:mb-6">
          {/* Step 0: Username Check */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-8 select-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-brown-600 rounded-full flex items-center justify-center mx-auto mb-4 select-none">
                  <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-brown-900 mb-2 select-none">
                  Welcome to Your Skin Journey
                </h3>
                <p className="text-brown-600 font-body select-none text-base px-4">
                  Enter your username to begin or continue your personalized
                  analysis
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-base font-medium text-brown-900 mb-3 select-none">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                  placeholder="Enter your username"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleUsernameSubmit()
                  }
                />
                <button
                  onClick={handleUsernameSubmit}
                  disabled={!username.trim()}
                  className="w-full mt-4 bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none text-base min-h-[56px] touch-manipulation"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <FormSection
                title="Personal Details"
                subtitle="Basic information for analysis"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-base font-medium text-brown-900 mb-3 select-none">
                      Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={formData.basicInfo.age || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "basicInfo.age",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="flex items-center space-x-4 p-4 border border-nude-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="isPregnant"
                      checked={formData.basicInfo.isPregnant}
                      onChange={(e) =>
                        handleFieldChange(
                          "basicInfo.isPregnant",
                          e.target.checked
                        )
                      }
                      className="w-6 h-6 text-primary focus:ring-primary rounded"
                    />
                    <label
                      htmlFor="isPregnant"
                      className="text-base text-brown-900 font-body cursor-pointer select-none leading-tight"
                    >
                      Currently pregnant or nursing
                    </label>
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="Sun Exposure"
                subtitle="How much sun do you typically get?"
              >
                <div className="space-y-4">
                  {SUN_EXPOSURE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start space-x-4 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[80px] touch-manipulation"
                    >
                      <input
                        type="radio"
                        name="sunExposure"
                        value={option.value}
                        checked={
                          formData.basicInfo.sunExposure === option.value
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            "basicInfo.sunExposure",
                            e.target.value
                          )
                        }
                        className="mt-1 text-primary focus:ring-primary w-5 h-5 min-w-[20px]"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-brown-900 select-none text-base mb-1">
                          {option.label.split(" - ")[0]}
                        </div>
                        <div className="text-sm text-brown-600 select-none leading-tight">
                          {option.label.split(" - ")[1]}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </FormSection>

              <FormSection
                title="Family History"
                subtitle="Any genetic skin conditions in your family?"
              >
                <MultiSelectGrid
                  options={GENETIC_CONDITIONS}
                  selected={formData.basicInfo.geneticConditions}
                  onChange={(value, checked) =>
                    handleMultiSelect(
                      "basicInfo.geneticConditions",
                      value,
                      checked
                    )
                  }
                />
              </FormSection>
            </div>
          )}

          {/* Step 2: Medical History */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <FormSection
                title="Allergies"
                subtitle="Select any known allergies"
              >
                <MultiSelectGrid
                  options={COMMON_ALLERGIES}
                  selected={formData.medicalHistory.allergies}
                  onChange={(value, checked) =>
                    handleMultiSelect(
                      "medicalHistory.allergies",
                      value,
                      checked
                    )
                  }
                />
              </FormSection>

              <FormSection
                title="Chronic Conditions"
                subtitle="Any conditions that affect your skin"
              >
                <MultiSelectGrid
                  options={CHRONIC_CONDITIONS}
                  selected={formData.medicalHistory.chronicConditions}
                  onChange={(value, checked) =>
                    handleMultiSelect(
                      "medicalHistory.chronicConditions",
                      value,
                      checked
                    )
                  }
                />
              </FormSection>

              <FormSection
                title="Current Medications"
                subtitle="List any medications you're currently taking"
              >
                <CustomInputList
                  values={formData.medicalHistory.currentMedications}
                  onChange={(values) =>
                    handleFieldChange(
                      "medicalHistory.currentMedications",
                      values
                    )
                  }
                  placeholder="Enter medication name"
                />
              </FormSection>
            </div>
          )}

          {/* Step 3: Skin & Treatment */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <FormSection
                title="Skincare Experience"
                subtitle="Tell us about your skincare journey"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border border-nude-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="hasUsedSkincare"
                      checked={formData.skinInfo.hasUsedSkincare}
                      onChange={(e) =>
                        handleFieldChange(
                          "skinInfo.hasUsedSkincare",
                          e.target.checked
                        )
                      }
                      className="w-6 h-6 text-primary focus:ring-primary rounded"
                    />
                    <label
                      htmlFor="hasUsedSkincare"
                      className="text-base text-brown-900 font-body cursor-pointer select-none"
                    >
                      I have used skincare products before
                    </label>
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="Skin Type"
                subtitle="What best describes your skin?"
              >
                <div className="space-y-4">
                  {SKIN_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-start space-x-4 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[80px] touch-manipulation"
                    >
                      <input
                        type="radio"
                        name="skinType"
                        value={type.value}
                        checked={formData.skinInfo.skinType === type.value}
                        onChange={(e) =>
                          handleFieldChange("skinInfo.skinType", e.target.value)
                        }
                        className="mt-1 text-primary focus:ring-primary w-5 h-5 min-w-[20px]"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-brown-900 select-none text-base mb-1">
                          {type.label.split(" - ")[0]}
                        </div>
                        <div className="text-sm text-brown-600 select-none leading-tight">
                          {type.label.split(" - ")[1]}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </FormSection>

              <FormSection
                title="Previous Cosmetic Procedures"
                subtitle="Any treatments you've had done"
              >
                <MultiSelectGrid
                  options={COSMETIC_PROCEDURES}
                  selected={formData.skinInfo.cosmeticProcedures}
                  onChange={(value, checked) =>
                    handleMultiSelect(
                      "skinInfo.cosmeticProcedures",
                      value,
                      checked
                    )
                  }
                />
              </FormSection>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep > 0 && (
          <div className="flex flex-col sm:flex-row justify-between gap-4 px-4 sm:px-0">
            <button
              onClick={handlePreviousStep}
              className="order-2 sm:order-1 px-6 py-4 border-2 border-nude-300 text-brown-700 rounded-lg hover:border-primary hover:text-primary transition-all duration-200 select-none cursor-pointer font-medium text-base min-h-[56px] touch-manipulation"
            >
              Previous
            </button>
            <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSkip}
                className="px-6 py-4 text-brown-600 hover:text-brown-800 transition-colors select-none cursor-pointer font-medium text-base min-h-[56px] touch-manipulation"
              >
                Skip Survey
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 shadow-md select-none cursor-pointer text-base min-h-[56px] touch-manipulation"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-4 bg-primary hover:bg-brown-700 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 select-none ring-2 ring-primary ring-opacity-50 cursor-pointer min-h-[56px] touch-manipulation"
                >
                  Complete Survey
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const FormSection: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="mb-8">
    <div className="mb-6">
      <h3 className="text-xl sm:text-lg font-serif font-semibold text-brown-900 mb-2 select-none">
        {title}
      </h3>
      <p className="text-brown-600 font-body text-base sm:text-sm select-none leading-relaxed">
        {subtitle}
      </p>
    </div>
    {children}
  </div>
);

const MultiSelectGrid: React.FC<{
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}> = ({ options, selected, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {options.map((option) => (
      <label
        key={option}
        className="flex items-center space-x-3 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[60px] touch-manipulation"
      >
        <input
          type="checkbox"
          checked={selected.includes(option)}
          onChange={(e) => onChange(option, e.target.checked)}
          className="text-primary focus:ring-primary rounded w-5 h-5 min-w-[20px]"
        />
        <span className="text-base sm:text-sm text-brown-900 font-body select-none leading-tight">
          {option}
        </span>
      </label>
    ))}
  </div>
);

const CustomInputList: React.FC<{
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}> = ({ values, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    if (inputValue.trim() && !values.includes(inputValue.trim())) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeValue = (value: string) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          placeholder={placeholder}
          onKeyPress={(e) => e.key === "Enter" && addValue()}
        />
        <button
          onClick={addValue}
          disabled={!inputValue.trim()}
          className="px-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 select-none min-h-[56px] touch-manipulation text-base"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center px-4 py-2 bg-nude-100 text-brown-800 rounded-full text-base select-none"
          >
            {value}
            <button
              onClick={() => removeValue(value)}
              className="ml-3 text-brown-600 hover:text-brown-800 cursor-pointer select-none text-lg leading-none w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// Icon Components
const UserIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MedicalIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const SkinIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default UserSurveyForm;
