/**
 * Base API service for handling API requests
 */
import { browser } from '$app/environment';
import { config } from '$lib/config/env';

// Define common response interface
export interface ApiResponse<T = any> {
  status?: number;
  message?: string;
  data?: T;
}

// Define error interface
export interface ApiError {
  status: number;
  message: string;
}

/**
 * Base API service class
 */
export class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.apiUrl;
  }
  
  /**
   * Get the authorization header if a token exists
   */
  private getAuthHeader(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (browser) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }
  
  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    console.error('API Error:', error);
    
    const apiError: ApiError = {
      status: error.status || 500,
      message: error.message || 'Unknown error occurred'
    };
    
    throw apiError;
  }
  
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });
      
      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }
      
      return await response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }
      
      return await response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeader(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }
      
      return await response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });
      
      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }
      
      return await response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();