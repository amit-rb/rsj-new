export interface ProfileUpdateRequest {
	personal: {
		name: string;
		phone?: string;
		dateOfBirth?: string;
		gender?: string;
		nationality?: string;
		religion?: string;
		category?: string;
		maritalStatus?: string;
	};
	address?: any;
	education?: any;
	parentGuardian?: any;
	emergencyContact?: any;
	medical?: any;
	professional?: any;
	learning?: any;
	additional?: any;
	references?: any;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
}

export const profileAPI = {
	async updateProfile(data: ProfileUpdateRequest): Promise<ApiResponse<any>> {
		// Simulate API call
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					success: true,
					data: {
						...data.personal,
						id: '1',
						email: data.personal.name.toLowerCase().replace(' ', '.') + '@email.com',
						avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
						joinDate: '2024-01-01'
					},
					message: 'Profile updated successfully'
				});
			}, 1000);
		});
	},

	async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
		// Simulate API call
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					success: true,
					data: {
						avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
					},
					message: 'Avatar uploaded successfully'
				});
			}, 1500);
		});
	}
};