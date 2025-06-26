"use client";

import { useState } from "react";

export interface UseCameraReturn {
  showCamera: boolean;
  cameraStream: MediaStream | null;
  cameraLoading: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      setCameraLoading(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log("Camera stream obtained:", stream);
      setCameraStream(stream);
      setShowCamera(true);
      
      // Small delay to ensure video element setup
      setTimeout(() => {
        setCameraLoading(false);
      }, 200);
      
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraLoading(false);
      alert("Camera access denied or not available. Please check your camera permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraLoading(false);
  };

  return {
    showCamera,
    cameraStream,
    cameraLoading,
    startCamera,
    stopCamera,
  };
}