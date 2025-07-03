"use client";

import Image from "next/image";

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
        <div className="overflow-hidden rounded-xl border border-nude-200">
          <Image
            src={previewUrl}
            alt="Uploaded image for analysis"
            width={640}
            height={400}
            className="w-full h-80 sm:h-96 md:h-[32rem] lg:h-[36rem] object-cover"
          />
          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-serif font-semibold text-brown-900 mb-2">
                  Analyzing Image
                </h3>
                <p className="text-brown-700 font-body">
                  Processing facial features...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - FIXED VISIBILITY */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-body font-semibold transition-all duration-200 shadow-sm flex items-center justify-center"
        >
          {isAnalyzing && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          )}
          {isAnalyzing ? "Analyzing..." : "Start Analysis"}
        </button>

        <button
          onClick={onReset}
          className="sm:w-auto border-2 border-nude-300 hover:border-primary text-brown-700 hover:text-primary px-6 py-3 rounded-full font-body font-semibold transition-all duration-200"
        >
          New Image
        </button>
      </div>

      {/* Simple info */}
      {!isAnalyzing && (
        <div className="bg-nude-50 rounded-lg p-4 text-sm text-brown-600 font-body text-center">
          Click "Start Analysis" to begin AI-powered facial analysis
        </div>
      )}
    </div>
  );
}
