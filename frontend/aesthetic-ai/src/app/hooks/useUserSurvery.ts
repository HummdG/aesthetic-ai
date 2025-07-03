// src/app/hooks/useUserSurvey.ts
import { useState, useCallback } from 'react';
import { UserSurveyData } from '../types/userSurvey';
import { UserStorageService } from '../utils/userStorage';
import { AnalysisHelper } from '../utils/analysisHelper'

export const useUserSurvey = () => {
  const [currentUser, setCurrentUser] = useState<UserSurveyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = UserStorageService.loadUserData(username);
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = useCallback(async (userData: UserSurveyData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      UserStorageService.saveUserData(userData);
      setCurrentUser(userData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user data');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkUserExists = useCallback((username: string) => {
    return UserStorageService.userExists(username);
  }, []);

  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null);
    setError(null);
  }, []);

  const getAllUsers = useCallback(() => {
    return UserStorageService.getAllUsers();
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    loadUser,
    saveUser,
    checkUserExists,
    clearCurrentUser,
    getAllUsers
  };
};

// Updated API call function to include survey data
export const analyzeSkinWithSurvey = async (
  file: File, 
  userData: UserSurveyData | null = null
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Include survey data as context
  if (userData) {
    const context = AnalysisHelper.createAnalysisContext(userData);
    const warnings = AnalysisHelper.generateSafetyWarnings(userData);
    const ageRecommendations = AnalysisHelper.getAgeRecommendations(userData.basicInfo.age);
    
    formData.append('userContext', context);
    formData.append('safetyWarnings', JSON.stringify(warnings));
    formData.append('ageRecommendations', JSON.stringify(ageRecommendations));
    formData.append('username', userData.username);
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const response = await fetch(`${apiUrl}/analyze/skin`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}: Analysis failed`);
  }
  
  return await response.json();
};