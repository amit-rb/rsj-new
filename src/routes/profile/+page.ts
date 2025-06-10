import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		// In a real app, this would fetch from your API
		// For now, we'll return mock data or check localStorage
		const mockProfile = {
			id: '1',
			name: 'Sarah Johnson',
			email: 'sarah.johnson@email.com',
			avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
			phone: '+1 (555) 123-4567',
			joinDate: '2024-01-01',
			coursesCompleted: 1,
			totalCourses: 2,
			profileData: null // This would contain the detailed profile data
		};

		return {
			profile: mockProfile
		};
	} catch (error) {
		console.error('Error loading profile:', error);
		return {
			profile: null,
			error: 'Failed to load profile data'
		};
	}
};