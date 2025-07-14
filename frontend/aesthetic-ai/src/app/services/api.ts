import { UserSurveyData } from '../types/userSurvey';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
      
      // Enhanced error logging for debugging
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        errorMessage,
        url: response.url,
        timestamp: new Date().toISOString()
      });
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  }

  // User profile endpoints
  async getUserProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async updateUserProfile(token: string, data: { display_name?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  // Survey endpoints
  async createSurvey(token: string, surveyData: UserSurveyData) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/surveys`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({
        survey_data: surveyData,
        version: '1.0',
      }),
    });
    
    return this.handleResponse(response);
  }

  async getUserSurveys(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/surveys`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async getLatestSurvey(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/surveys/latest`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async updateSurvey(token: string, surveyId: string, surveyData: UserSurveyData) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/surveys/${surveyId}`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify({
        survey_data: surveyData,
        version: '1.0',
      }),
    });
    
    return this.handleResponse(response);
  }

  // Analysis endpoints
  async analyzeSkin(file: File, token?: string, surveyData?: any) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (surveyData) {
      formData.append('userContext', surveyData.userContext || '');
      formData.append('safetyWarnings', JSON.stringify(surveyData.safetyWarnings || []));
      formData.append('ageRecommendations', JSON.stringify(surveyData.ageRecommendations || {}));
      formData.append('username', surveyData.username || '');
    }
    
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/skin`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return this.handleResponse(response);
  }

  async getAnalysisHistory(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/history`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async getAnalysisById(token: string, analysisId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/history/${analysisId}`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async getLatestAnalysis(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/latest`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  // User stats
  async getUserStats(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/stats`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 