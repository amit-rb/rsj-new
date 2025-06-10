<script lang="ts">
	import type { PageData } from './$types';
	import { Edit, Mail, Phone, MapPin, Calendar, User, BookOpen, Heart, Globe, Award, FileText, Users, Briefcase, Save, X } from 'lucide-svelte';
	import { currentUser, updateUser, authLoading } from '$lib/stores/auth';
	import { profileAPI } from '$lib/api/profile';
	import type { ProfileUpdateRequest } from '$lib/api/profile';
	import { onMount } from 'svelte';

	export let data: PageData;

	let isEditing = false;
	let isSaving = false;
	let saveError = '';
	let saveSuccess = '';
	let activeSection = 'personal';

	// Initialize with data from load function
	$: if (data.profile && !isEditing) {
		initializeProfileData(data.profile);
	}

	$: loadError = data.error;
	
	let profileData = {
		personal: {
			name: $currentUser?.name || '',
			email: $currentUser?.email || '',
			phone: $currentUser?.phone || '',
			dateOfBirth: '',
			gender: '',
			nationality: '',
			religion: '',
			category: '',
			maritalStatus: ''
		},
		address: {
			currentAddress: '',
			currentCity: '',
			currentState: '',
			currentPincode: '',
			permanentAddress: '',
			permanentCity: '',
			permanentState: '',
			permanentPincode: '',
			sameAsCurrent: false
		},
		education: {
			lastQualificationDegree: '',
			lastQualificationInstitution: '',
			lastQualificationYear: '',
			graduationDegree: '',
			graduationUniversity: '',
			graduationYear: '',
			graduationPercentage: '',
			twelfthBoard: '',
			twelfthSchool: '',
			twelfthYear: '',
			twelfthPercentage: ''
		},
		parentGuardian: {
			name: '',
			relationship: '',
			contactNumber: '',
			email: '',
			occupation: '',
			address: ''
		},
		emergencyContact: {
			name: '',
			relationship: '',
			contactNumber: '',
			email: '',
			address: ''
		},
		medical: {
			bloodGroup: '',
			medicalConditions: '',
			allergies: '',
			medications: ''
		},
		professional: {
			currentEmployment: '',
			designation: '',
			organization: '',
			workExperience: '',
			skills: ''
		},
		learning: {
			courseInterests: '',
			careerGoals: '',
			technicalSkills: '',
			preferredLearningStyle: '',
			expectations: ''
		},
		additional: {
			languages: '',
			hobbies: '',
			achievements: '',
			extracurricular: ''
		},
		references: {
			academicRefName: '',
			academicRefDesignation: '',
			academicRefInstitution: '',
			academicRefContact: '',
			professionalRefName: '',
			professionalRefDesignation: '',
			professionalRefOrganization: '',
			professionalRefContact: ''
		}
	};

	function initializeProfileData(profile: any) {
		if (profile) {
			updateUser(profile);
			
			if (profile.profileData) {
				profileData = { ...profileData, ...profile.profileData };
			}
			
			profileData.personal.name = profile.name;
			profileData.personal.email = profile.email;
			profileData.personal.phone = profile.phone || '';
		}
	}

	async function saveProfileData() {
		isSaving = true;
		saveError = '';
		saveSuccess = '';
		
		try {
			const updateRequest: ProfileUpdateRequest = {
				personal: {
					name: profileData.personal.name,
					phone: profileData.personal.phone,
					dateOfBirth: profileData.personal.dateOfBirth,
					gender: profileData.personal.gender,
					nationality: profileData.personal.nationality,
					religion: profileData.personal.religion,
					category: profileData.personal.category,
					maritalStatus: profileData.personal.maritalStatus,
				},
				address: profileData.address,
				education: profileData.education,
				parentGuardian: profileData.parentGuardian,
				emergencyContact: profileData.emergencyContact,
				medical: profileData.medical,
				professional: profileData.professional,
				learning: profileData.learning,
				additional: profileData.additional,
				references: profileData.references
			};
			
			const response = await profileAPI.updateProfile(updateRequest);
			
			if (response.success && response.data) {
				updateUser(response.data);
				localStorage.setItem('profileData', JSON.stringify(profileData));
				saveSuccess = 'Profile updated successfully!';
				
				setTimeout(() => {
					saveSuccess = '';
				}, 3000);
			} else {
				saveError = response.message || 'Failed to update profile';
			}
		} catch (error: any) {
			console.error('Error saving profile:', error);
			saveError = error.message || 'Failed to update profile. Please try again.';
			localStorage.setItem('profileData', JSON.stringify(profileData));
		} finally {
			isSaving = false;
		}
	}

	async function toggleEdit() {
		if (isEditing) {
			await saveProfileData();
		}
		isEditing = !isEditing;
	}

	function cancelEdit() {
		isEditing = false;
		saveError = '';
		saveSuccess = '';
		if (data.profile) {
			initializeProfileData(data.profile);
		}
	}

	function loadSampleData() {
		profileData = {
			personal: {
				name: 'Sarah Johnson',
				email: 'sarah.johnson@email.com',
				phone: '+1 (555) 123-4567',
				dateOfBirth: '1995-08-15',
				gender: 'Female',
				nationality: 'American',
				religion: 'Christianity',
				category: 'General',
				maritalStatus: 'Single'
			},
			address: {
				currentAddress: '123 Main Street, Apt 4B',
				currentCity: 'New York',
				currentState: 'NY',
				currentPincode: '10001',
				permanentAddress: '456 Oak Avenue',
				permanentCity: 'Boston',
				permanentState: 'MA',
				permanentPincode: '02101',
				sameAsCurrent: false
			},
			education: {
				lastQualificationDegree: 'Master of Arts in Journalism',
				lastQualificationInstitution: 'New York University',
				lastQualificationYear: '2019',
				graduationDegree: 'Bachelor of Arts in English Literature',
				graduationUniversity: 'Columbia University',
				graduationYear: '2017',
				graduationPercentage: '3.8 GPA',
				twelfthBoard: 'CBSE',
				twelfthSchool: 'St. Mary\'s Senior Secondary School',
				twelfthYear: '2013',
				twelfthPercentage: '89%'
			},
			parentGuardian: {
				name: 'Robert Johnson',
				relationship: 'Father',
				contactNumber: '+1 (555) 987-6543',
				email: 'robert.johnson@email.com',
				occupation: 'Engineer',
				address: '456 Oak Avenue, Boston, MA 02101'
			},
			emergencyContact: {
				name: 'Emily Johnson',
				relationship: 'Sister',
				contactNumber: '+1 (555) 456-7890',
				email: 'emily.johnson@email.com',
				address: '789 Pine Street, Boston, MA 02102'
			},
			medical: {
				bloodGroup: 'O+',
				medicalConditions: 'None',
				allergies: 'Peanuts',
				medications: 'None'
			},
			professional: {
				currentEmployment: 'Freelance Writer',
				designation: 'Content Writer',
				organization: 'Self-employed',
				workExperience: '2 years',
				skills: 'Writing, Research, Interviewing, Social Media'
			},
			learning: {
				courseInterests: 'Digital Journalism, Investigative Reporting',
				careerGoals: 'To become a renowned investigative journalist',
				technicalSkills: 'Adobe Creative Suite, WordPress, Social Media Management',
				preferredLearningStyle: 'Visual and Hands-on',
				expectations: 'Gain practical experience and industry connections'
			},
			additional: {
				languages: 'English (Native), Spanish (Intermediate), French (Basic)',
				hobbies: 'Reading, Photography, Traveling, Blogging',
				achievements: 'Dean\'s List, University Scholarship Recipient',
				extracurricular: 'University Newspaper Editor, Debate Club President'
			},
			references: {
				academicRefName: 'Dr. Michael Chen',
				academicRefDesignation: 'Professor',
				academicRefInstitution: 'New York University',
				academicRefContact: 'michael.chen@nyu.edu',
				professionalRefName: 'Jane Smith',
				professionalRefDesignation: 'Editor-in-Chief',
				professionalRefOrganization: 'Local News Network',
				professionalRefContact: 'jane.smith@localnews.com'
			}
		};
		saveProfileData();
	}

	function calculateCompletion() {
		const requiredFields = [
			profileData.personal.name,
			profileData.personal.email,
			profileData.personal.phone,
			profileData.personal.dateOfBirth,
			profileData.personal.gender,
			profileData.address.currentAddress,
			profileData.address.currentCity,
			profileData.address.currentState,
			profileData.education.lastQualificationDegree,
			profileData.education.lastQualificationInstitution,
			profileData.education.lastQualificationYear,
			profileData.parentGuardian.name,
			profileData.parentGuardian.relationship,
			profileData.parentGuardian.contactNumber,
			profileData.emergencyContact.name,
			profileData.emergencyContact.relationship,
			profileData.emergencyContact.contactNumber,
			profileData.medical.bloodGroup,
			profileData.medical.medicalConditions
		];
		
		const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
		return Math.round((filledFields / requiredFields.length) * 100);
	}

	$: completionPercentage = calculateCompletion();
	
	onMount(() => {
		if (data.profile) {
			initializeProfileData(data.profile);
		}
	});

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	const profileSections = [
		{ id: 'personal', label: 'Personal Info', icon: User },
		{ id: 'address', label: 'Address', icon: MapPin },
		{ id: 'education', label: 'Education', icon: BookOpen },
		{ id: 'guardian', label: 'Guardian', icon: Users },
		{ id: 'emergency', label: 'Emergency', icon: Phone },
		{ id: 'medical', label: 'Medical', icon: Heart },
		{ id: 'professional', label: 'Professional', icon: Briefcase },
		{ id: 'learning', label: 'Learning', icon: Award },
		{ id: 'additional', label: 'Additional', icon: Globe },
		{ id: 'references', label: 'References', icon: FileText }
	];
