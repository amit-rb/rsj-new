<script lang="ts">
	import '../app.css';
	import Layout from '$lib/components/Layout.svelte';

	let { children } = $props();
</script>

<Layout {children} />
