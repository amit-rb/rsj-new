/**
 * Profile API service for handling user profile operations
 */
import { apiService, type ApiResponse } from './apiService';
import { config } from '$lib/config/env';
import { currentUser, updateUser } from '$lib/stores/auth';
import { browser } from '$app/environment';

export interface ProfileData {
  personal: {
    gender?: string;
    nationality?: string;
    religion?: string;
    category?: string;
    maritalStatus?: string;
    profilePhoto?: string;
  };
  address?: {
    currentCity?: string;
    currentState?: string;
    currentPincode?: string;
    permanentAddress?: string;
    permanentCity?: string;
    permanentState?: string;
    permanentPincode?: string;
    sameAsCurrent?: boolean;
  };
  education?: {
    tenthBoard?: string;
    tenthSchool?: string;
    tenthYear?: string;
    tenthPercentage?: string;
    twelfthBoard?: string;
    twelfthSchool?: string;
    twelfthYear?: string;
    twelfthPercentage?: string;
    graduationDegree?: string;
    graduationUniversity?: string;
    graduationYear?: string;
    graduationPercentage?: string;
    postGraduationDegree?: string;
    postGraduationUniversity?: string;
    postGraduationYear?: string;
    postGraduationPercentage?: string;
    lastQualificationYear?: string;
  };
  parentGuardian?: {
    name?: string;
    relationship?: string;
    contactNumber?: string;
    email?: string;
    occupation?: string;
    address?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
  };
  medical?: {
    bloodGroup?: string;
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
  };
  professional?: {
    currentEmployment?: string;
    designation?: string;
    organization?: string;
    workExperience?: string;
    previousEmployment?: string;
    skills?: string;
  };
  learning?: {
    courseInterests?: string;
    careerGoals?: string;
    technicalSkills?: string;
    preferredLearningStyle?: string;
    expectations?: string;
  };
  additional?: {
    languages?: string;
    hobbies?: string;
    achievements?: string;
    extracurricular?: string;
    socialMedia?: string;
  };
}

export interface ProfileUpdateRequest {
  profileData: ProfileData;
}

export interface UserProfile {
  _id: string;
  role: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileData?: ProfileData;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Profile API service
 */
export const profileAPI = {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return apiService.get<UserProfile>(config.endpoints.user.getProfile(userId));
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: ProfileUpdateRequest): Promise<ApiResponse<UserProfile>> {
    const response = await apiService.post<UserProfile>(config.endpoints.user.updateProfile(userId), data);

    if (response.data && $currentUser) {
      // Update user data with updated profile
      const userData = {
        ...$currentUser,
        avatar: response.data.profileData?.personal?.profilePhoto,
      };

      updateUser(userData);

      // Store updated profile data
      if (browser && response.data.profileData) {
        localStorage.setItem('profileData', JSON.stringify(response.data.profileData));
      }
    }

    return response;
  },

  /**
   * Upload avatar (this would need to be implemented based on the actual API)
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    // This is a placeholder for the actual implementation
    // You would need to implement file upload based on the actual API
    console.warn('Avatar upload not implemented with real API yet');

    // For now, return a mock response
    return {
      status: 200,
      message: 'Avatar upload not implemented with real API yet',
      data: {
        avatarUrl: URL.createObjectURL(file) // Create a temporary URL for preview
      }
    };
  }
};
