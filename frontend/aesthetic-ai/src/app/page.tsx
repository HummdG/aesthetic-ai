"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import SkinAnalysisResults from "./components/SkinAnalysisResults";
import { SkinAnalysisResult } from "./types/skinAnalysis";

export default function HomePage() {
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle analysis start
  const handleAnalysisStart = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/analyze/skin`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP ${response.status}: Analysis failed`
        );
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Main Content - Single Column Layout */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Full Width Upload Section */}
          <div className="bg-white rounded-xl border border-nude-200 p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
                Skin Condition Analysis
              </h2>
              <p className="text-brown-700 font-body">
                Upload a clear facial image for AI-powered skin analysis and
                personalized ingredient recommendations
              </p>
            </div>

            {/* Full Width Upload Component */}
            <UploadSection
              onAnalysisStart={handleAnalysisStart}
              isAnalyzing={isAnalyzing}
              onReset={handleReset}
            />

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Skin Analysis Results - Only shown when analysis is available */}
          {(analysis || isAnalyzing) && (
            <div className="bg-white rounded-xl border border-nude-200 p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
                  Skin Analysis Results
                </h2>
                <p className="text-brown-700 font-body">
                  Personalized skin condition assessment and ingredient
                  recommendations
                </p>
              </div>

              <SkinAnalysisResults
                analysis={analysis}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl border border-nude-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <h3 className="font-serif font-semibold text-brown-900 mb-2">
                Accurate Analysis
              </h3>
              <p className="text-brown-600 text-sm">
                Advanced AI analyzes your skin for precise condition
                identification
              </p>
            </div>

            <div className="bg-white rounded-xl border border-nude-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-brown-900 mb-2">
                Instant Results
              </h3>
              <p className="text-brown-600 text-sm">
                Get immediate skin analysis and ingredient recommendations
              </p>
            </div>

            <div className="bg-white rounded-xl border border-nude-200 p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-serif font-semibold text-brown-900 mb-2">
                Privacy Focused
              </h3>
              <p className="text-brown-600 text-sm">
                Your images are processed securely and not stored
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
