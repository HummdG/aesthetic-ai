"use client";

import Navigation from "./components/landing/Navigation";
import HeroSection from "./components/landing/HeroSection";
import ProductShowcase from "./components/landing/ProductShowcase";
import CTASection from "./components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navigation />
      <section id="home">
        <HeroSection />
      </section>
      <section id="showcase">
        <ProductShowcase />
      </section>
      <section id="features">
        {/* Features section can be added here later */}
      </section>
      <section id="contact">
        <CTASection />
      </section>
    </div>
  );
};

export default Index;
