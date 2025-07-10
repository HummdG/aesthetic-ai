import React from "react";
import {
  UserBasicInfo,
  SUN_EXPOSURE_OPTIONS,
  GENETIC_CONDITIONS,
} from "../../../types/userSurvey";
import { FormSection, MultiSelectGrid } from "../shared/FormComponents";

interface BasicInfoStepProps {
  formData: UserBasicInfo;
  handleFieldChange: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string, checked: boolean) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  handleFieldChange,
  handleMultiSelect,
}) => (
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
            value={formData.age || ""}
            onChange={(e) =>
              handleFieldChange("basicInfo.age", parseInt(e.target.value) || 0)
            }
            className="w-full px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base select-none caret-transparent focus:caret-current"
            placeholder="Enter your age"
          />
        </div>
        <div className="flex items-center space-x-3 p-4 border border-nude-200 rounded-lg">
          <input
            type="checkbox"
            id="isPregnant"
            checked={formData.isPregnant}
            onChange={(e) =>
              handleFieldChange("basicInfo.isPregnant", e.target.checked)
            }
            className="w-6 h-6 text-primary focus:ring-primary rounded flex-shrink-0 select-none"
          />
          <label
            htmlFor="isPregnant"
            className="text-base text-brown-900 font-body cursor-pointer select-none leading-tight flex-1"
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
            className="flex items-start space-x-3 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[80px] touch-manipulation group"
          >
            <input
              type="radio"
              name="sunExposure"
              value={option.value}
              checked={formData.sunExposure === option.value}
              onChange={(e) =>
                handleFieldChange("basicInfo.sunExposure", e.target.value)
              }
              className="mt-1 text-primary focus:ring-primary w-5 h-5 min-w-[20px] flex-shrink-0 select-none"
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
        selected={formData.geneticConditions}
        onChange={(value, checked) =>
          handleMultiSelect("basicInfo.geneticConditions", value, checked)
        }
      />
    </FormSection>
  </div>
);
