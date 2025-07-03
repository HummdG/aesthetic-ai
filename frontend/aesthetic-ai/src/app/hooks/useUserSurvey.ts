// src/app/hooks/useUserSurvey.ts
import { useState, useCallback } from 'react';
import { UserSurveyData } from '../types/userSurvey';

// User Storage Service (inline for now to avoid separate file)
class UserStorageService {
  private static readonly STORAGE_PREFIX = 'skinAnalysis_';
  private static readonly USERS_LIST_KEY = 'skinAnalysis_users';

  // Save user survey data
  static saveUserData(userData: UserSurveyData): void {
    try {
      const key = `${this.STORAGE_PREFIX}${userData.username}`;
      localStorage.setItem(key, JSON.stringify(userData));
      
      // Update users list
      this.updateUsersList(userData.username);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  // Load user survey data
  static loadUserData(username: string): UserSurveyData | null {
    try {
      const key = `${this.STORAGE_PREFIX}${username}`;
      const data = localStorage.getItem(key);
      
      if (data) {
        return JSON.parse(data) as UserSurveyData;
      }
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  // Check if user exists
  static userExists(username: string): boolean {
    const key = `${this.STORAGE_PREFIX}${username}`;
    return localStorage.getItem(key) !== null;
  }

  // Get all users
  static getAllUsers(): string[] {
    try {
      const users = localStorage.getItem(this.USERS_LIST_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users list:', error);
      return [];
    }
  }

  // Update users list
  private static updateUsersList(username: string): void {
    try {
      const users = this.getAllUsers();
      if (!users.includes(username)) {
        users.push(username);
        localStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating users list:', error);
    }
  }

  // Delete user data
  static deleteUserData(username: string): void {
    try {
      const key = `${this.STORAGE_PREFIX}${username}`;
      localStorage.removeItem(key);
      
      // Remove from users list
      const users = this.getAllUsers();
      const updatedUsers = users.filter(user => user !== username);
      localStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }
}

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