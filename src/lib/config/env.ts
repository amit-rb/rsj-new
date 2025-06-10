/**
 * Environment configuration for the application
 * This file provides environment-specific configuration values
 */

// Base API URL based on environment
const DEV_API_URL = 'http://localhost:3002';
const PROD_API_URL = 'https://gke-api.republicschoolofjournalism.com'; // Update with production URL when available

// Determine if we're in development or production
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Export configuration object
export const config = {
  apiUrl: isDevelopment ? DEV_API_URL : PROD_API_URL,
  environment: isDevelopment ? 'development' : 'production',
  
  // API endpoints
  endpoints: {
    // Auth endpoints
    auth: {
      requestOtp: '/api/auth/request-otp',
      verifyOtp: '/api/auth/verify-otp'
    },
    
    // User endpoints
    user: {
      getProfile: (userId: string) => `/api/users/get/${userId}`,
      updateProfile: (userId: string) => `/api/users/update/${userId}`
    },
    
    // Payment endpoints
    payment: {
      getHistory: (userId: string) => `/api/payment/get-payment-history/${userId}`
    }
  }
};