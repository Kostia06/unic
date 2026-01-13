<script lang="ts">
	import 'virtual:uno.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Header from '$components/layout/Header.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import CartDrawer from '$components/layout/CartDrawer.svelte';
	import CosmicBackground from '$components/ui/CosmicBackground.svelte';
	import CosmicCursor from '$components/ui/CosmicCursor.svelte';
	import LoadingScreen from '$components/ui/LoadingScreen.svelte';

	let { children } = $props();

	// Loading state - only show on first visit
	let showLoading = $state(true);
	let contentReady = $state(false);

	onMount(() => {
		// Check if user has already seen the loading screen this session
		const hasSeenLoading = sessionStorage.getItem('fam-unic-loaded');
		if (hasSeenLoading) {
			showLoading = false;
			contentReady = true;
		}
	});

	function handleLoadingComplete() {
		sessionStorage.setItem('fam-unic-loaded', 'true');
		contentReady = true;
	}
</script>

<svelte:head>
	<title>Fam Unic - Joyas del Universo</title>
</svelte:head>

<!-- Loading Screen -->
{#if showLoading}
	<LoadingScreen onComplete={handleLoadingComplete} />
{/if}

<!-- CSS-only cosmic background (navy gradients) -->
<CosmicBackground />

<!-- Custom cursor with stardust particles -->
<CosmicCursor />

<!-- Main app structure -->
<div class="app-container" class:content-ready={contentReady}>
	<Header />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>

<!-- Cart drawer overlay -->
<CartDrawer />

<style>
	.app-container {
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.app-container.content-ready {
		opacity: 1;
	}
</style>
