"use client";

import {
  SkinAnalysisResult,
  IngredientRecommendation,
} from "../types/skinAnalysis";

interface SkinAnalysisResultsProps {
  analysis: SkinAnalysisResult | null;
  isAnalyzing?: boolean;
}

export default function SkinAnalysisResults({
  analysis,
  isAnalyzing,
}: SkinAnalysisResultsProps) {
  // Loading state
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <AnalyzingState />
      </div>
    );
  }

  // No analysis yet
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Skin Analysis Results
        </h3>
        <p className="text-gray-500">
          Upload an image to receive personalized skin analysis and ingredient
          recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Confidence Score & Primary Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfidenceScore confidence={analysis.confidence} />
        <PrimaryCondition
          condition={analysis.primaryCondition}
          skinType={analysis.skinType}
        />
      </div>

      {/* Secondary Conditions */}
      {analysis.secondaryConditions.length > 0 && (
        <SecondaryConditions conditions={analysis.secondaryConditions} />
      )}

      {/* Description */}
      <AnalysisDescription description={analysis.description} />

      {/* Ingredient Recommendations */}
      <IngredientRecommendations
        recommendations={analysis.ingredientRecommendations}
      />
    </div>
  );
}

function AnalyzingState() {
  return (
    <div className="space-y-6">
      {/* Loading animation */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <h3 className="text-lg font-medium text-brown-900 mb-2">
          Analyzing Your Skin
        </h3>
        <p className="text-brown-600">
          Our AI is examining your image for skin conditions and preparing
          personalized recommendations...
        </p>
      </div>

      {/* Loading skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg h-24 animate-pulse"></div>
          <div className="bg-gray-100 rounded-lg h-24 animate-pulse"></div>
        </div>
        <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
        <div className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
      </div>
    </div>
  );
}

function ConfidenceScore({ confidence }: { confidence: number }) {
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  return (
    <div className={`border rounded-lg p-6 ${getConfidenceColor(confidence)}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-semibold">Analysis Confidence</h4>
          <p className="text-sm opacity-80">AI prediction accuracy</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{confidence}%</div>
          <div className="text-sm opacity-80">Confidence</div>
        </div>
      </div>

      <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
        <div
          className="bg-current h-2 rounded-full transition-all duration-300"
          style={{ width: `${confidence}%` }}
        ></div>
      </div>
    </div>
  );
}

function PrimaryCondition({
  condition,
  skinType,
}: {
  condition: string;
  skinType: string;
}) {
  return (
    <div className="border border-primary-200 bg-primary-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-brown-900 mb-4">
        Skin Condition
      </h4>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-brown-600 font-medium">
            Primary Condition
          </p>
          <p className="text-lg font-semibold text-primary">{condition}</p>
        </div>
        <div>
          <p className="text-sm text-brown-600 font-medium">Skin Type</p>
          <p className="text-base text-brown-800">{skinType}</p>
        </div>
      </div>
    </div>
  );
}

function SecondaryConditions({ conditions }: { conditions: string[] }) {
  return (
    <div className="border border-nude-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-brown-900 mb-4">
        Additional Concerns
      </h4>
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition, index) => (
          <span
            key={index}
            className="inline-block bg-nude-100 text-brown-800 text-sm px-3 py-1 rounded-full"
          >
            {condition}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnalysisDescription({ description }: { description: string }) {
  return (
    <div className="border border-nude-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-brown-900 mb-4">
        Analysis Summary
      </h4>
      <p className="text-brown-700 leading-relaxed">{description}</p>
    </div>
  );
}

function IngredientRecommendations({
  recommendations,
}: {
  recommendations: IngredientRecommendation[];
}) {
  return (
    <div className="border border-nude-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-brown-900 mb-6">
        Recommended Ingredients
      </h4>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec, index) => (
          <IngredientCard key={index} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}

function IngredientCard({
  recommendation,
}: {
  recommendation: IngredientRecommendation;
}) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-nude-50 border border-primary-100 rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h5 className="text-xl font-bold text-primary">
              {recommendation.ingredient}
            </h5>
            {recommendation.concentration && (
              <span className="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full">
                {recommendation.concentration}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-brown-700 mb-1">Purpose</p>
              <p className="text-brown-800">{recommendation.purpose}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-brown-700 mb-1">
                Key Benefits
              </p>
              <p className="text-brown-800">{recommendation.benefits}</p>
            </div>
          </div>
        </div>

        <div className="md:w-64 bg-white rounded-lg p-4 border">
          <p className="text-sm font-medium text-brown-700 mb-2">How to Use</p>
          <p className="text-sm text-brown-800 leading-relaxed">
            {recommendation.application}
          </p>
        </div>
      </div>
    </div>
  );
}
