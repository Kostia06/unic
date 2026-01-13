<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	/**
	 * VerticalBrand - Large vertical FAM UNIC letters
	 * Inspired by Crescent Sicily's vertical brand display
	 */

	let container: HTMLElement;
	let letters: HTMLElement[] = [];

	const brandParts = [
		{ text: 'F', delay: 0 },
		{ text: 'A', delay: 0.1 },
		{ text: 'M', delay: 0.2 },
		{ text: '✧', delay: 0.3, isDecorative: true },
		{ text: 'U', delay: 0.4 },
		{ text: 'N', delay: 0.5 },
		{ text: 'I', delay: 0.6 },
		{ text: 'C', delay: 0.7 }
	];

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			gsap.set(letters, { opacity: 1, x: 0 });
			return;
		}

		// Initial state
		gsap.set(letters, { opacity: 0, x: -50 });

		// Staggered entrance animation
		const tl = gsap.timeline({ delay: 0.5 });

		letters.forEach((letter, i) => {
			tl.to(
				letter,
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: 'power3.out'
				},
				brandParts[i].delay
			);
		});

		return () => {
			tl.kill();
		};
	});
</script>

<div class="vertical-brand" bind:this={container}>
	{#each brandParts as part, i}
		<span
			class="brand-letter"
			class:decorative={part.isDecorative}
			bind:this={letters[i]}
		>
			{part.text}
		</span>
	{/each}
</div>

<style>
	.vertical-brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		user-select: none;
	}

	.brand-letter {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(4rem, 12vw, 10rem);
		font-weight: 400;
		line-height: 0.85;
		color: var(--white, #ffffff);
		opacity: 0;
	}

	.brand-letter.decorative {
		font-size: clamp(2rem, 6vw, 5rem);
		color: var(--accent-purple, #8b5cf6);
		text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
		margin: 0.5rem 0;
	}

	/* Horizontal layout on mobile */
	@media (max-width: 768px) {
		.vertical-brand {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.25rem;
		}

		.brand-letter {
			font-size: clamp(2.5rem, 10vw, 4rem);
		}

		.brand-letter.decorative {
			font-size: clamp(1.5rem, 5vw, 2.5rem);
			margin: 0 0.5rem;
		}
	}
</style>
