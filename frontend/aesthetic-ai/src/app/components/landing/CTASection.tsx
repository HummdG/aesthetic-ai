"use client";

import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

const CTASection = () => {
  const router = useRouter();

  const handleStartAnalysis = () => {
    router.push("/analysis");
  };

  return (
    <section className="relative py-32 px-8 overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-nude-pink/5 to-champagne/10"></div>

      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/20 to-nude-pink/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-soft-taupe/20 to-rose-nude/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Main CTA card with luxury design */}
        <div className="relative">
          {/* Glass morphism effect */}
          <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-deep border border-primary/20 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px)`,
                  backgroundSize: "24px 24px",
                }}
              ></div>
            </div>

            <div className="relative z-10 text-center">
              {/* Icon with glow effect */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary via-nude-pink to-rose-nude rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                    <svg
                      className="w-10 h-10 text-primary-foreground"
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

                  {/* Floating accent dots */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-champagne rounded-full border-2 border-background shadow-luxury"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-nude-pink rounded-full border-2 border-background"></div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-10 space-y-6">
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-primary/20 to-nude-pink/20 rounded-full text-sm font-inter font-medium text-warm-gray border border-primary/30 tracking-wide">
                    ✨ START YOUR JOURNEY
                  </span>
                </div>

                <h2 className="font-playfair text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Ready to
                  <span className="block text-transparent bg-gradient-to-r from-primary via-nude-pink to-rose-nude bg-clip-text">
                    begin?
                  </span>
                </h2>

                <p className="font-inter text-lg lg:text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
                  Start your personalized skin analysis journey and unlock
                  AI-powered recommendations tailored specifically for your
                  unique skin needs.
                </p>
              </div>

              {/* Action buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-inter text-lg px-10 py-6 border-2 border-primary/40 hover:border-primary hover:bg-primary/5 text-foreground backdrop-blur-sm group transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </Button>

                <Button
                  size="lg"
                  onClick={handleStartAnalysis}
                  className="font-inter text-lg px-10 py-6 bg-gradient-to-r from-primary via-nude-pink to-rose-nude hover:from-nude-pink hover:to-primary text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-500 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Analysis
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
                  </span>

                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-warm-gray font-inter">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No credit card required</span>
                </div>

                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>100% secure & private</span>
                </div>

                <div className="flex items-center space-x-2">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Trusted by 2M+ users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
