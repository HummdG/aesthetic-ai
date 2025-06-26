"use client";

import Image from "next/image";
import { Button } from "./ui/Button";

interface PhotoPreviewProps {
  previewUrl: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function PhotoPreview({
  previewUrl,
  isAnalyzing,
  onAnalyze,
  onReset,
}: PhotoPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Photo Display */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={previewUrl}
            alt="Uploaded image for analysis"
            width={640}
            height={400}
            className="w-full h-64 sm:h-80 object-cover"
          />
          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="loading-spinner mx-auto mb-4 w-8 h-8 border-indigo-600"></div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Analyzing Image
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Processing facial features...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              Analyzing...
            </span>
          ) : (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Start Analysis
            </span>
          )}
        </button>

        <button onClick={onReset} className="btn-secondary">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            New Image
          </span>
        </button>
      </div>

      {/* Analysis Information */}
      {!isAnalyzing && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Analysis Process:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
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
              <span>Facial structure analysis</span>
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
              <span>Symmetry evaluation</span>
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
              <span>Proportion assessment</span>
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
              <span>Treatment recommendations</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Analysis typically takes 15-30 seconds • Results are for
            consultation purposes only
          </div>
        </div>
      )}
    </div>
  );
}
