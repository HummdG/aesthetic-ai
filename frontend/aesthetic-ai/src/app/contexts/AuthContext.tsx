"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  emailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  sendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setEmailVerified(user?.emailVerified || false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    if (!user) throw new Error("No user logged in");

    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      throw error;
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) throw new Error("No user logged in");

    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw error;
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      await reload(user);
      const isVerified = user.emailVerified;
      setEmailVerified(isVerified);
      return isVerified;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      await reload(user);
      setEmailVerified(user.emailVerified);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    emailVerified,
    login,
    signup,
    logout,
    updateUserProfile,
    getAuthToken,
    sendVerificationEmail,
    checkEmailVerification,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
