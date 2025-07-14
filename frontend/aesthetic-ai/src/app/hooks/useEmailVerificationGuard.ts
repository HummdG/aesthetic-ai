import { useAuth } from "../contexts/AuthContext";

export interface EmailVerificationGuardResult {
  isEmailVerified: boolean;
  canAccess: boolean;
  user: any;
  requiresVerification: boolean;
}

/**
 * Hook to guard features that require email verification
 * Returns information about verification status and access permissions
 */
export function useEmailVerificationGuard(): EmailVerificationGuardResult {
  const { user, emailVerified, loading } = useAuth();

  const isLoggedIn = !!user && !loading;
  const requiresVerification = isLoggedIn && !emailVerified;
  const canAccess = isLoggedIn && emailVerified;

  return {
    isEmailVerified: emailVerified,
    canAccess,
    user,
    requiresVerification,
  };
}

/**
 * Hook specifically for checking if a user can access protected features
 * Returns a simplified boolean result
 */
export function useCanAccessProtectedFeatures(): boolean {
  const { canAccess } = useEmailVerificationGuard();
  return canAccess;
} 