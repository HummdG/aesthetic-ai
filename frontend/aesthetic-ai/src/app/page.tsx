"use client";

import { useState } from "react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import AnalysisResults from "./components/AnalysisResults";
import { AnalysisResult } from "./types/analysis";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalysisStart = async (file: File) => {
    setIsAnalyzing(true);

    // TODO: Implement VLM API call
    // For now, simulate API call with timeout
    setTimeout(() => {
      setAnalysis({
        confidence: 89,
        recommendations: [
          {
            treatment: "Botulinum Toxin Injection",
            area: "Glabellar lines (frown lines)",
            severity: "Mild to Moderate",
            dosage: "20-25 units",
            estimatedCost: "$400-500",
          },
          {
            treatment: "Hyaluronic Acid Dermal Filler",
            area: "Nasolabial folds",
            severity: "Moderate",
            volume: "0.8-1.2ml",
            estimatedCost: "$650-850",
          },
          {
            treatment: "Periorbital Botulinum Toxin",
            area: "Lateral canthal lines (crow's feet)",
            severity: "Mild",
            dosage: "12-16 units per side",
            estimatedCost: "$350-450",
          },
        ],
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Header />

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

            {/* Results Section */}
            <div className="professional-card p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Analysis Results
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  AI-powered aesthetic recommendations
                </p>
              </div>
              <AnalysisResults analysis={analysis} />
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        {analysis && (
          <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
            <div className="professional-card p-4 sm:p-6 lg:p-8 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Next Steps
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                Schedule a consultation with a board-certified aesthetic
                professional to discuss these recommendations and develop a
                personalized treatment plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="btn-primary">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Find Providers
                </button>
                <button className="btn-secondary">
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-12 sm:mt-16">
          <div className="professional-card p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Aesthetic AI</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              AI-powered aesthetic analysis technology
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-indigo-600 transition-colors">
                About
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
