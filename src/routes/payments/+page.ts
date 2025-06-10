import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { paymentService } from '$lib/api/paymentService';
import { currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
  try {
    // Get the current user from the store
    const user = get(currentUser);
    
    if (!user) {
      return {
        paymentHistory: null,
        error: 'User not authenticated'
      };
    }
    
    // Fetch payment history from the API
    const response = await paymentService.getPaymentHistory(user.id);
    
    if (response.data) {
      return {
        paymentHistory: response.data
      };
    } else {
      return {
        paymentHistory: null,
        error: response.message || 'Failed to load payment history'
      };
    }
  } catch (error) {
    console.error('Error loading payment history:', error);
    return {
      paymentHistory: null,
      error: 'Failed to load payment history'
    };
  }
};