"use client";

import { useRef } from "react";

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
    <div className="border-2 border-dashed border-nude-300 rounded-xl p-8 text-center bg-nude-50 hover:border-primary transition-colors">
      {/* Upload Icon */}
      <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
        <svg
          className="w-8 h-8 text-primary"
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
      </div>

      <h3 className="text-lg font-serif font-semibold text-brown-900 mb-2">
        Upload Photo for Analysis
      </h3>

      <p className="text-brown-600 font-body mb-6">
        Drop your image here or{" "}
        <span
          className="text-primary font-semibold cursor-pointer"
          onClick={handleChooseClick}
        >
          browse files
        </span>
      </p>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />

      {/* Action Buttons - FIXED HOVER CONTRAST */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleChooseClick}
          className="flex-1 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-body font-semibold transition-colors duration-200 shadow-sm cursor-pointer select-none"
        >
          Choose File
        </button>
        <button
          onClick={onCameraClick}
          className="flex-1 border-2 border-primary text-primary hover:bg-primary-hover hover:text-white hover:border-primary-hover px-6 py-3 rounded-full font-body font-semibold transition-all duration-200 cursor-pointer select-none"
        >
          Use Camera
        </button>
      </div>

      {/* File Info */}
      <div className="text-sm text-brown-500 font-body">
        <p>Supports JPG, PNG, WEBP files up to 10MB</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <span>High Resolution Preferred</span>
          <span>Clear Facial View</span>
          <span>Good Lighting</span>
        </div>
      </div>
    </div>
  );
}
