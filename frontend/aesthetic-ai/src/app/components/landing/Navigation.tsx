"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import Image from "next/image";

const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, logout } = useAuth();

  const handleSignIn = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Aesthetic AI"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl shadow-glow"
              priority
            />
          </div>
          <div>
            <h1 className="font-playfair font-semibold text-xl text-foreground tracking-tight">
              Aesthetic AI
            </h1>
            <p className="text-xs text-warm-gray font-inter font-medium tracking-wide">
              ADVANCED BEAUTY ANALYSIS
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-12 font-inter">
          <a
            href="#home"
            className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#features"
            className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#showcase"
            className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </a>
          <a
            href="#contact"
            className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-warm-gray font-inter hidden md:block">
                Welcome, {user.email}
              </span>
              <Button
                onClick={logout}
                variant="ghost"
                className="font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                onClick={handleSignIn}
                variant="ghost"
                className="font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
              >
                Login
              </Button>
              <Button
                onClick={handleSignUp}
                className="font-inter bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-primary text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-300 px-6"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navigation;
