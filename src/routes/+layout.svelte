<script lang="ts">
	import '../app.css';
	import Layout from '$lib/components/Layout.svelte';
	import { onMount } from 'svelte';
	import { authService } from '$lib/api/authService';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Initialize auth state on app load
	onMount(() => {
		if (browser) {
			// Check if user is authenticated and fetch profile if needed
			if (authService.isAuthenticated()) {
				const storedUser = localStorage.getItem('currentUser');
				if (storedUser) {
					try {
						const user = JSON.parse(storedUser);
						// Optionally refresh user profile data
						authService.fetchUserProfile(user.id);
					} catch (error) {
						console.error('Error parsing stored user:', error);
						authService.logout();
					}
				}
			}
		}
	});
</script>

<Layout {children} />