</script>

<svelte:head>
	<title>Profile - Republic School of Journalism</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-lg">R</span>
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-900">Republic School</h1>
						<p class="text-sm text-gray-600">of Journalism</p>
					</div>
				</div>
				
				<nav class="hidden md:flex items-center space-x-8">
					<span class="text-purple-600 font-medium">Profile</span>
					<div class="flex items-center space-x-2">
						<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
							<span class="text-white text-xs font-bold">3</span>
						</div>
						<div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
							<span class="text-purple-600 text-sm font-bold">
								{getInitials($currentUser?.name || 'User')}
							</span>
						</div>
						<span class="text-sm font-medium text-gray-900">{$currentUser?.name || 'User'}</span>
					</div>
				</nav>
			</div>
		</div>
	</header>

	<!-- Sidebar -->
	<div class="flex">
		<aside class="w-64 bg-white shadow-sm min-h-screen">
			<div class="p-6">
				<div class="flex items-center space-x-3 mb-6">
					<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
						<span class="text-purple-600 text-lg font-bold">
							{getInitials($currentUser?.name || 'User')}
						</span>
					</div>
					<div>
						<h3 class="font-semibold text-gray-900">{$currentUser?.name || 'User'}</h3>
						<p class="text-sm text-gray-600">{$currentUser?.email || ''}</p>
						<div class="flex items-center space-x-2 text-xs text-gray-500 mt-1">
							<span>{$currentUser?.totalCourses || 2} courses</span>
							<span class="text-purple-600">{$currentUser?.coursesCompleted || 1} completed</span>
						</div>
					</div>
				</div>

				<nav class="space-y-1">
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg">
						<User class="w-5 h-5" />
						<span class="font-medium">Profile</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<BookOpen class="w-5 h-5" />
						<span>Courses</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<FileText class="w-5 h-5" />
						<span>Assignments</span>
					</a>
					<a href="#" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						<Award class="w-5 h-5" />
						<span>Grades</span>
					</a>
					
					<div class="pt-4 mt-4 border-t border-gray-200">
						<p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payments & Billing</p>
						<a href="/payments" class="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
							</svg>
							<span>Payment Overview</span>
						</a>
					</div>
				</nav>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 p-6">
			<!-- Success/Error Messages -->
			{#if saveSuccess}
				<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
					<svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<div>
						<p class="font-medium">Success</p>
						<p class="text-sm">{saveSuccess}</p>
					</div>
				</div>
			{/if}
			
			{#if saveError}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
					<svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<div>
						<p class="font-medium">Error</p>
						<p class="text-sm">{saveError}</p>
					</div>
				</div>
			{/if}

			<!-- Profile Header -->
			<div class="bg-white rounded-xl shadow-sm p-8 mb-6">
				<div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
					<div class="relative">
						<div class="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
							<span class="text-purple-600 text-4xl font-bold">
								{getInitials(profileData.personal.name || $currentUser?.name || 'User')}
							</span>
						</div>
						{#if isEditing}
							<div class="absolute bottom-2 right-2">
								<button class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200">
									<Edit class="w-4 h-4" />
								</button>
							</div>
						{/if}
					</div>
					
					<div class="flex-1">
						<h1 class="text-3xl font-bold text-gray-900 mb-2">
							{profileData.personal.name || $currentUser?.name || 'Complete Your Profile'}
						</h1>
						<p class="text-gray-600 mb-4">
							Student at Republic School of Journalism
						</p>
						
						<div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
							{#if profileData.personal.email}
								<div class="flex items-center space-x-1">
									<Mail class="w-4 h-4" />
									<span>{profileData.personal.email}</span>
								</div>
							{/if}
							{#if profileData.personal.phone}
								<div class="flex items-center space-x-1">
									<Phone class="w-4 h-4" />
									<span>{profileData.personal.phone}</span>
								</div>
							{/if}
							{#if $currentUser?.joinDate}
								<div class="flex items-center space-x-1">
									<Calendar class="w-4 h-4" />
									<span>Joined {new Date($currentUser.joinDate).toLocaleDateString()}</span>
								</div>
							{/if}
						</div>

						<!-- Profile Completion -->
						<div class="mb-4">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-gray-700">Profile Completion</span>
								<span class="text-sm font-bold text-purple-600">{completionPercentage}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-3">
								<div 
									class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
									style="width: {completionPercentage}%"
								></div>
							</div>
						</div>
					</div>
					
					<div class="flex flex-col space-y-2">
						{#if isEditing}
							<button 
								on:click={toggleEdit}
								disabled={isSaving || $authLoading}
								class="btn btn-primary disabled:opacity-50 flex items-center space-x-2"
							>
								{#if isSaving}
									<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Saving...</span>
								{:else}
									<Save class="w-4 h-4" />
									<span>Save Changes</span>
								{/if}
							</button>
							<button 
								on:click={cancelEdit}
								disabled={isSaving}
								class="btn btn-secondary flex items-center space-x-2"
							>
								<X class="w-4 h-4" />
								<span>Cancel</span>
							</button>
						{:else}
							<button 
								on:click={toggleEdit}
								disabled={$authLoading}
								class="btn btn-primary flex items-center space-x-2"
							>
								<Edit class="w-4 h-4" />
								<span>Edit Profile</span>
							</button>
						{/if}
						<button 
							on:click={loadSampleData}
							disabled={isSaving || $authLoading}
							class="btn btn-secondary text-sm"
						>
							Load Sample Data
						</button>
					</div>
				</div>
			</div>

			<!-- Profile Content -->
			{#if isEditing}
				<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<!-- Section Navigation -->
					<div class="lg:col-span-1">
						<div class="bg-white rounded-xl shadow-sm p-4 sticky top-6">
							<h3 class="font-semibold text-gray-900 mb-4">Profile Sections</h3>
							<nav class="space-y-1">
								{#each profileSections as section}
									<button
										class="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 {
											activeSection === section.id 
												? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600' 
												: 'text-gray-600 hover:bg-gray-100'
										}"
										on:click={() => activeSection = section.id}
									>
										<svelte:component this={section.icon} class="w-4 h-4" />
										<span class="text-sm font-medium">{section.label}</span>
									</button>
								{/each}
							</nav>
						</div>
					</div>

					<!-- Form Content -->
					<div class="lg:col-span-3">
						<div class="bg-white rounded-xl shadow-sm p-6">
							{#if activeSection === 'personal'}
								<h2 class="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
										<input
											type="text"
											bind:value={profileData.personal.name}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
											required
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
										<input
											type="tel"
											bind:value={profileData.personal.phone}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
										<input
											type="date"
											bind:value={profileData.personal.dateOfBirth}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
										<select
											bind:value={profileData.personal.gender}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
											<option value="Prefer not to say">Prefer not to say</option>
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
										<input
											type="text"
											bind:value={profileData.personal.nationality}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
										<input
											type="text"
											bind:value={profileData.personal.religion}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										/>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
										<select
											bind:value={profileData.personal.category}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										>
											<option value="">Select Category</option>
											<option value="General">General</option>
											<option value="OBC">OBC</option>
											<option value="SC">SC</option>
											<option value="ST">ST</option>
											<option value="EWS">EWS</option>
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
										<select
											bind:value={profileData.personal.maritalStatus}
											class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										>
											<option value="">Select Status</option>
											<option value="Single">Single</option>
											<option value="Married">Married</option>
											<option value="Divorced">Divorced</option>
											<option value="Widowed">Widowed</option>
										</select>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<!-- View Mode Layout -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Personal Information -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<div class="flex items-center space-x-2 mb-4">
							<User class="w-5 h-5 text-purple-600" />
							<h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
						</div>
						<div class="space-y-3">
							<div class="grid grid-cols-2 gap-4">
								<div>
									<span class="text-sm font-medium text-gray-600">Full Name:</span>
									<p class="text-gray-900">{profileData.personal.name || 'Not provided'}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-600">Date of Birth:</span>
									<p class="text-gray-900">{profileData.personal.dateOfBirth || 'Not provided'}</p>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<span class="text-sm font-medium text-gray-600">Gender:</span>
									<p class="text-gray-900">{profileData.personal.gender || 'Not provided'}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-600">Nationality:</span>
									<p class="text-gray-900">{profileData.personal.nationality || 'Not provided'}</p>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<span class="text-sm font-medium text-gray-600">Religion:</span>
									<p class="text-gray-900">{profileData.personal.religion || 'Not provided'}</p>
								</div>
								<div>
									<span class="text-sm font-medium text-gray-600">Category:</span>
									<p class="text-gray-900">{profileData.personal.category || 'Not provided'}</p>
								</div>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Marital Status:</span>
								<p class="text-gray-900">{profileData.personal.maritalStatus || 'Not provided'}</p>
							</div>
						</div>
					</div>

					<!-- Contact Information -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<div class="flex items-center space-x-2 mb-4">
							<Phone class="w-5 h-5 text-purple-600" />
							<h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
						</div>
						<div class="space-y-3">
							<div>
								<span class="text-sm font-medium text-gray-600">Email Address:</span>
								<p class="text-gray-900">{profileData.personal.email || 'Not provided'}</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Phone Number:</span>
								<p class="text-gray-900">{profileData.personal.phone || 'Not provided'}</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Current Address:</span>
								<p class="text-gray-900">
									{profileData.address.currentAddress ? 
										`${profileData.address.currentAddress}, ${profileData.address.currentCity}, ${profileData.address.currentState} - ${profileData.address.currentPincode}` : 
										'Not provided'
									}
								</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Permanent Address:</span>
								<p class="text-gray-900">
									{profileData.address.permanentAddress ? 
										`${profileData.address.permanentAddress}, ${profileData.address.permanentCity}, ${profileData.address.permanentState} - ${profileData.address.permanentPincode}` : 
										'Not provided'
									}
								</p>
							</div>
						</div>
					</div>

					<!-- Educational Background -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<div class="flex items-center space-x-2 mb-4">
							<BookOpen class="w-5 h-5 text-purple-600" />
							<h2 class="text-xl font-bold text-gray-900">Educational Background</h2>
						</div>
						<div class="space-y-4">
							<div>
								<h3 class="font-medium text-gray-900 mb-2">Last Qualification</h3>
								<div class="bg-gray-50 p-3 rounded-lg">
									<p class="text-sm"><span class="font-medium">Degree:</span> {profileData.education.lastQualificationDegree || 'Not provided'}</p>
									<p class="text-sm"><span class="font-medium">Institution:</span> {profileData.education.lastQualificationInstitution || 'Not provided'}</p>
									<p class="text-sm"><span class="font-medium">Year:</span> {profileData.education.lastQualificationYear || 'Not provided'}</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Medical Information -->
					<div class="bg-white rounded-xl shadow-sm p-6">
						<div class="flex items-center space-x-2 mb-4">
							<Heart class="w-5 h-5 text-purple-600" />
							<h2 class="text-xl font-bold text-gray-900">Medical Information</h2>
						</div>
						<div class="space-y-3">
							<div>
								<span class="text-sm font-medium text-gray-600">Blood Group:</span>
								<p class="text-gray-900">{profileData.medical.bloodGroup || 'Not provided'}</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Medical Conditions:</span>
								<p class="text-gray-900">{profileData.medical.medicalConditions || 'Not provided'}</p>
							</div>
							<div>
								<span class="text-sm font-medium text-gray-600">Allergies:</span>
								<p class="text-gray-900">{profileData.medical.allergies || 'Not provided'}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.btn {
		@apply px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
	}
	
	.btn-primary {
		@apply bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
	}
	
	.btn-secondary {
		@apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500;
	}
</style>