/**
 * Authentication service for handling user authentication
 */
import { apiService, type ApiResponse } from './apiService';
import { config } from '$lib/config/env';
import { browser } from '$app/environment';
import { currentUser, isAuthenticated, updateUser, logout } from '$lib/stores/auth';

// Define interfaces
export interface OtpRequest {
  email: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profileData?: any;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication service
 */
export const authService = {
  /**
   * Request OTP for login
   */
  async requestOtp(email: string): Promise<ApiResponse<boolean>> {
    return apiService.post<boolean>(config.endpoints.auth.requestOtp, { email });
  },
  
  /**
   * Verify OTP and login
   */
  async verifyOtp(email: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>(config.endpoints.auth.verifyOtp, { email, otp });
    
    if (response.data && response.data.access_token) {
      // Store the token
      if (browser) {
        localStorage.setItem('authToken', response.data.access_token);
      }
      
      // Update auth state
      const userData = {
        id: response.data.user._id,
        name: `${response.data.user.email.split('@')[0]}`, // Temporary name until profile is loaded
        email: response.data.user.email,
      };
      
      updateUser(userData);
      
      // Fetch full user profile
      this.fetchUserProfile(response.data.user._id);
    }
    
    return response;
  },
  
  /**
   * Fetch user profile data
   */
  async fetchUserProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiService.get<User>(config.endpoints.user.getProfile(userId));
      
      if (response.data) {
        // Update user data with full profile
        const userData = {
          id: response.data._id,
          name: response.data.firstName && response.data.lastName 
            ? `${response.data.firstName} ${response.data.lastName}`
            : response.data.email.split('@')[0],
          email: response.data.email,
          avatar: response.data.profileData?.personal?.profilePhoto,
          phone: response.data.profileData?.personal?.phone,
        };
        
        updateUser(userData);
        
        // Store profile data
        if (browser && response.data.profileData) {
          localStorage.setItem('profileData', JSON.stringify(response.data.profileData));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { status: 500, message: 'Failed to fetch user profile', data: null };
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!browser) return false;
    
    const token = localStorage.getItem('authToken');
    return !!token;
  },
  
  /**
   * Logout user
   */
  logout(): void {
    if (browser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('profileData');
    }
    
    logout();
  }
};