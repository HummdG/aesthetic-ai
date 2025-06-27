"use client";

import { AnalysisResult, TreatmentRecommendation } from "../types/analysis";

interface AnalysisResultsProps {
  analysis: AnalysisResult | null;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  if (!analysis) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-gray-400"
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
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Analysis Results
        </h3>
        <p className="text-gray-500">
          Upload an image to receive professional aesthetic analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <ConfidenceScore confidence={analysis.confidence} />

      {/* Treatment Recommendations */}
      <TreatmentRecommendations recommendations={analysis.recommendations} />

      {/* Cost Summary - NOW USES DYNAMIC TOTAL COST */}
      <CostSummary totalCost={analysis.totalCost} />
    </div>
  );
}

function ConfidenceScore({ confidence }: { confidence: number }) {
  return (
    <div className="professional-card p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Analysis Confidence
          </h4>
          <p className="text-sm text-gray-600">AI prediction accuracy</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-600">
            {confidence}%
          </div>
          <div className="text-sm text-gray-500">Confidence</div>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${confidence}%` }}
        ></div>
      </div>
    </div>
  );
}

function TreatmentRecommendations({
  recommendations,
}: {
  recommendations: TreatmentRecommendation[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Treatment Recommendations
      </h4>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="professional-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  {rec.treatment}
                </h5>
                <p className="text-gray-600 mb-2">{rec.area}</p>
              </div>
              <span
                className={`badge ${
                  rec.severity.toLowerCase() === "mild"
                    ? "badge-mild"
                    : rec.severity.toLowerCase() === "moderate"
                    ? "badge-moderate"
                    : "badge-high"
                }`}
              >
                {rec.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {rec.dosage && rec.dosage !== "N/A" && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1">Recommended Dosage</div>
                  <div className="font-medium text-gray-900">{rec.dosage}</div>
                </div>
              )}
              {rec.volume && rec.volume !== "N/A" && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1">Volume Required</div>
                  <div className="font-medium text-gray-900">{rec.volume}</div>
                </div>
              )}
              <div className="bg-indigo-50 rounded-lg p-3">
                <div className="text-gray-600 mb-1">Estimated Cost</div>
                <div className="font-semibold text-indigo-600">
                  {rec.estimatedCost}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FIXED: Now accepts totalCost as prop instead of hardcoded value
function CostSummary({ totalCost }: { totalCost: string }) {
  return (
    <div className="professional-card p-6 bg-indigo-50 border-indigo-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Total Investment
          </h4>
          <p className="text-sm text-gray-600">Complete treatment package</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-600">
            {totalCost} {/* ← NOW DYNAMIC! */}
          </div>
          <div className="text-sm text-gray-500">Estimated range</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-indigo-200">
        <div className="space-y-2 text-sm text-gray-600">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Costs vary by location and provider</span>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Results typically last 3-6 months</span>
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
            <span>Consultation recommended for personalized quotes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
