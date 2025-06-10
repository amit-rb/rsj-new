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

// Initialize auth state from localStorage
if (browser) {
	const storedUser = localStorage.getItem('currentUser');
	if (storedUser) {
		try {
			const user = JSON.parse(storedUser);
			currentUser.set(user);
			isAuthenticated.set(true);
		} catch (error) {
			console.error('Error parsing stored user:', error);
			localStorage.removeItem('currentUser');
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
	}
}

export function login(email: string) {
	authLoading.set(true);
	
	// Simulate API call
	setTimeout(() => {
		const mockUser: User = {
			id: '1',
			name: 'Sarah Johnson',
			email: email,
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
			phone: '+1 (555) 123-4567',
			joinDate: '2024-01-01',
			coursesCompleted: 1,
			totalCourses: 2
		};
		
		updateUser(mockUser);
		authLoading.set(false);
	}, 2000);
}