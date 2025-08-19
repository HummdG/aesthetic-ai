"use client";

import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  const handleStartAnalysis = () => {
    router.push("/analysis");
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cream to-nude-pink/20"></div>

      {/* Floating decoration elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-champagne/30 to-nude-pink/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-gradient-to-br from-soft-taupe/20 to-rose-nude/30 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        {/* Main content in asymmetrical layout */}
        <div className="grid lg:grid-cols-12 gap-16 items-center min-h-screen">
          {/* Left content - taking 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-gradient-to-r from-nude-pink/20 to-champagne/20 rounded-full text-sm font-inter font-medium text-warm-gray border border-primary/20">
                  ✨ Advanced AI Technology
                </span>
              </div>

              <h1 className="font-playfair text-6xl lg:text-8xl font-bold text-foreground leading-[0.9] tracking-tight">
                AI-Powered
                <span className="block text-transparent bg-gradient-to-r from-primary via-nude-pink to-rose-nude bg-clip-text">
                  Skin Analysis
                </span>
              </h1>

              <p className="font-inter text-xl lg:text-2xl text-warm-gray leading-relaxed max-w-xl">
                Discover your skin condition and unlock personalized ingredient
                recommendations powered by advanced artificial intelligence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={handleStartAnalysis}
                className="font-inter text-lg px-8 py-6 bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-500 group"
              >
                Start Your Analysis
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="font-inter text-lg px-8 py-6 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground"
              >
                Watch Demo
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-nude-pink rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-inter text-warm-gray">
                  Instant Results
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-nude-pink to-rose-nude rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary-foreground"
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
                <span className="font-inter text-warm-gray">Privacy First</span>
              </div>
            </div>
          </div>

          {/* Right visual element - taking 5 columns */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Main floating card */}
              <div className="relative z-20 bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-deep border border-primary/10">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-nude-pink rounded-2xl mx-auto flex items-center justify-center shadow-glow">
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
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                      AI Analysis Ready
                    </h3>
                    <p className="font-inter text-warm-gray">
                      Upload your photo to begin
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-inter text-warm-gray">
                        Skin Detection
                      </span>
                      <span className="font-inter font-medium text-primary">
                        98%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-nude-pink h-2 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-8 -right-8 z-10 bg-gradient-to-br from-champagne/80 to-nude-pink/60 backdrop-blur-sm rounded-2xl p-4 shadow-luxury">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    99.9%
                  </div>
                  <div className="text-xs text-warm-gray font-inter">
                    Accuracy
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 z-10 bg-gradient-to-br from-soft-taupe/80 to-rose-nude/60 backdrop-blur-sm rounded-2xl p-4 shadow-luxury">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    2.1M+
                  </div>
                  <div className="text-xs text-warm-gray font-inter">
                    Analyses
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
