"use client";

import Navigation from "./components/landing/Navigation";
import HeroSection from "./components/landing/HeroSection";
import ProductShowcase from "./components/landing/ProductShowcase";
import CTASection from "./components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navigation />
      <HeroSection />
      <ProductShowcase />
      <CTASection />
    </div>
  );
};

export default Index;
