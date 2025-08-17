"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./auth/AuthModal";
import { Button } from "./ui/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "How It Works", href: "#" },
    { name: "Safety", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav className="sticky top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/30 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-nude-pink to-rose-nude rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-lg">
                  A
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-champagne rounded-full border-2 border-background"></div>
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-warm-gray hover:text-foreground transition-all duration-300 relative group font-inter"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-warm-gray font-inter">
                  Welcome, {user.email}
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  variant="ghost"
                  className="font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("signup");
                    setIsAuthModalOpen(true);
                  }}
                  className="font-inter bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-primary text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-300 px-6"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-warm-gray hover:text-foreground focus:outline-none focus:text-foreground transition-colors duration-200"
              aria-label="Toggle menu"
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
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/60 backdrop-blur-sm border border-border/20 rounded-lg mt-2">
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
                      onClick={logout}
                      variant="outline"
                      className="w-full mt-2 font-inter"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setAuthMode("login");
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start px-3 font-inter text-warm-gray hover:text-foreground"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setAuthMode("signup");
                        setIsAuthModalOpen(true);
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
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
}
