<script lang="ts">
	import { currentUser, updateUser } from '$lib/stores/auth';
	import { profileAPI, type ProfileData } from '$lib/api/profile';
	import { 
		User, 
		Mail, 
		Phone, 
		Calendar, 
		MapPin, 
		Edit3, 
		Save, 
		X, 
		Camera,
		CheckCircle,
		Clock,
		AlertCircle
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let isEditing = false;
	let isSaving = false;
	let saveError = '';
	let saveSuccess = false;

	// Profile data from the page load
	$: profile = data.profile;
	$: profileData = profile?.profileData || {};

	// Form data for editing
	let formData = {
		firstName: '',
		lastName: '',
		phone: '',
		dateOfBirth: '',
		gender: '',
		nationality: '',
		religion: '',
		category: '',
		maritalStatus: '',
		currentAddress: '',
		currentCity: '',
		currentState: '',
		currentPincode: '',
		permanentAddress: '',
		permanentCity: '',
		permanentState: '',
		permanentPincode: '',
		sameAsCurrent: false
	};

	// Initialize form data when profile loads
	$: if (profile && !isEditing) {
		const personal = profileData.personal || {};
		const address = profileData.address || {};
		
		// Extract first and last name from the current user name
		const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
		
		formData = {
			firstName: nameParts[0] || '',
			lastName: nameParts.slice(1).join(' ') || '',
			phone: profile.phone || '',
			dateOfBirth: personal.dateOfBirth || '',
			gender: personal.gender || '',
			nationality: personal.nationality || '',
			religion: personal.religion || '',
			category: personal.category || '',
			maritalStatus: personal.maritalStatus || '',
			currentAddress: address.currentAddress || '',
			currentCity: address.currentCity || '',
			currentState: address.currentState || '',
			currentPincode: address.currentPincode || '',
			permanentAddress: address.permanentAddress || '',
			permanentCity: address.permanentCity || '',
			permanentState: address.permanentState || '',
			permanentPincode: address.permanentPincode || '',
			sameAsCurrent: address.sameAsCurrent || false
		};
	}

	function startEditing() {
		isEditing = true;
		saveError = '';
		saveSuccess = false;
	}

	function cancelEditing() {
		isEditing = false;
		saveError = '';
		saveSuccess = false;
		// Reset form data
		if (profile) {
			const personal = profileData.personal || {};
			const address = profileData.address || {};
			
			const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
			
			formData = {
				firstName: nameParts[0] || '',
				lastName: nameParts.slice(1).join(' ') || '',
				phone: profile.phone || '',
				dateOfBirth: personal.dateOfBirth || '',
				gender: personal.gender || '',
				nationality: personal.nationality || '',
				religion: personal.religion || '',
				category: personal.category || '',
				maritalStatus: personal.maritalStatus || '',
				currentAddress: address.currentAddress || '',
				currentCity: address.currentCity || '',
				currentState: address.currentState || '',
				currentPincode: address.currentPincode || '',
				permanentAddress: address.permanentAddress || '',
				permanentCity: address.permanentCity || '',
				permanentState: address.permanentState || '',
				permanentPincode: address.permanentPincode || '',
				sameAsCurrent: address.sameAsCurrent || false
			};
		}
	}

	async function saveProfile() {
		if (!profile || isSaving) return;

		isSaving = true;
		saveError = '';
		saveSuccess = false;

		try {
			// Prepare the profile data update
			const updatedProfileData: ProfileData = {
				personal: {
					...profileData.personal,
					gender: formData.gender,
					nationality: formData.nationality,
					religion: formData.religion,
					category: formData.category,
					maritalStatus: formData.maritalStatus,
					dateOfBirth: formData.dateOfBirth
				},
				address: {
					...profileData.address,
					currentAddress: formData.currentAddress,
					currentCity: formData.currentCity,
					currentState: formData.currentState,
					currentPincode: formData.currentPincode,
					permanentAddress: formData.permanentAddress,
					permanentCity: formData.permanentCity,
					permanentState: formData.permanentState,
					permanentPincode: formData.permanentPincode,
					sameAsCurrent: formData.sameAsCurrent
				}
			};

			const response = await profileAPI.updateProfile(profile.id, {
				profileData: updatedProfileData
			});

			if (response.status === 200) {
				// Update the current user with new name and phone
				const updatedUser = {
					...profile,
					name: `${formData.firstName} ${formData.lastName}`.trim(),
					phone: formData.phone
				};
				
				updateUser(updatedUser);
				
				saveSuccess = true;
				isEditing = false;
				
				// Hide success message after 3 seconds
				setTimeout(() => {
					saveSuccess = false;
				}, 3000);
			} else {
				saveError = response.message || 'Failed to update profile';
			}
		} catch (error) {
			console.error('Error saving profile:', error);
			saveError = 'An error occurred while saving your profile';
		} finally {
			isSaving = false;
		}
	}

	function getInitials(name: string): string {
		if (!name) return '';
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function getProfileCompletionPercentage(): number {
		if (!profileData) return 0;
		
		const fields = [
			profileData.personal?.gender,
			profileData.personal?.nationality,
			profileData.personal?.dateOfBirth,
			profileData.address?.currentCity,
			profileData.address?.currentState,
			profile?.phone
		];
		
		const filledFields = fields.filter(field => field && field.trim() !== '').length;
		return Math.round((filledFields / fields.length) * 100);
	}

	// Handle same as current address checkbox
	function handleSameAsCurrentChange() {
		if (formData.sameAsCurrent) {
			formData.permanentAddress = formData.currentAddress;
			formData.permanentCity = formData.currentCity;
			formData.permanentState = formData.currentState;
			formData.permanentPincode = formData.currentPincode;
		}
	}

	$: if (formData.sameAsCurrent) {
		handleSameAsCurrentChange();
	}
</script>

<svelte:head>
	<title>Profile - Republic School of Journalism</title>
</svelte:head>

{#if profile}
	<!-- Page Header -->
	<div class="mb-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
				<p class="text-gray-600">Manage your personal information and preferences</p>
			</div>
			<div class="flex items-center space-x-3">
				{#if !isEditing}
					<button 
						on:click={startEditing}
						class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
					>
						<Edit3 class="w-4 h-4 mr-2" />
						Edit Profile
					</button>
				{:else}
					<button 
						on:click={cancelEditing}
						class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
					>
						<X class="w-4 h-4 mr-2" />
						Cancel
					</button>
					<button 
						on:click={saveProfile}
						disabled={isSaving}
						class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isSaving}
							<div class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Saving...
						{:else}
							<Save class="w-4 h-4 mr-2" />
							Save Changes
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if saveSuccess}
		<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
			<div class="flex items-start space-x-2">
				<CheckCircle class="w-5 h-5 text-green-600 mt-0.5" />
				<div>
					<p class="text-sm text-green-700">Profile updated successfully!</p>
				</div>
			</div>
		</div>
	{/if}

	{#if saveError}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
			<div class="flex items-start space-x-2">
				<AlertCircle class="w-5 h-5 text-red-600 mt-0.5" />
				<div>
					<p class="text-sm text-red-700">{saveError}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Profile Header Card -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
		<div class="flex items-center space-x-6">
			<div class="relative">
				{#if profile.avatar}
					<img src={profile.avatar} alt="Profile" class="w-24 h-24 rounded-full object-cover" />
				{:else}
					<div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
						<span class="text-purple-600 text-2xl font-bold">
							{getInitials(profile.name)}
						</span>
					</div>
				{/if}
				<button class="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors duration-200">
					<Camera class="w-4 h-4" />
				</button>
			</div>
			<div class="flex-1">
				<h2 class="text-2xl font-bold text-gray-900">{profile.name}</h2>
				<p class="text-gray-600 mb-2">Student at Republic School of Journalism</p>
				<div class="flex items-center space-x-4 text-sm text-gray-600">
					<div class="flex items-center space-x-1">
						<Mail class="w-4 h-4" />
						<span>{profile.email}</span>
					</div>
					{#if profile.phone}
						<div class="flex items-center space-x-1">
							<Phone class="w-4 h-4" />
							<span>{profile.phone}</span>
						</div>
					{/if}
					<div class="flex items-center space-x-1">
						<Calendar class="w-4 h-4" />
						<span>Joined {profile.joinDate || 'Jan 2024'}</span>
					</div>
				</div>
			</div>
			<div class="text-right">
				<div class="text-sm text-gray-600 mb-1">Profile Completion</div>
				<div class="flex items-center space-x-2">
					<div class="w-16 h-2 bg-gray-200 rounded-full">
						<div 
							class="h-2 bg-purple-600 rounded-full transition-all duration-300" 
							style="width: {getProfileCompletionPercentage()}%"
						></div>
					</div>
					<span class="text-sm font-medium text-gray-900">{getProfileCompletionPercentage()}%</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Profile Form -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Personal Information -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200">
			<div class="p-6 border-b border-gray-200">
				<h3 class="text-xl font-bold text-gray-900 flex items-center">
					<User class="w-5 h-5 mr-2 text-purple-600" />
					Personal Information
				</h3>
			</div>
			<div class="p-6 space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
						{#if isEditing}
							<input 
								type="text" 
								bind:value={formData.firstName}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
								placeholder="Enter first name"
							/>
						{:else}
							<p class="text-gray-900">{formData.firstName || 'Not provided'}</p>
						{/if}
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
						{#if isEditing}
							<input 
								type="text" 
								bind:value={formData.lastName}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
								placeholder="Enter last name"
							/>
						{:else}
							<p class="text-gray-900">{formData.lastName || 'Not provided'}</p>
						{/if}
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
					{#if isEditing}
						<input 
							type="tel" 
							bind:value={formData.phone}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
							placeholder="Enter phone number"
						/>
					{:else}
						<p class="text-gray-900">{formData.phone || 'Not provided'}</p>
					{/if}
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
					{#if isEditing}
						<input 
							type="date" 
							bind:value={formData.dateOfBirth}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
						/>
					{:else}
						<p class="text-gray-900">{formData.dateOfBirth || 'Not provided'}</p>
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
						{#if isEditing}
							<select 
								bind:value={formData.gender}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
							>
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
								<option value="prefer-not-to-say">Prefer not to say</option>
							</select>
						{:else}
							<p class="text-gray-900">{formData.gender || 'Not provided'}</p>
						{/if}
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
						{#if isEditing}
							<input 
								type="text" 
								bind:value={formData.nationality}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
								placeholder="Enter nationality"
							/>
						{:else}
							<p class="text-gray-900">{formData.nationality || 'Not provided'}</p>
						{/if}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Religion</label>
						{#if isEditing}
							<input 
								type="text" 
								bind:value={formData.religion}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
								placeholder="Enter religion"
							/>
						{:else}
							<p class="text-gray-900">{formData.religion || 'Not provided'}</p>
						{/if}
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
						{#if isEditing}
							<select 
								bind:value={formData.category}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
							>
								<option value="">Select Category</option>
								<option value="general">General</option>
								<option value="obc">OBC</option>
								<option value="sc">SC</option>
								<option value="st">ST</option>
								<option value="ews">EWS</option>
							</select>
						{:else}
							<p class="text-gray-900">{formData.category || 'Not provided'}</p>
						{/if}
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
					{#if isEditing}
						<select 
							bind:value={formData.maritalStatus}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
						>
							<option value="">Select Status</option>
							<option value="single">Single</option>
							<option value="married">Married</option>
							<option value="divorced">Divorced</option>
							<option value="widowed">Widowed</option>
						</select>
					{:else}
						<p class="text-gray-900">{formData.maritalStatus || 'Not provided'}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Address Information -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200">
			<div class="p-6 border-b border-gray-200">
				<h3 class="text-xl font-bold text-gray-900 flex items-center">
					<MapPin class="w-5 h-5 mr-2 text-purple-600" />
					Address Information
				</h3>
			</div>
			<div class="p-6 space-y-4">
				<div>
					<h4 class="font-medium text-gray-900 mb-3">Current Address</h4>
					<div class="space-y-3">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
							{#if isEditing}
								<textarea 
									bind:value={formData.currentAddress}
									rows="2"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
									placeholder="Enter current address"
								></textarea>
							{:else}
								<p class="text-gray-900">{formData.currentAddress || 'Not provided'}</p>
							{/if}
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">City</label>
								{#if isEditing}
									<input 
										type="text" 
										bind:value={formData.currentCity}
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										placeholder="Enter city"
									/>
								{:else}
									<p class="text-gray-900">{formData.currentCity || 'Not provided'}</p>
								{/if}
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">State</label>
								{#if isEditing}
									<input 
										type="text" 
										bind:value={formData.currentState}
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
										placeholder="Enter state"
									/>
								{:else}
									<p class="text-gray-900">{formData.currentState || 'Not provided'}</p>
								{/if}
							</div>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
							{#if isEditing}
								<input 
									type="text" 
									bind:value={formData.currentPincode}
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
									placeholder="Enter pincode"
								/>
							{:else}
								<p class="text-gray-900">{formData.currentPincode || 'Not provided'}</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="border-t border-gray-200 pt-4">
					<div class="flex items-center justify-between mb-3">
						<h4 class="font-medium text-gray-900">Permanent Address</h4>
						{#if isEditing}
							<label class="flex items-center space-x-2">
								<input 
									type="checkbox" 
									bind:checked={formData.sameAsCurrent}
									class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
								/>
								<span class="text-sm text-gray-600">Same as current</span>
							</label>
						{/if}
					</div>
					<div class="space-y-3">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
							{#if isEditing}
								<textarea 
									bind:value={formData.permanentAddress}
									rows="2"
									disabled={formData.sameAsCurrent}
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
									placeholder="Enter permanent address"
								></textarea>
							{:else}
								<p class="text-gray-900">{formData.permanentAddress || 'Not provided'}</p>
							{/if}
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">City</label>
								{#if isEditing}
									<input 
										type="text" 
										bind:value={formData.permanentCity}
										disabled={formData.sameAsCurrent}
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
										placeholder="Enter city"
									/>
								{:else}
									<p class="text-gray-900">{formData.permanentCity || 'Not provided'}</p>
								{/if}
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">State</label>
								{#if isEditing}
									<input 
										type="text" 
										bind:value={formData.permanentState}
										disabled={formData.sameAsCurrent}
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
										placeholder="Enter state"
									/>
								{:else}
									<p class="text-gray-900">{formData.permanentState || 'Not provided'}</p>
								{/if}
							</div>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
							{#if isEditing}
								<input 
									type="text" 
									bind:value={formData.permanentPincode}
									disabled={formData.sameAsCurrent}
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
									placeholder="Enter pincode"
								/>
							{:else}
								<p class="text-gray-900">{formData.permanentPincode || 'Not provided'}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center py-12">
		<AlertCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
		<h3 class="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
		<p class="text-gray-600">Unable to load your profile information.</p>
	</div>
{/if}