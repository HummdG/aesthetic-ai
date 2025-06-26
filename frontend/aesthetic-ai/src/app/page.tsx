"use client";

import { useState } from "react";
import { Button } from "./components/ui/Button";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera access granted");
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    // TODO: Implement VLM API call
    setTimeout(() => {
      setAnalysis({
        confidence: 87,
        recommendations: [
          {
            treatment: "Botulinum Toxin (Botox)",
            area: "Glabellar lines (frown lines)",
            severity: "Moderate",
            dosage: "20-25 units",
            estimatedCost: "$400-500",
          },
          {
            treatment: "Hyaluronic Acid Filler",
            area: "Nasolabial folds",
            severity: "Mild to moderate",
            volume: "0.5-1.0ml per side",
            estimatedCost: "$600-800",
          },
          {
            treatment: "Botulinum Toxin (Botox)",
            area: "Lateral canthal lines (crow's feet)",
            severity: "Mild",
            dosage: "12-16 units per side",
            estimatedCost: "$300-400",
          },
        ],
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-3">
              Aesthetic Treatment Analysis
            </h1>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto mb-6">
              AI-powered facial analysis for aesthetic treatment planning
            </p>

            {/* Medical Disclaimer */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 max-w-3xl mx-auto text-left">
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
                  <p className="text-sm text-amber-700">
                    <strong>Medical Disclaimer:</strong> This analysis is for
                    educational and consultation planning purposes only. Results
                    should be reviewed by a qualified medical professional. This
                    tool does not replace professional medical advice,
                    diagnosis, or treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  Patient Photo Upload
                </h2>

                {!previewUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="mb-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-gray-600">
                            Drop files here or{" "}
                          </span>
                          <span className="text-blue-600 hover:text-blue-500 font-medium">
                            browse
                          </span>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="sr-only"
                          />
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <label htmlFor="file-upload">
                          <Button
                            variant="primary"
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-0 px-6 py-2"
                          >
                            Choose File
                          </Button>
                        </label>

                        <Button
                          variant="outline"
                          onClick={handleCameraCapture}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                        >
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
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Camera
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Supports: JPG, PNG, HEIC up to 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Patient photo"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={analyzeImage}
                        loading={isAnalyzing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? "Analyzing..." : "Begin Analysis"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={resetAnalysis}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  Analysis Results
                </h2>

                {!analysis ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
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
                    <p className="text-gray-500">
                      Upload a photo to view analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Confidence Score */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Analysis Confidence
                        </span>
                        <span className="text-2xl font-semibold text-green-600">
                          {analysis.confidence}%
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analysis.confidence}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Treatment Recommendations */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Treatment Recommendations
                      </h3>

                      <div className="space-y-4">
                        {analysis.recommendations.map(
                          (rec: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-gray-900">
                                  {rec.treatment}
                                </h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {rec.severity}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Treatment Area:
                                  </span>
                                  <span>{rec.area}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Recommended Dosage:
                                  </span>
                                  <span>{rec.dosage || rec.volume}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Estimated Cost:
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {rec.estimatedCost}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Recommended Next Steps
                      </h4>
                      <p className="text-sm text-blue-800">
                        Schedule a consultation with a board-certified aesthetic
                        practitioner to discuss these recommendations and
                        develop a personalized treatment plan based on your
                        aesthetic goals.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
