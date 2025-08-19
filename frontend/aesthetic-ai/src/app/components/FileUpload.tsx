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
    <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center bg-gradient-to-br from-nude-pink/5 to-champagne/10 hover:border-primary/50 transition-all duration-300 hover:shadow-luxury">
      {/* Upload Icon */}
      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-nude-pink/20 rounded-full flex items-center justify-center shadow-glow backdrop-blur-sm border border-primary/20">
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

      <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
        Upload Photo for Analysis
      </h3>

      <p className="text-warm-gray font-inter mb-6">
        Drop your image here or{" "}
        <span
          className="text-primary font-semibold cursor-pointer hover:text-primary/80 transition-colors"
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={handleChooseClick}
          className="flex-1 bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground font-inter font-semibold shadow-luxury hover:shadow-glow transition-all duration-300"
        >
          Choose File
        </Button>
        <Button
          onClick={onCameraClick}
          variant="outline"
          className="flex-1 border-2 border-primary/40 hover:border-primary hover:bg-primary/5 text-foreground font-inter font-semibold transition-all duration-300"
        >
          Use Camera
        </Button>
      </div>

      {/* File Info */}
      <div className="text-sm text-warm-gray font-inter">
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
