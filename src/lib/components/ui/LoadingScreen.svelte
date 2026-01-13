<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	// Props
	let {
		onComplete,
		minDuration = 2500
	}: {
		onComplete?: () => void;
		minDuration?: number;
	} = $props();

	// State
	let isVisible = $state(true);
	let container: HTMLElement;
	let spiralPath: SVGPathElement;
	let textPaths: SVGPathElement[] = [];
	let tagline: HTMLElement;

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			// Skip animation for reduced motion
			setTimeout(() => {
				completeLoading();
			}, 500);
			return;
		}

		// Get all text paths
		const paths = container.querySelectorAll('.logo-text-path');
		textPaths = Array.from(paths) as SVGPathElement[];

		// Set initial states
		if (spiralPath) {
			const spiralLength = spiralPath.getTotalLength();
			gsap.set(spiralPath, {
				strokeDasharray: spiralLength,
				strokeDashoffset: spiralLength
			});
		}

		textPaths.forEach((path) => {
			const length = path.getTotalLength();
			gsap.set(path, {
				strokeDasharray: length,
				strokeDashoffset: length
			});
		});

		gsap.set(tagline, { opacity: 0, y: 10 });

		// Create animation timeline
		const tl = gsap.timeline({
			onComplete: () => {
				setTimeout(completeLoading, 300);
			}
		});

		// Draw spiral first
		tl.to(spiralPath, {
			strokeDashoffset: 0,
			duration: 1,
			ease: 'power2.inOut'
		});

		// Draw text letters with stagger
		tl.to(textPaths, {
			strokeDashoffset: 0,
			duration: 0.8,
			stagger: 0.1,
			ease: 'power2.out'
		}, '-=0.3');

		// Fade in tagline
		tl.to(tagline, {
			opacity: 1,
			y: 0,
			duration: 0.5,
			ease: 'power2.out'
		}, '-=0.2');

		// Hold for a moment then prepare to exit
		tl.to({}, { duration: 0.5 });
	});

	function completeLoading() {
		gsap.to(container, {
			opacity: 0,
			duration: 0.5,
			ease: 'power2.inOut',
			onComplete: () => {
				isVisible = false;
				onComplete?.();
			}
		});
	}
</script>

{#if isVisible}
	<div class="loading-screen" bind:this={container}>
		<div class="loading-content">
			<!-- Animated Logo -->
			<div class="logo-container">
				<!-- Spiral Symbol -->
				<svg
					class="logo-spiral"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						bind:this={spiralPath}
						d="M50 10
						   C70 10, 85 25, 85 45
						   C85 65, 70 80, 50 80
						   C35 80, 22 68, 22 52
						   C22 38, 33 28, 47 28
						   C58 28, 67 36, 67 47
						   C67 56, 60 63, 50 63
						   C43 63, 37 58, 37 51
						   C37 45, 42 40, 49 40
						   C54 40, 58 44, 58 49"
						class="spiral-path"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>

				<!-- Text: fam unic -->
				<svg
					class="logo-text"
					viewBox="0 0 200 40"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<!-- f -->
					<path
						class="logo-text-path"
						d="M10 35 L10 18 C10 12, 14 8, 20 8 M6 22 L16 22"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- a -->
					<path
						class="logo-text-path"
						d="M30 25 C30 20, 34 18, 38 18 C42 18, 45 21, 45 26 L45 35 M45 28 C45 32, 41 35, 37 35 C33 35, 30 32, 30 28"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- m -->
					<path
						class="logo-text-path"
						d="M55 35 L55 22 C55 19, 58 18, 61 18 C64 18, 66 20, 66 23 L66 35 M66 23 C66 19, 69 18, 72 18 C75 18, 77 20, 77 23 L77 35"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- space + u -->
					<path
						class="logo-text-path"
						d="M100 18 L100 28 C100 32, 103 35, 108 35 C113 35, 116 32, 116 28 L116 18"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- n -->
					<path
						class="logo-text-path"
						d="M126 35 L126 22 C126 19, 129 18, 133 18 C137 18, 140 20, 140 24 L140 35"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- i -->
					<path
						class="logo-text-path"
						d="M150 18 L150 35 M150 10 L150 12"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- c -->
					<path
						class="logo-text-path"
						d="M170 22 C167 18, 162 18, 160 22 C158 26, 158 31, 160 35 C162 38, 167 38, 170 35"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			<!-- Tagline -->
			<p class="tagline" bind:this={tagline}>Joyas del universo</p>
		</div>

		<!-- Subtle background particles -->
		<div class="particles" aria-hidden="true">
			{#each Array(5) as _, i}
				<span class="particle" style="--delay: {i * 0.5}s; --x: {20 + i * 15}%;"></span>
			{/each}
		</div>
	</div>
{/if}

<style>
	.loading-screen {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--navy-deepest, #001239);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.logo-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.logo-spiral {
		width: 80px;
		height: 80px;
		color: var(--accent-purple, #8b5cf6);
	}

	.spiral-path {
		filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.5));
	}

	.logo-text {
		width: 180px;
		height: 45px;
		color: var(--white, #ffffff);
	}

	.logo-text-path {
		filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
	}

	.tagline {
		font-family: 'Pinyon Script', cursive;
		font-size: 1.25rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		letter-spacing: 0.1em;
		margin: 0;
	}

	/* Particles */
	.particles {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: var(--accent-purple, #8b5cf6);
		border-radius: 50%;
		left: var(--x);
		top: 100%;
		opacity: 0.3;
		animation: float-up 4s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes float-up {
		0% {
			transform: translateY(0) scale(1);
			opacity: 0;
		}
		10% {
			opacity: 0.3;
		}
		90% {
			opacity: 0.3;
		}
		100% {
			transform: translateY(-100vh) scale(0.5);
			opacity: 0;
		}
	}

	/* Responsive */
	@media (min-width: 768px) {
		.logo-spiral {
			width: 100px;
			height: 100px;
		}

		.logo-text {
			width: 220px;
			height: 55px;
		}

		.tagline {
			font-size: 1.5rem;
		}
	}
</style>
