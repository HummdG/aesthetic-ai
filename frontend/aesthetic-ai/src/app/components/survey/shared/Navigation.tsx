import React from "react";

interface NavigationProps {
  currentStep: number;
  stepsLength: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  stepsLength,
  onPrevious,
  onNext,
  onSkip,
  onComplete,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 px-4 sm:px-0">
      {currentStep > 0 && (
        <button
          onClick={onPrevious}
          className="order-2 sm:order-1 px-6 py-4 border-2 border-nude-300 text-brown-700 rounded-lg hover:border-primary hover:text-primary transition-all duration-200 select-none cursor-pointer font-medium text-base min-h-[56px] touch-manipulation"
        >
          Previous
        </button>
      )}
      <div
        className={`${
          currentStep === 0 ? "order-1" : "order-1 sm:order-2"
        } flex flex-col sm:flex-row gap-4 ${
          currentStep === 0 ? "ml-auto" : ""
        }`}
      >
        <button
          onClick={onSkip}
          className="px-6 py-4 text-brown-600 hover:text-brown-800 transition-colors select-none cursor-pointer font-medium text-base min-h-[56px] touch-manipulation"
        >
          Skip Survey
        </button>
        {currentStep < stepsLength - 1 ? (
          <button
            onClick={onNext}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 shadow-md select-none cursor-pointer text-base min-h-[56px] touch-manipulation"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 shadow-md select-none cursor-pointer text-base min-h-[56px] touch-manipulation"
          >
            Complete Survey
          </button>
        )}
      </div>
    </div>
  );
};
