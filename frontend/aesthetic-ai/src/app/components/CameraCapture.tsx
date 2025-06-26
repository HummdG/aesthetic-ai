"use client";

import { useRef, useEffect } from "react";
import { Button } from "./ui/Button";

interface CameraCaptureProps {
  isActive: boolean;
  isLoading: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
  stream: MediaStream | null;
}

export default function CameraCapture({
  isActive,
  isLoading,
  onCapture,
  onCancel,
  stream,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (stream && videoRef.current && isActive) {
      const video = videoRef.current;

      // Clear any existing source first
      video.srcObject = null;

      // Set new stream
      video.srcObject = stream;

      const handleLoadedMetadata = async () => {
        if (!isMounted) return;

        try {
          await video.play();
          console.log("Video playing successfully");
        } catch (error) {
          console.log("Video play interrupted or failed:", error);
          // This is normal when switching between camera/file modes quickly
        }
      };

      const handleCanPlay = () => {
        if (!isMounted) return;
        console.log("Video can play");
      };

      const handleError = (e: Event) => {
        console.error("Video error:", e);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("error", handleError);

      return () => {
        isMounted = false;
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("error", handleError);

        // Properly cleanup video
        if (video.srcObject) {
          video.pause();
          video.srcObject = null;
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [stream, isActive]);

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video not ready for capture");
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the canvas horizontally to un-mirror the image
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // Convert canvas to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "aesthetic-ai-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="relative">
        {/* Clean Camera Frame with Face Guides */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-black">
          <video
            ref={videoRef}
            className="w-full h-64 sm:h-80 object-cover"
            autoPlay
            playsInline
            muted
            style={{
              transform: "scaleX(-1)", // Mirror effect for natural selfie experience
              minHeight: "256px",
            }}
          />

          {/* Face Overlay Guides */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner indicators */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/80 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/80 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/80 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/80 rounded-br-lg"></div>

            {/* Center face guide - oval for face shape */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-40 sm:w-40 sm:h-48 border-2 border-white/60 rounded-full"></div>
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full"></div>
            </div>

            {/* Instruction text overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white text-sm font-medium text-center">
                Position your face in the oval
              </p>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4 w-8 h-8 border-indigo-600"></div>
                <p className="text-lg font-medium text-gray-900">
                  Initializing camera...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Camera Guidelines:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Ensure good lighting</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Hold device steady</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Natural expression</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Face the camera directly</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleCapturePhoto}
          disabled={isLoading}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
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
            Capture Photo
          </span>
        </button>

        <button onClick={onCancel} className="btn-secondary sm:w-auto">
          <span className="flex items-center justify-center">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </span>
        </button>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
