"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import AnalysisResults from "./components/AnalysisResults";
import { AnalysisResult } from "./types/analysis";
import { apiClient, validateImageFile } from "./utils/api";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  // Check backend status on load
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      await apiClient.healthCheck();
      setBackendStatus("online");
      console.log("✅ Backend is online");
    } catch (error) {
      setBackendStatus("offline");
      console.log("❌ Backend is offline:", error);
    }
  };

  const handleAnalysisStart = async (file: File) => {
    console.log("🎯 Starting analysis for file:", file.name);
    setIsAnalyzing(true);
    setError(null);

    try {
      // Validate the file first
      console.log("📋 Validating file...");
      validateImageFile(file);
      console.log("✅ File validation passed");

      // Check backend status first
      if (backendStatus === "offline") {
        console.log("🔄 Backend was offline, rechecking...");
        await checkBackendStatus();
      }

      // Call the API
      console.log("📡 Calling API...");
      const result = await apiClient.analyzeImage(file);
      console.log("✅ API call successful:", result);

      // The result now includes totalCost from backend calculation
      setAnalysis(result);
      setBackendStatus("online");
    } catch (err) {
      console.error("❌ Analysis error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze image";
      setError(errorMessage);

      // If it's a connection error, mark backend as offline
      if (
        errorMessage.includes("Connection error") ||
        errorMessage.includes("fetch")
      ) {
        setBackendStatus("offline");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  const handleRetryConnection = async () => {
    setError(null);
    await checkBackendStatus();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Header />

        {/* Backend Status Indicator */}
        <div className="max-w-7xl mx-auto mb-6">
          <div
            className={`border rounded-md p-3 text-sm ${
              backendStatus === "online"
                ? "bg-green-50 border-green-200 text-green-800"
                : backendStatus === "offline"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    backendStatus === "online"
                      ? "bg-green-500"
                      : backendStatus === "offline"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span>
                  Backend Status:{" "}
                  {backendStatus === "online"
                    ? "Connected"
                    : backendStatus === "offline"
                    ? "Disconnected"
                    : "Checking..."}
                </span>
                <span className="ml-2 text-xs opacity-75">
                  (http://localhost:8000)
                </span>
              </div>
              {backendStatus === "offline" && (
                <button
                  onClick={handleRetryConnection}
                  className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Analysis Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                    {error.includes("Connection error") && (
                      <div className="mt-2 text-xs">
                        <p>Troubleshooting steps:</p>
                        <ul className="list-disc list-inside ml-2">
                          <li>
                            Make sure backend is running:{" "}
                            <code>
                              cd backend && python -m uvicorn main:app --reload
                            </code>
                          </li>
                          <li>
                            Check if you can access:{" "}
                            <a
                              href="http://localhost:8000/health"
                              target="_blank"
                              className="underline"
                            >
                              http://localhost:8000/health
                            </a>
                          </li>
                          <li>Restart your browser if the issue persists</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Upload Section */}
            <div className="professional-card p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Image Analysis
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Upload a clear facial image for AI aesthetic analysis
                </p>
              </div>
              <UploadSection
                onAnalysisStart={handleAnalysisStart}
                isAnalyzing={isAnalyzing}
                onReset={handleReset}
              />
            </div>

            {/* Analysis Results */}
            <div className="professional-card p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Analysis Results
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  AI-powered aesthetic recommendations
                </p>
              </div>
              {/* AnalysisResults now receives the full result including totalCost */}
              <AnalysisResults analysis={analysis} />
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="max-w-7xl mx-auto mt-8">
            <details className="bg-gray-100 rounded p-4">
              <summary className="cursor-pointer text-sm font-medium">
                Debug Info
              </summary>
              <div className="mt-2 text-xs space-y-1">
                <p>
                  <strong>API URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
                </p>
                <p>
                  <strong>Backend Status:</strong> {backendStatus}
                </p>
                <p>
                  <strong>Error:</strong> {error || "None"}
                </p>
                <p>
                  <strong>Analysis:</strong> {analysis ? "Present" : "None"}
                </p>
                {analysis && (
                  <p>
                    <strong>Total Cost:</strong> {analysis.totalCost}
                  </p>
                )}
              </div>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}
