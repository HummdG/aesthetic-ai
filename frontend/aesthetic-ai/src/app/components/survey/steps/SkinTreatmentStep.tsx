import React from "react";
import {
  UserSkinInfo,
  SKIN_TYPES,
  COSMETIC_PROCEDURES,
} from "../../../types/userSurvey";
import { FormSection, MultiSelectGrid } from "../shared/FormComponents";

interface SkinTreatmentStepProps {
  formData: UserSkinInfo;
  handleFieldChange: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string, checked: boolean) => void;
}

export const SkinTreatmentStep: React.FC<SkinTreatmentStepProps> = ({
  formData,
  handleFieldChange,
  handleMultiSelect,
}) => (
  <div className="space-y-8">
    <FormSection
      title="Skincare Experience"
      subtitle="Tell us about your skincare journey"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 border border-nude-200 rounded-lg">
          <input
            type="checkbox"
            id="hasUsedSkincare"
            checked={formData.hasUsedSkincare}
            onChange={(e) =>
              handleFieldChange("skinInfo.hasUsedSkincare", e.target.checked)
            }
            className="w-6 h-6 text-primary focus:ring-primary rounded flex-shrink-0 select-none"
          />
          <label
            htmlFor="hasUsedSkincare"
            className="text-base text-brown-900 font-body cursor-pointer select-none flex-1"
          >
            I have used skincare products before
          </label>
        </div>
      </div>
    </FormSection>

    <FormSection title="Skin Type" subtitle="What best describes your skin?">
      <div className="space-y-4">
        {SKIN_TYPES.map((type) => (
          <label
            key={type.value}
            className="flex items-start space-x-3 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[80px] touch-manipulation group"
          >
            <input
              type="radio"
              name="skinType"
              value={type.value}
              checked={formData.skinType === type.value}
              onChange={(e) =>
                handleFieldChange("skinInfo.skinType", e.target.value)
              }
              className="mt-1 text-primary focus:ring-primary w-5 h-5 min-w-[20px] flex-shrink-0 select-none"
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
        selected={formData.cosmeticProcedures}
        onChange={(value, checked) =>
          handleMultiSelect("skinInfo.cosmeticProcedures", value, checked)
        }
      />
    </FormSection>
  </div>
);
