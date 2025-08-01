// src/app/utils/userStorage.ts
import { UserSurveyData } from '../types/userSurvey';

export class UserStorageService {
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

  // Clear all user data
  static clearAllData(): void {
    try {
      const users = this.getAllUsers();
      users.forEach(username => {
        const key = `${this.STORAGE_PREFIX}${username}`;
        localStorage.removeItem(key);
      });
      localStorage.removeItem(this.USERS_LIST_KEY);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  // Export user data for backup
  static exportUserData(username: string): string | null {
    const userData = this.loadUserData(username);
    if (userData) {
      return JSON.stringify(userData, null, 2);
    }
    return null;
  }

  // Import user data from backup
  static importUserData(jsonData: string): boolean {
    try {
      const userData = JSON.parse(jsonData) as UserSurveyData;
      this.saveUserData(userData);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}



