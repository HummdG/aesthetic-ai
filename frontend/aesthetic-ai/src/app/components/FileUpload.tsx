"use client";

import { useRef } from "react";
import { Button } from "./ui/Button";

interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraClick: () => void;
}

export default function FileUpload({
  onFileSelect,
  onCameraClick,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChooseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="upload-area">
      <div className="text-center">
        {/* Clean Upload Icon */}
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          Upload Photo for Analysis
        </h3>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="sr-only"
        />

        <div className="mb-4 sm:mb-6">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-sm sm:text-base text-gray-600">
              Drop your image here or{" "}
            </span>
            <span className="text-sm sm:text-base text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
              browse files
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4 sm:mb-6">
          {/* Choose File Button */}
          <Button
            onClick={handleChooseClick}
            className="btn-primary cursor-pointer w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Choose File
          </Button>

          {/* Use Camera Button */}
          <Button
            onClick={onCameraClick}
            className="btn-secondary w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Use Camera
          </Button>
        </div>

        {/* Professional Guidelines */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-left">
          <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
            Image Requirements:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <div className="flex items-start">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
              <span>Clear, well-lit photo</span>
            </div>
            <div className="flex items-start">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
              <span>Face forward-facing</span>
            </div>
            <div className="flex items-start">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
              <span>Natural expression</span>
            </div>
            <div className="flex items-start">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                />
              </svg>
              <span>Minimal makeup preferred</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Supports: JPG, PNG, HEIC up to 10MB • Secure processing, images
              deleted after analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
