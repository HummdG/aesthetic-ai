"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";
import Image from "next/image";

const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSignIn = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#features" },
    { name: "Products", href: "#showcase" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4 bg-background/95 backdrop-blur-md border-b border-border/30">
        {/* Logo */}
        <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Aesthetic AI"
              width={32}
              height={32}
              className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl shadow-glow"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-playfair font-semibold text-base lg:text-xl text-foreground tracking-tight">
              Aesthetic AI
            </h1>
            <p className="text-xs text-warm-gray font-inter font-medium tracking-wide hidden lg:block">
              ADVANCED BEAUTY ANALYSIS
            </p>
          </div>
        </div>

        {/* Desktop Navigation - Force hide on mobile */}
        <div
          className="items-center space-x-12 font-inter"
          style={{
            display: "none",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons - Force hide on mobile */}
        <div
          className="items-center space-x-4"
          style={{
            display: "none",
          }}
        >
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-warm-gray font-inter hidden xl:block">
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

        {/* Mobile Hamburger Button - Always show for now */}
        <div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-warm-gray hover:text-foreground focus:outline-none focus:text-foreground transition-colors duration-200 p-2"
            aria-label="Toggle menu"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="relative z-40">
          <div className="px-4 sm:px-6 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border/30">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-warm-gray hover:text-foreground hover:bg-secondary/20 rounded-md transition-all duration-200 font-inter"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-border/30 space-y-2">
              {user ? (
                <div className="px-3 py-2">
                  <span className="text-warm-gray font-inter text-sm">
                    Welcome, {user.email}
                  </span>
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full mt-2 font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      handleSignIn();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start px-3 font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignUp();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start px-3 bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-primary text-primary-foreground font-inter"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
