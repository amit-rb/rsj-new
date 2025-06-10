<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores/auth';

	onMount(() => {
		// Redirect to login if not authenticated, otherwise to profile
		if ($isAuthenticated) {
			goto('/profile');
		} else {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
	<div class="text-center">
		<div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
			<span class="text-white font-bold text-2xl">R</span>
		</div>
		<h1 class="text-2xl font-bold text-gray-900 mb-2">Republic School of Journalism</h1>
		<p class="text-gray-600">Loading...</p>
	</div>
</div>