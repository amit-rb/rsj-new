import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	phone?: string;
	joinDate?: string;
	coursesCompleted?: number;
	totalCourses?: number;
}

export const currentUser = writable<User | null>(null);
export const authLoading = writable(false);
export const isAuthenticated = writable(false);
export const authError = writable<string | null>(null);

// Initialize auth state from localStorage
if (browser) {
	const storedUser = localStorage.getItem('currentUser');
	const token = localStorage.getItem('authToken');

	if (storedUser && token) {
		try {
			const user = JSON.parse(storedUser);
			currentUser.set(user);
			isAuthenticated.set(true);
		} catch (error) {
			console.error('Error parsing stored user:', error);
			localStorage.removeItem('currentUser');
			localStorage.removeItem('authToken');
		}
	}
}

export function updateUser(user: User) {
	currentUser.set(user);
	isAuthenticated.set(true);
	if (browser) {
		localStorage.setItem('currentUser', JSON.stringify(user));
	}
}

export function logout() {
	currentUser.set(null);
	isAuthenticated.set(false);
	if (browser) {
		localStorage.removeItem('currentUser');
		localStorage.removeItem('profileData');
		localStorage.removeItem('authToken');
	}

	// Redirect to login page if in browser
	if (browser) {
		window.location.href = '/login';
	}
}

// Note: The actual login functionality is now handled by the authService
// This function is kept for backward compatibility but should be deprecated
export function login(email: string) {
	console.warn('This login function is deprecated. Use authService.requestOtp and authService.verifyOtp instead.');
	authLoading.set(true);
	authError.set(null);

	// This is just a placeholder that will be removed when all code is updated to use authService
	setTimeout(() => {
		authLoading.set(false);
		authError.set('This login method is deprecated. Please use the OTP-based authentication.');
	}, 500);
}
