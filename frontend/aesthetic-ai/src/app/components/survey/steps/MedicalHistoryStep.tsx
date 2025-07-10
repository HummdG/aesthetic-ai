import React from "react";
import {
  UserMedicalHistory,
  COMMON_ALLERGIES,
  CHRONIC_CONDITIONS,
} from "../../../types/userSurvey";
import {
  FormSection,
  MultiSelectGrid,
  CustomInputList,
} from "../shared/FormComponents";

interface MedicalHistoryStepProps {
  formData: UserMedicalHistory;
  handleFieldChange: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string, checked: boolean) => void;
}

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  formData,
  handleFieldChange,
  handleMultiSelect,
}) => (
  <div className="space-y-8">
    <FormSection title="Allergies" subtitle="Select any known allergies">
      <MultiSelectGrid
        options={COMMON_ALLERGIES}
        selected={formData.allergies}
        onChange={(value, checked) =>
          handleMultiSelect("medicalHistory.allergies", value, checked)
        }
      />
    </FormSection>

    <FormSection
      title="Chronic Conditions"
      subtitle="Any conditions that affect your skin"
    >
      <MultiSelectGrid
        options={CHRONIC_CONDITIONS}
        selected={formData.chronicConditions}
        onChange={(value, checked) =>
          handleMultiSelect("medicalHistory.chronicConditions", value, checked)
        }
      />
    </FormSection>

    <FormSection
      title="Current Medications"
      subtitle="List any medications you're currently taking"
    >
      <CustomInputList
        values={formData.currentMedications}
        onChange={(values) =>
          handleFieldChange("medicalHistory.currentMedications", values)
        }
        placeholder="Enter medication name"
      />
    </FormSection>
  </div>
);
