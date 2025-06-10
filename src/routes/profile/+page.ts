import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { profileAPI } from '$lib/api/profile';
import { currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
	try {
		// Get the current user from the store
		const user = get(currentUser);

		if (!user) {
			return {
				profile: null,
				error: 'User not authenticated'
			};
		}

		// Check if we have profile data in localStorage
		let profileData = null;
		if (browser) {
			const storedProfileData = localStorage.getItem('profileData');
			if (storedProfileData) {
				try {
					profileData = JSON.parse(storedProfileData);
				} catch (error) {
					console.error('Error parsing stored profile data:', error);
				}
			}
		}

		// If we don't have profile data in localStorage, fetch it from the API
		if (!profileData) {
			try {
				const response = await profileAPI.getProfile(user.id);
				if (response.data) {
					profileData = response.data.profileData;

					// Store the profile data in localStorage
					if (browser && profileData) {
						localStorage.setItem('profileData', JSON.stringify(profileData));
					}
				}
			} catch (error) {
				console.error('Error fetching profile data:', error);
			}
		}

		// Return the user profile with the profile data
		return {
			profile: {
				...user,
				profileData
			}
		};
	} catch (error) {
		console.error('Error loading profile:', error);
		return {
			profile: null,
			error: 'Failed to load profile data'
		};
	}
};
