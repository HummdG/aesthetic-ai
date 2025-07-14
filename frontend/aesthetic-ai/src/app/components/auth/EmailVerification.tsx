"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

interface EmailVerificationProps {
  userEmail?: string;
  onVerificationComplete?: () => void;
  onBack?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  userEmail,
  onVerificationComplete,
  onBack,
}) => {
  const { user, emailVerified, sendVerificationEmail, checkEmailVerification } =
    useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const [resendCooldown, setResendCooldown] = useState(0);

  // Check email verification status periodically
  useEffect(() => {
    if (!user) return;

    const checkInterval = setInterval(async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified && onVerificationComplete) {
        onVerificationComplete();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(checkInterval);
  }, [user, checkEmailVerification, onVerificationComplete]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      setResendCooldown(60); // 60 second cooldown
    } catch (error: any) {
      setResendError(error.message || "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  const displayEmail = userEmail || user?.email || "your email";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-nude-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-brown-600 font-body">
            We've sent a verification link to
          </p>
          <p className="text-brown-900 font-medium break-all">{displayEmail}</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm font-body">
            <strong>Please verify your email to continue.</strong>
            <br />
            Click the verification link in your email. We'll automatically
            detect when you've verified.
          </p>
        </div>

        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800 text-sm font-body">
            <strong>📧 Don't see the email?</strong>
            <br />• Check your <strong>spam/junk folder</strong>
            <br />• Check your <strong>promotions tab</strong> (Gmail)
            <br />
            • Add our sender to your contacts
            <br />• Wait 2-3 minutes for delivery
          </p>
        </div>

        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Verification email resent successfully! Check your inbox.
          </div>
        )}

        {resendError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {resendError}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            className="w-full"
          >
            {isResending
              ? "Resending..."
              : resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend verification email"}
          </Button>
        </div>

        {onBack && (
          <div className="text-center">
            <button
              onClick={onBack}
              className="text-primary hover:text-primary-600 font-medium text-sm"
            >
              ← Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
