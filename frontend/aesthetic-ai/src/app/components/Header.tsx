export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mb-12 px-6 text-center">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brown-900 mb-4">
        AI-Powered Skin Analysis
      </h1>
      <p className="text-lg text-brown-700 font-body mb-8">
        Discover your skin condition and get personalized ingredient
        recommendations powered by AI
      </p>

      {/* Simple features */}
      <div className="flex justify-center items-center gap-8 text-sm text-brown-600 font-body">
        <span>Skin Condition Detection</span>
        <span>Ingredient Recommendations</span>
        <span>Instant Analysis</span>
        <span>Privacy Focused</span>
      </div>
    </div>
  );
}
