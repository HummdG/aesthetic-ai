"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import CameraCapture from "./CameraCapture";
import PhotoPreview from "./PhotoPreview";
import { useCamera } from "../hooks/useCamera";

interface UploadSectionProps {
  onAnalysisStart: (file: File) => void;
  isAnalyzing: boolean;
  onReset: () => void;
}

export default function UploadSection({
  onAnalysisStart,
  isAnalyzing,
  onReset,
}: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { showCamera, cameraStream, cameraLoading, startCamera, stopCamera } =
    useCamera();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (showCamera) {
        stopCamera();
      }
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    stopCamera();
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalysisStart(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    stopCamera();
    onReset();
  };

  const handleCameraClick = () => {
    setPreviewUrl(null);
    startCamera();
  };

  return (
    <div>
      {showCamera ? (
        <CameraCapture
          isActive={showCamera}
          isLoading={cameraLoading}
          onCapture={handleCameraCapture}
          onCancel={stopCamera}
          stream={cameraStream}
        />
      ) : !previewUrl ? (
        <FileUpload
          onFileSelect={handleFileSelect}
          onCameraClick={handleCameraClick}
        />
      ) : (
        <PhotoPreview
          previewUrl={previewUrl}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
