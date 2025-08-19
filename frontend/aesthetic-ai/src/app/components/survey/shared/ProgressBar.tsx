import React from "react";
import { SurveyStep } from "../../../types/userSurvey";
import { CheckIcon } from "./Icons";

interface ProgressBarProps {
  steps: SurveyStep[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
}) => (
  <>
    {/* Survey Section Header */}
    {currentStep > 0 && (
      <div
        id="personalized-skin-analysis"
        className="text-center mb-6 sm:mb-8 select-none"
      >
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-gradient-to-r from-primary/20 to-nude-pink/20 rounded-full text-sm font-inter font-medium text-warm-gray border border-primary/30 tracking-wide">
            ✨ PERSONALIZED SURVEY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-foreground mb-2 select-none">
          Personalized Skin Analysis
        </h2>
        <p className="text-base sm:text-lg text-warm-gray font-inter select-none px-4">
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
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 select-none shadow-luxury ${
                  step.isCompleted
                    ? "bg-gradient-to-br from-primary to-nude-pink text-primary-foreground"
                    : step.isActive
                    ? "bg-gradient-to-br from-primary to-nude-pink text-primary-foreground"
                    : "bg-muted text-warm-gray"
                }`}
              >
                <div className="scale-75 sm:scale-100">
                  {step.isCompleted ? <CheckIcon /> : step.icon}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300 select-none ${
                    step.isCompleted ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center select-none px-4">
          <h2 className="text-xl sm:text-2xl font-playfair font-semibold text-foreground mb-1 select-none">
            {steps[currentStep]?.title}
          </h2>
          <p className="text-sm sm:text-base text-warm-gray font-inter select-none">
            {steps[currentStep]?.subtitle}
          </p>
        </div>
      </div>
    )}
  </>
);
