"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/Button";

interface EmailVerificationRequiredProps {
  featureName?: string;
  onBack?: () => void;
}

const EmailVerificationRequired: React.FC<EmailVerificationRequiredProps> = ({
  featureName = "this feature",
  onBack,
}) => {
  const { user, sendVerificationEmail, checkEmailVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  React.useEffect(() => {
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-nude-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-brown-900 mb-2">
            Email Verification Required
          </h2>
          <p className="text-brown-600 font-body">
            Please verify your email address to access {featureName}
          </p>
        </div>

        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800 text-sm font-body">
            <strong>Why verify your email?</strong>
            <br />
            Email verification ensures you receive important updates about your
            skin analysis and helps keep your account secure.
          </p>
        </div>

        {user?.email && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Verification email sent to:</strong>
              <br />
              <span className="break-all">{user.email}</span>
            </p>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Verification email resent successfully! Check your inbox and spam
            folder.
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

        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-800 text-sm font-body">
            <strong>📧 Don't see the email?</strong>
            <br />• Check your <strong>spam/junk folder</strong>
            <br />• Check your <strong>promotions tab</strong> (Gmail)
            <br />
            • Add our sender to your contacts
            <br />• Wait 2-3 minutes for delivery
          </p>
        </div>

        {onBack && (
          <div className="text-center">
            <button
              onClick={onBack}
              className="text-primary hover:text-primary-600 font-medium text-sm"
            >
              ← Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationRequired;
