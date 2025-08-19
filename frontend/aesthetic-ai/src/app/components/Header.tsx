export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mb-12 px-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-foreground mb-4">
        AI-Powered Skin Analysis
      </h1>
      <p className="text-lg text-warm-gray font-inter mb-8">
        Discover your skin condition and get personalized ingredient
        recommendations powered by AI
      </p>

      {/* Simple features */}
      <div className="flex justify-center items-center gap-8 text-sm text-warm-gray font-inter">
        <span>Skin Condition Detection</span>
        <span>Ingredient Recommendations</span>
        <span>Instant Analysis</span>
        <span>Privacy Focused</span>
      </div>
    </div>
  );
}
