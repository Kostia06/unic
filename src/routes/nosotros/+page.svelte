<script lang="ts">
	import About from '$components/home/About.svelte';
</script>

<svelte:head>
	<title>Nosotros | Fam Unic</title>
	<meta name="description" content="Conoce la historia de Fam Unic - Joyería artesanal mexicana con inspiración cósmica." />
</svelte:head>

<main class="about-page">
	<About />
</main>

<style>
	.about-page {
		min-height: 100vh;
		padding-top: 5rem; /* Account for fixed header */
	}
</style>
