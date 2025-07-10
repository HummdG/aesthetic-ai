"use client";

import React, { useState, useEffect } from "react";
import UserSurveyForm from "./components/UserSurveyForm";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import SkinAnalysisResults from "./components/SkinAnalysisResults";
import { SkinAnalysisResult } from "./types/skinAnalysis";
import { UserSurveyData } from "./types/userSurvey";
import { useUserSurvey } from "./hooks/useUserSurvey";
import { analyzeSkinWithSurvey } from "./utils/analysisHelper";

// Application states
type AppState = "survey" | "upload" | "analysis" | "results";

const HomePage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("survey");
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentUser, saveUser, loadUser, checkUserExists } = useUserSurvey();

  // Handle survey completion
  const handleSurveyComplete = async (userData: UserSurveyData) => {
    try {
      await saveUser(userData);
      setAppState("upload");
    } catch (err) {
      setError("Failed to save survey data");
    }
  };

  // Handle survey skip
  const handleSurveySkip = () => {
    setAppState("upload");
  };

  // Handle analysis start
  const handleAnalysisStart = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setAppState("analysis");

    try {
      // Use the enhanced analysis function that includes survey data
      const result = await analyzeSkinWithSurvey(file, currentUser);
      setAnalysis(result);
      setAppState("results");
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
      setAppState("upload");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle reset - go back to upload
  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setAppState("upload");
  };

  // Handle new analysis - go back to survey
  const handleNewAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setAppState("survey");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 to-nude-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Survey State */}
        {appState === "survey" && (
          <UserSurveyForm
            onComplete={handleSurveyComplete}
            onSkip={handleSurveySkip}
          />
        )}

        {/* Upload/Analysis/Results States */}
        {appState !== "survey" && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* User Info Banner */}
            {currentUser && (
              <div className="bg-white rounded-xl border border-nude-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-brown-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-brown-900 select-none">
                        Welcome back, {currentUser.username}!
                      </h3>
                      <p className="text-brown-600 font-body text-sm">
                        Your personalized analysis will include your survey
                        responses
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNewAnalysis}
                    className="text-sm text-primary hover:text-primary-hover font-semibold transition-colors cursor-pointer select-none"
                  >
                    Update Survey
                  </button>
                </div>
              </div>
            )}

            {/* Upload Section */}
            {(appState === "upload" || appState === "analysis") && (
              <div className="bg-white rounded-xl border border-nude-200 p-8 shadow-sm">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
                    {currentUser ? "Personalized " : ""}Skin Condition Analysis
                  </h2>
                  <p className="text-brown-700 font-body">
                    {currentUser
                      ? "Upload a clear facial image for AI-powered analysis based on your profile"
                      : "Upload a clear facial image for AI-powered skin analysis and ingredient recommendations"}
                  </p>
                </div>

                <UploadSection
                  onAnalysisStart={handleAnalysisStart}
                  isAnalyzing={isAnalyzing}
                  onReset={handleReset}
                />

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-nude-50 to-cream-50 rounded-xl border border-nude-200">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg font-serif font-semibold text-brown-900">
                        Analyzing Your Skin
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-brown-700 font-body mb-2">
                        {currentUser
                          ? "Processing your image with personalized analysis..."
                          : "Processing your image with AI skin analysis..."}
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-brown-600">
                        <span>✓ Image uploaded</span>
                        <span>✓ AI analysis in progress</span>
                        <span className="opacity-50">
                          • Generating recommendations
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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
            )}

            {/* Results Section */}
            {appState === "results" && analysis && (
              <div className="bg-white rounded-xl border border-nude-200 p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
                      {currentUser ? "Your Personalized " : ""}Skin Analysis
                      Results
                    </h2>
                    <p className="text-brown-700 font-body">
                      {currentUser
                        ? "AI-powered analysis customized based on your profile and medical history"
                        : "AI-powered skin condition assessment and ingredient recommendations"}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 border border-nude-300 text-brown-700 rounded-lg hover:border-primary hover:text-primary transition-all duration-200 cursor-pointer select-none"
                    >
                      New Photo
                    </button>
                    <button
                      onClick={handleNewAnalysis}
                      className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer select-none"
                    >
                      New Analysis
                    </button>
                  </div>
                </div>

                {/* Enhanced Safety Notice for Personalized Analysis */}
                {currentUser && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Personalized Analysis
                        </h3>
                        <p className="mt-1 text-sm text-amber-700">
                          These recommendations consider your medical history,
                          allergies, and skin type. Always consult with a
                          healthcare provider before starting new treatments.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <SkinAnalysisResults
                  analysis={analysis}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
