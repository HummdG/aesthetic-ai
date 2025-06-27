// src/app/utils/api.ts
import { AnalysisResult } from "../types/analysis";

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  endpoints: {
    analyze: "/analyze",
    health: "/health",
  },
};

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl;
  }

  async analyzeImage(file: File): Promise<AnalysisResult> {
    console.log(`🚀 Making API call to: ${this.baseUrl}/analyze`);
    console.log(`📁 File details:`, {
      name: file.name,
      size: file.size,
      type: file.type
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result: AnalysisResult = await response.json();
      console.log(`✅ API Success:`, result);
      
      // Validate the response has all required fields
      if (!result.confidence || !result.recommendations || !result.totalCost) {
        console.warn('⚠️ Backend response missing expected fields:', result);
        throw new Error('Invalid response format from backend');
      }
      
      return result;

    } catch (error) {
      console.error(`❌ API Call Failed:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Connection error. Make sure backend is running on http://localhost:8000');
      }
      
      throw error;
    }
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create a default instance
export const apiClient = new ApiClient();

// Utility function for file validation
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPEG, PNG, or WebP)");
  }

  if (file.size > maxSize) {
    throw new Error("File size must be less than 10MB");
  }

  return true;
};