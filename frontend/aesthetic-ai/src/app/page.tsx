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
    <div className="min-h-screen bg-nude-50">
      <main className="container mx-auto px-6 py-8">
        <Header />

        {/* Backend Status Indicator */}
        {/*<div className="max-w-7xl mx-auto mb-6">
          <div
            className={`border rounded-lg p-3 text-sm font-body ${
              backendStatus === "online"
                ? "bg-green-50 border-green-200 text-green-800"
                : backendStatus === "offline"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-nude-100 border-nude-200 text-brown-700"
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
                      : "bg-nude-400"
                  }`}
                ></div>
                <span>
                  Backend:{" "}
                  {backendStatus === "online"
                    ? "Connected"
                    : backendStatus === "offline"
                    ? "Disconnected"
                    : "Checking..."}
                </span>
              </div>
              {backendStatus === "offline" && (
                <button
                  onClick={handleRetryConnection}
                  className="text-red-700 hover:text-red-900 font-medium text-sm"
                >
                  Retry
                </button>
              )}
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-700">
                <p className="font-medium">Error: {error}</p>
              </div>
            )}
          </div>
        </div> */}

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-xl border border-nude-200 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-serif font-semibold text-brown-900 mb-2">
                  Image Analysis
                </h2>
                <p className="text-brown-700 font-body">
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
            <div className="bg-white rounded-xl border border-nude-200 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-serif font-semibold text-brown-900 mb-2">
                  Analysis Results
                </h2>
                <p className="text-brown-700 font-body">
                  AI-powered aesthetic recommendations
                </p>
              </div>
              <AnalysisResults analysis={analysis} />
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="max-w-7xl mx-auto mt-8">
            <details className="bg-white border border-nude-200 rounded-lg p-4">
              <summary className="cursor-pointer text-sm font-serif font-medium text-brown-900">
                Debug Information
              </summary>
              <div className="mt-3 text-xs font-body space-y-1 text-brown-700">
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
        )} */}
      </main>
    </div>
  );
}
