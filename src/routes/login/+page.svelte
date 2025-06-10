<script lang="ts">
	import { goto } from '$app/navigation';
	import { authLoading, isAuthenticated, authError } from '$lib/stores/auth';
	import { authService } from '$lib/api/authService';
	import { config } from '$lib/config/env';
	import { onMount } from 'svelte';

	let email = '';
	let otpSent = false;
	let otp = '';
	let isValidEmail = false;
	let isValidOtp = false;
	let requestingOtp = false;
	let verifyingOtp = false;
	let otpError = '';

	$: isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	$: isValidOtp = otp.length >= 4; // Assuming OTP is at least 4 digits

	// Redirect if already authenticated
	onMount(() => {
		if ($isAuthenticated) {
			goto('/profile');
		}
	});

	async function sendOTP() {
		if (!isValidEmail || requestingOtp) return;

		otpError = '';
		requestingOtp = true;

		try {
			const response = await authService.requestOtp(email);

			if (response.status === 200) {
				otpSent = true;
			} else {
				otpError = response.message || 'Failed to send OTP. Please try again.';
			}
		} catch (error) {
			console.error('Error requesting OTP:', error);
			otpError = 'An error occurred while requesting OTP. Please try again.';
		} finally {
			requestingOtp = false;
		}
	}

	async function verifyOTP() {
		if (!isValidOtp || verifyingOtp) return;

		otpError = '';
		verifyingOtp = true;

		try {
			const response = await authService.verifyOtp(email, otp);

			if (response.status === 200 && response.data?.access_token) {
				// Auth service will handle updating the store and redirecting
				goto('/profile');
			} else {
				otpError = response.message || 'Invalid OTP. Please try again.';
			}
		} catch (error) {
			console.error('Error verifying OTP:', error);
			otpError = 'An error occurred while verifying OTP. Please try again.';
		} finally {
			verifyingOtp = false;
		}
	}

	function handleEmailKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && isValidEmail && !requestingOtp) {
			sendOTP();
		}
	}

	function handleOtpKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && isValidOtp && !verifyingOtp) {
			verifyOTP();
		}
	}

	function resendOTP() {
		otpSent = false;
		otp = '';
	}
</script>

<svelte:head>
	<title>Sign In - Republic School of Journalism</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Logo -->
		<div class="text-center">
			<div class="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
				<span class="text-white font-bold text-2xl">R</span>
			</div>
			<h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
			<p class="text-gray-600">Sign in to your Republic School of Journalism account</p>
		</div>

		<!-- Login Form -->
		<div class="bg-white rounded-xl shadow-lg p-8 space-y-6">
			{#if !otpSent}
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						Email Address
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							on:keydown={handleEmailKeydown}
							placeholder="Enter your email"
							class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
							disabled={$authLoading}
						/>
					</div>
				</div>

				<button
					on:click={sendOTP}
					disabled={!isValidEmail || $authLoading}
					class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
				>
					{#if $authLoading}
						<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						<span>Sending OTP...</span>
					{:else}
						<span>Send OTP</span>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					{/if}
				</button>
			{:else}
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="text-lg font-medium text-gray-900 mb-2">OTP Sent Successfully!</h3>
					<p class="text-sm text-gray-600 mb-4">We've sent a verification code to {email}</p>

					{#if otpError}
						<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
							<div class="flex items-start space-x-2">
								<svg class="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 5a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z" clip-rule="evenodd" />
								</svg>
								<div class="text-left">
									<p class="text-sm text-red-700">{otpError}</p>
								</div>
							</div>
						</div>
					{/if}

					<div class="mb-4">
						<label for="otp" class="block text-sm font-medium text-gray-700 mb-2 text-left">
							Enter Verification Code
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<input
								id="otp"
								type="text"
								bind:value={otp}
								on:keydown={handleOtpKeydown}
								placeholder="Enter OTP"
								class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
								disabled={verifyingOtp}
							/>
						</div>
					</div>

					<div class="flex flex-col space-y-3">
						<button
							on:click={verifyOTP}
							disabled={!isValidOtp || verifyingOtp}
							class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
						>
							{#if verifyingOtp}
								<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Verifying...</span>
							{:else}
								<span>Verify OTP</span>
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							{/if}
						</button>

						<button
							on:click={resendOTP}
							class="text-purple-600 hover:text-purple-700 font-medium"
						>
							Didn't receive the code? Resend
						</button>
					</div>

					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
						<div class="flex items-start space-x-2">
							<svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
							</svg>
							<div class="text-left">
								<p class="text-sm font-medium text-blue-800">Development Mode:</p>
								<p class="text-sm text-blue-700">In development, any valid email will work. The OTP will be logged to the console.</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- API Endpoint Info -->
			<div class="text-center text-sm text-gray-500 border-t pt-4">
				API Endpoint: {config.apiUrl}
			</div>

			<!-- Contact Link -->
			<div class="text-center">
				<p class="text-sm text-gray-600">
					Don't have an account? 
					<button class="text-purple-600 hover:text-purple-700 font-medium">
						Contact Admissions
					</button>
				</p>
			</div>
		</div>
	</div>
</div>