"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import UserSurveyForm from "../components/UserSurveyForm";
import Header from "../components/Header";
import UploadSection from "../components/UploadSection";
import SkinAnalysisResults from "../components/SkinAnalysisResults";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/Button";
import AuthModal from "../components/auth/AuthModal";
import { SkinAnalysisResult } from "../types/skinAnalysis";
import { UserSurveyData } from "../types/userSurvey";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { analyzeSkinWithSurvey } from "../utils/analysisHelper";
import { useEmailVerificationGuard } from "../hooks/useEmailVerificationGuard";

// Application states
type AppState = "survey" | "upload" | "analysis" | "results";

const AnalysisPage: React.FC = () => {
  const searchParams = useSearchParams();
  const isFreeMode = searchParams.get("mode") === "free";

  const [appState, setAppState] = useState<AppState>(
    isFreeMode ? "upload" : "survey"
  );
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSurvey, setCurrentSurvey] = useState<UserSurveyData | null>(
    null
  );
  const [showSignupPromotion, setShowSignupPromotion] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const { user, getAuthToken } = useAuth();
  const { canAccess, requiresVerification } = useEmailVerificationGuard();

  // Reset app state when user logs out
  useEffect(() => {
    if (!user && appState !== "survey" && !isFreeMode) {
      setAppState("survey");
      setCurrentSurvey(null);
      setAnalysis(null);
      setError(null);
    }
  }, [user, appState, isFreeMode]);

  // Define currentUser as the survey data when available
  const currentUser = currentSurvey;

  // Handle survey completion
  const handleSurveyComplete = async (userData: UserSurveyData) => {
    try {
      setCurrentSurvey(userData);
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
      // Get auth token if user is authenticated and verified
      const token = user && canAccess ? await getAuthToken() : undefined;

      // Use the enhanced analysis function that includes survey data
      const result = await analyzeSkinWithSurvey(
        file,
        currentSurvey || undefined,
        token || undefined
      );
      setAnalysis(result);
      setAppState("results");

      // Show signup promotion for free users after analysis
      if (isFreeMode && !user) {
        setShowSignupPromotion(true);
      }
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
    setShowSignupPromotion(false);
  };

  // Handle new analysis - go back to survey
  const handleNewAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setAppState(isFreeMode ? "upload" : "survey");
    setShowSignupPromotion(false);
  };

  const handleSignupPromotion = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Free Mode Banner */}
        {isFreeMode && !user && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-nude-pink/10 to-champagne/20 border border-primary/20 rounded-xl p-6 text-center">
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                🎉 Free Analysis Mode
              </h3>
              <p className="text-warm-gray font-inter text-sm">
                You're using our free analysis tool. For personalized
                recommendations and detailed insights,
                <button
                  onClick={handleSignupPromotion}
                  className="text-primary hover:text-primary/80 font-semibold ml-1 underline"
                >
                  sign up for free
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Survey State */}
        {appState === "survey" && !isFreeMode && (
          <UserSurveyForm
            onComplete={handleSurveyComplete}
            onSkip={handleSurveySkip}
          />
        )}

        {/* Upload/Analysis/Results States */}
        {appState !== "survey" && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* User Info Banner */}
            {currentUser && !isFreeMode && (
              <div className="bg-card rounded-xl border border-border p-6 shadow-luxury">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-nude-pink rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary-foreground"
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
                      <h3 className="text-lg font-playfair font-semibold text-foreground select-none">
                        Welcome back, {currentUser.username}!
                      </h3>
                      <p className="text-warm-gray font-inter text-sm">
                        Your personalized analysis will include your survey
                        responses
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleNewAnalysis}
                    className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors cursor-pointer select-none"
                  >
                    Update Survey
                  </button>
                </div>
              </div>
            )}

            {/* Upload Section */}
            {(appState === "upload" || appState === "analysis") && (
              <div className="bg-card rounded-xl border border-border p-8 shadow-luxury">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-playfair font-semibold text-foreground mb-2">
                    {isFreeMode ? "Free " : currentUser ? "Personalized " : ""}
                    Skin Condition Analysis
                  </h2>
                  <p className="text-warm-gray font-inter">
                    {isFreeMode
                      ? "Upload a clear facial image for AI-powered basic skin analysis"
                      : currentUser
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
                  <div className="mt-8 p-6 bg-gradient-to-r from-nude-pink/10 to-champagne/10 rounded-xl border border-border">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg font-playfair font-semibold text-foreground">
                        Analyzing Your Skin
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-warm-gray font-inter mb-2">
                        {isFreeMode
                          ? "Processing your image with basic AI analysis..."
                          : currentUser
                          ? "Processing your image with personalized analysis..."
                          : "Processing your image with AI skin analysis..."}
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-warm-gray">
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
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-destructive"
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
                        <h3 className="text-sm font-medium text-destructive">
                          Analysis Error
                        </h3>
                        <p className="mt-1 text-sm text-destructive/80">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Section */}
            {appState === "results" && analysis && (
              <div className="bg-card rounded-xl border border-border p-8 shadow-luxury">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-playfair font-semibold text-foreground mb-2">
                      {isFreeMode
                        ? "Your Free "
                        : currentUser
                        ? "Your Personalized "
                        : ""}
                      Skin Analysis Results
                    </h2>
                    <p className="text-warm-gray font-inter">
                      {isFreeMode
                        ? "Basic AI-powered skin condition assessment"
                        : currentUser
                        ? "AI-powered analysis customized based on your profile and medical history"
                        : "AI-powered skin condition assessment and ingredient recommendations"}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 border border-border text-warm-gray rounded-lg hover:border-primary hover:text-foreground transition-all duration-200 cursor-pointer select-none"
                    >
                      New Photo
                    </button>
                    <button
                      onClick={handleNewAnalysis}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground rounded-lg font-semibold transition-all duration-200 cursor-pointer select-none"
                    >
                      New Analysis
                    </button>
                  </div>
                </div>

                {/* Signup Promotion for Free Users */}
                {showSignupPromotion && isFreeMode && !user && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-nude-pink/20 border border-primary/30 rounded-xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-nude-pink rounded-2xl mx-auto flex items-center justify-center shadow-glow mb-4">
                        <svg
                          className="w-8 h-8 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                        Unlock Your Full Personalized Plan
                      </h3>
                      <p className="text-warm-gray font-inter mb-4">
                        Get detailed ingredient recommendations, personalized
                        routines, and exclusive product suggestions based on
                        your skin analysis.
                      </p>
                      <Button
                        onClick={handleSignupPromotion}
                        className="bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-300"
                      >
                        Sign Up for Free - Get Full Analysis
                      </Button>
                    </div>
                  </div>
                )}

                {/* Enhanced Safety Notice for Personalized Analysis */}
                {currentUser && !isFreeMode && (
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default AnalysisPage;
