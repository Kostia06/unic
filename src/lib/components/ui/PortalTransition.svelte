<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	let {
		isOpen = false,
		children,
		onClose,
		originX = 50,
		originY = 50
	}: {
		isOpen: boolean;
		children: any;
		onClose?: () => void;
		originX?: number;
		originY?: number;
	} = $props();

	// State
	let portalState = $state<'closed' | 'opening' | 'open' | 'closing'>('closed');
	let showContent = $state(false);

	// Wormhole canvas
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationId: number;

	// Handle open/close transitions
	$effect(() => {
		if (isOpen && portalState === 'closed') {
			portalState = 'opening';
			setTimeout(() => {
				portalState = 'open';
				showContent = true;
			}, 600);
		} else if (!isOpen && (portalState === 'open' || portalState === 'opening')) {
			portalState = 'closing';
			showContent = false;
			setTimeout(() => {
				portalState = 'closed';
			}, 400);
		}
	});

	// Wormhole effect animation
	function drawWormhole(progress: number) {
		if (!ctx || !canvas) return;

		const centerX = (originX / 100) * canvas.width;
		const centerY = (originY / 100) * canvas.height;
		const maxRadius = Math.max(canvas.width, canvas.height) * 1.5;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw concentric rings that expand
		const rings = 8;
		for (let i = 0; i < rings; i++) {
			const ringProgress = Math.max(0, Math.min(1, (progress * 1.5) - (i * 0.1)));
			const radius = ringProgress * maxRadius * ((i + 1) / rings);
			const alpha = (1 - ringProgress) * 0.3;

			if (radius > 0 && alpha > 0) {
				// Outer glow
				const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius);
				gradient.addColorStop(0, `rgba(168, 85, 247, 0)`);
				gradient.addColorStop(0.5, `rgba(168, 85, 247, ${alpha})`);
				gradient.addColorStop(0.8, `rgba(236, 72, 153, ${alpha * 0.5})`);
				gradient.addColorStop(1, `rgba(34, 211, 238, 0)`);

				ctx.beginPath();
				ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
				ctx.strokeStyle = gradient;
				ctx.lineWidth = 3;
				ctx.stroke();
			}
		}

		// Central portal glow
		const portalRadius = progress * maxRadius * 0.4;
		if (portalRadius > 0) {
			const portalGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, portalRadius);
			portalGradient.addColorStop(0, `rgba(168, 85, 247, ${0.8 * progress})`);
			portalGradient.addColorStop(0.3, `rgba(131, 24, 67, ${0.5 * progress})`);
			portalGradient.addColorStop(0.6, `rgba(30, 58, 138, ${0.3 * progress})`);
			portalGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

			ctx.beginPath();
			ctx.arc(centerX, centerY, portalRadius, 0, Math.PI * 2);
			ctx.fillStyle = portalGradient;
			ctx.fill();
		}
	}

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			const handleResize = () => {
				if (canvas) {
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;
				}
			};

			window.addEventListener('resize', handleResize);

			return () => {
				cancelAnimationFrame(animationId);
				window.removeEventListener('resize', handleResize);
			};
		}
	});

	// Animate the wormhole based on state
	$effect(() => {
		if (portalState === 'opening') {
			let start = performance.now();
			const duration = 600;

			const animate = (now: number) => {
				const progress = Math.min(1, (now - start) / duration);
				drawWormhole(progress);
				if (progress < 1) {
					animationId = requestAnimationFrame(animate);
				}
			};
			animationId = requestAnimationFrame(animate);
		} else if (portalState === 'closing') {
			let start = performance.now();
			const duration = 400;

			const animate = (now: number) => {
				const progress = 1 - Math.min(1, (now - start) / duration);
				drawWormhole(progress);
				if (progress > 0) {
					animationId = requestAnimationFrame(animate);
				} else if (ctx && canvas) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
			};
			animationId = requestAnimationFrame(animate);
		}
	});

	function handleBackdropClick() {
		if (onClose) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && onClose) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if portalState !== 'closed'}
	<!-- Wormhole effect canvas -->
	<canvas
		bind:this={canvas}
		class="fixed inset-0 z-40 pointer-events-none"
		aria-hidden="true"
	></canvas>

	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-40 bg-void-deepest/80 backdrop-blur-sm transition-opacity duration-300"
		class:opacity-0={portalState === 'opening' || portalState === 'closing'}
		class:opacity-100={portalState === 'open'}
		onclick={handleBackdropClick}
		aria-label="Close"
	></button>

	<!-- Content container -->
	{#if showContent}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
		>
			<div
				class="pointer-events-auto portal-content"
				class:portal-enter={portalState === 'open'}
			>
				{@render children()}
			</div>
		</div>
	{/if}
{/if}

<style>
	.portal-content {
		animation: portal-emerge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes portal-emerge {
		0% {
			opacity: 0;
			transform: scale(0.8) rotate(-5deg);
			filter: blur(10px);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(0deg);
			filter: blur(0);
		}
	}

	/* Backdrop button styling */
	button {
		border: none;
		padding: 0;
		margin: 0;
		appearance: none;
		-webkit-appearance: none;
	}
</style>
