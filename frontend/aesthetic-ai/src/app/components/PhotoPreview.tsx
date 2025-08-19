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
        <div className="overflow-hidden rounded-xl border border-border shadow-luxury">
          <Image
            src={previewUrl}
            alt="Uploaded image for analysis"
            width={640}
            height={400}
            className="w-full h-80 sm:h-96 md:h-[32rem] lg:h-[36rem] object-cover"
          />
          {/* Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-playfair font-semibold text-foreground mb-2">
                  Analyzing Image
                </h3>
                <p className="text-warm-gray font-inter">
                  Processing facial features...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          loading={isAnalyzing}
          className="flex-1 bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground font-inter font-semibold shadow-luxury hover:shadow-glow transition-all duration-300"
        >
          {isAnalyzing ? "Analyzing..." : "Start Analysis"}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="sm:w-auto border-2 border-border hover:border-primary text-warm-gray hover:text-foreground font-inter font-semibold transition-all duration-300"
        >
          New Image
        </Button>
      </div>

      {/* Simple info */}
      {!isAnalyzing && (
        <div className="bg-gradient-to-r from-nude-pink/10 to-champagne/20 rounded-lg p-4 text-sm text-warm-gray font-inter text-center border border-primary/10">
          Click "Start Analysis" to begin AI-powered facial analysis
        </div>
      )}
    </div>
  );
}
