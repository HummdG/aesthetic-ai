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
    <nav className="sticky top-0 w-full bg-white border-b border-nude-200 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Aesthetic AI"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <div className="ml-4">
              <span className="text-xl font-serif font-medium text-brown-900">
                Aesthetic AI
              </span>
              <span className="ml-3 text-sm font-body text-brown-600 italic">
                Advanced Beauty Analysis
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-brown-700 hover:text-primary font-body text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Authentication buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-brown-700 font-body text-sm">
                    Welcome, {user.displayName}
                  </span>
                  <Button onClick={() => logout()} variant="outline" size="sm">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brown-700 hover:text-primary"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-nude-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-2 text-brown-700 hover:text-primary font-body text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Authentication */}
            <div className="px-4 py-2 space-y-2">
              {user ? (
                <>
                  <p className="text-brown-700 font-body text-sm">
                    Welcome, {user.displayName || user.email}
                  </p>
                  <Button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    size="sm"
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
}
