import React, { useState } from "react";

// Helper Components
export const FormSection: React.FC<{
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

export const MultiSelectGrid: React.FC<{
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}> = ({ options, selected, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {options.map((option) => (
      <label
        key={option}
        className="flex items-center space-x-3 p-4 border border-nude-200 rounded-lg hover:border-primary transition-colors cursor-pointer select-none min-h-[60px] touch-manipulation group"
      >
        <input
          type="checkbox"
          checked={selected.includes(option)}
          onChange={(e) => onChange(option, e.target.checked)}
          className="text-primary focus:ring-primary rounded w-5 h-5 min-w-[20px] flex-shrink-0 select-none"
        />
        <span className="text-base sm:text-sm text-brown-900 font-body select-none leading-tight flex-1">
          {option}
        </span>
      </label>
    ))}
  </div>
);

export const CustomInputList: React.FC<{
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
          className="flex-1 px-4 py-4 border border-nude-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base select-none caret-transparent focus:caret-current"
          placeholder={placeholder}
          onKeyPress={(e) => e.key === "Enter" && addValue()}
        />
        <button
          onClick={addValue}
          disabled={!inputValue.trim()}
          className="px-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none min-h-[56px] touch-manipulation text-base"
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
