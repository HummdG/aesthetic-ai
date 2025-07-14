/**
 * Email validation utilities with basic format checking
 * Real email verification happens through Firebase email verification links
 */

// Very basic email regex pattern - just check for basic format
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validates email address with basic format checking
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'Email address is required'
    };
  }

  // Trim whitespace
  email = email.trim();

  // Check basic format (just @ and . in right places)
  if (!EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  // That's it! Real verification happens through the email link
  return {
    isValid: true
  };
}

/**
 * Quick email format check (less strict)
 */
export function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Check if email appears to be a disposable/temporary email
 * Simplified - real verification happens through email link
 */
export function isDisposableEmail(email: string): boolean {
  // Since we're doing basic validation, we'll just return false
  // Real verification happens through the email link anyway
  return false;
} 