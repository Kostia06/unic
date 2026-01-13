<script lang="ts">
	import type { Product } from '$types';
	import { language, getLocalizedName } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { t } from '$utils/i18n';
	import { spring } from 'svelte/motion';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	// Props
	let {
		product,
		onViewDetails,
		index = 0,
		size = 'standard'
	}: {
		product: Product;
		onViewDetails: (product: Product) => void;
		index?: number;
		size?: 'hero' | 'featured' | 'standard';
	} = $props();

	// State
	let isHovered = $state(false);
	let cardElement: HTMLElement | null = $state(null);
	let imageContainer: HTMLElement | null = $state(null);

	// Spring for smooth mouse-based movement
	let mousePosition = spring(
		{ x: 0, y: 0 },
		{ stiffness: 0.1, damping: 0.4 }
	);

	// 3D tilt spring
	let tiltValues = spring(
		{ rotateX: 0, rotateY: 0 },
		{ stiffness: 0.15, damping: 0.5 }
	);

	// Computed: Primary image
	let primaryImage = $derived(
		product.images?.find((img) => img.is_primary)?.url ??
		product.images?.[0]?.url ??
		''
	);

	// Computed: Secondary image for hover
	let secondaryImage = $derived(
		product.images?.find((img) => !img.is_primary)?.url ??
		product.images?.[1]?.url ??
		null
	);

	// Computed: Current displayed image
	let currentImage = $derived(
		isHovered && secondaryImage ? secondaryImage : primaryImage
	);

	// Computed: Price
	let currentPrice = $derived(
		product.variants?.[0]?.price_mxn ?? product.base_price_mxn
	);

	// Computed: Material from first variant or category
	let material = $derived.by(() => {
		if (product.variants?.[0]?.options?.material) {
			const mat = product.variants[0].options.material;
			return mat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
		}
		return null;
	});

	// Computed: Category label
	let categoryLabel = $derived(
		product.category?.toUpperCase() ?? 'JEWELRY'
	);

	// Computed: Transform based on mouse position and tilt
	let cardTransform = $derived(
		`translate(${$mousePosition.x}px, ${$mousePosition.y}px) rotateX(${$tiltValues.rotateX}deg) rotateY(${$tiltValues.rotateY}deg)`
	);

	// Handle mouse movement within card - 3D tilt effect
	function handleMouseMove(event: MouseEvent) {
		if (!cardElement) return;

		const rect = cardElement.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const offsetX = (event.clientX - centerX) / (rect.width / 2);
		const offsetY = (event.clientY - centerY) / (rect.height / 2);

		mousePosition.set({
			x: offsetX * 4,
			y: offsetY * 4
		});

		// 3D tilt effect
		tiltValues.set({
			rotateX: -offsetY * 8,
			rotateY: offsetX * 8
		});
	}

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
		mousePosition.set({ x: 0, y: 0 });
		tiltValues.set({ rotateX: 0, rotateY: 0 });
	}

	function handleClick() {
		onViewDetails(product);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onViewDetails(product);
		}
	}

	// Entrance animation
	onMount(() => {
		if (!cardElement) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			// Ensure visible when reduced motion is preferred
			gsap.set(cardElement, { opacity: 1 });
			return;
		}

		// Set initial state and animate in
		gsap.set(cardElement, { opacity: 0, y: 40, scale: 0.95 });
		gsap.to(cardElement, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.6,
			ease: 'power3.out',
			delay: index * 0.1
		});
	});
</script>

<div
	bind:this={cardElement}
	class="product-card"
	class:is-hovered={isHovered}
	class:size-hero={size === 'hero'}
	class:size-featured={size === 'featured'}
	class:size-standard={size === 'standard'}
	style="--card-transform: {cardTransform}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	role="button"
	tabindex="0"
	aria-label={getLocalizedName(product)}
>
	<!-- Corner accent decoration -->
	<div class="corner-accent" aria-hidden="true"></div>

	<!-- Image Container -->
	<div class="image-container" bind:this={imageContainer}>
		<img
			src={currentImage}
			alt={getLocalizedName(product)}
			class="product-image"
			loading="lazy"
		/>

		<!-- Shimmer effect -->
		<div class="shimmer-overlay" aria-hidden="true"></div>

		<!-- Subtle glow overlay on hover -->
		<div class="glow-overlay" aria-hidden="true"></div>

		<!-- Border frame on hover -->
		<div class="border-frame" aria-hidden="true">
			<span class="frame-line frame-line--top"></span>
			<span class="frame-line frame-line--right"></span>
			<span class="frame-line frame-line--bottom"></span>
			<span class="frame-line frame-line--left"></span>
		</div>

		<!-- "Ver detalles" overlay on hover -->
		<div class="view-overlay" aria-hidden="true">
			<span class="view-text">Ver detalles</span>
			<svg
				class="view-arrow"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</div>
	</div>

	<!-- Product Info -->
	<div class="product-info">
		<!-- Category label -->
		<span class="category-label">{categoryLabel}</span>

		<!-- Product name -->
		<h3 class="product-name">{getLocalizedName(product)}</h3>

		<!-- Hover reveal: Material and Price -->
		<div class="hover-reveal">
			{#if material}
				<span class="material-text">{material}</span>
			{/if}
			<span class="price-text">{currency.format(currentPrice)}</span>
		</div>
	</div>
</div>

<style>
	.product-card {
		position: relative;
		cursor: pointer;
		transform-style: preserve-3d;
		perspective: 1000px;
		transform: var(--card-transform, translate(0, 0));
		transition: transform 0.15s ease-out;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.product-card:focus-visible {
		outline: 1px solid var(--accent-purple, #8b5cf6);
		outline-offset: 4px;
		border-radius: 4px;
	}

	/* Corner accent decoration */
	.corner-accent {
		position: absolute;
		top: -1px;
		right: -1px;
		width: 2rem;
		height: 2rem;
		border-top: 1px solid var(--white-30, rgba(255, 255, 255, 0.3));
		border-right: 1px solid var(--white-30, rgba(255, 255, 255, 0.3));
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
		z-index: 10;
	}

	.product-card.is-hovered .corner-accent {
		width: 3.5rem;
		height: 3.5rem;
		border-color: var(--accent-purple, #8b5cf6);
		box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
	}

	/* Image Container */
	.image-container {
		position: relative;
		flex: 1;
		min-height: 200px;
		overflow: hidden;
		background: var(--navy-deep, #001a4d);
		transform-style: preserve-3d;
	}

	/* Size variations for image container */
	.size-standard .image-container {
		aspect-ratio: 4 / 5;
		flex: none;
	}

	.size-featured .image-container {
		flex: 1;
		aspect-ratio: unset;
	}

	.size-hero .image-container {
		flex: 1;
		aspect-ratio: unset;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.product-card.is-hovered .product-image {
		transform: scale(1.05);
	}

	/* Shimmer effect */
	.shimmer-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			110deg,
			transparent 20%,
			rgba(255, 255, 255, 0.1) 50%,
			transparent 80%
		);
		transform: translateX(-100%);
		pointer-events: none;
	}

	.product-card.is-hovered .shimmer-overlay {
		animation: shimmer 1.5s ease-in-out;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	/* Glow overlay */
	.glow-overlay {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at center,
			rgba(139, 92, 246, 0.15) 0%,
			transparent 70%
		);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.product-card.is-hovered .glow-overlay {
		opacity: 1;
	}

	/* Border frame animation */
	.border-frame {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.frame-line {
		position: absolute;
		background: var(--accent-purple, #8b5cf6);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.frame-line--top,
	.frame-line--bottom {
		height: 1px;
		width: 0;
	}

	.frame-line--left,
	.frame-line--right {
		width: 1px;
		height: 0;
	}

	.frame-line--top { top: 0; left: 0; }
	.frame-line--right { top: 0; right: 0; }
	.frame-line--bottom { bottom: 0; right: 0; }
	.frame-line--left { bottom: 0; left: 0; }

	.product-card.is-hovered .frame-line--top,
	.product-card.is-hovered .frame-line--bottom {
		width: 30%;
	}

	.product-card.is-hovered .frame-line--left,
	.product-card.is-hovered .frame-line--right {
		height: 30%;
	}

	/* View overlay - blue tinted */
	.view-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: rgba(59, 130, 246, 0.85);
		color: var(--white, #ffffff);
		opacity: 0;
		transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
	}

	.product-card.is-hovered .view-overlay {
		opacity: 1;
	}

	.view-text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.view-arrow {
		width: 16px;
		height: 16px;
	}

	/* Product Info */
	.product-info {
		padding-top: 1rem;
		flex-shrink: 0;
	}

	/* Size variations for product info */
	.size-hero .product-info {
		padding-top: 1.5rem;
	}

	.size-featured .product-info {
		padding-top: 1.25rem;
	}

	/* Category label */
	.category-label {
		display: block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		text-transform: uppercase;
		letter-spacing: 0.15em;
		margin-bottom: 0.5rem;
	}

	/* Product name */
	.product-name {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--white, #ffffff);
		line-height: 1.2;
		margin: 0;
		transition: color 0.3s ease;
	}

	/* Size variations for product name */
	.size-hero .product-name {
		font-size: 2rem;
	}

	.size-featured .product-name {
		font-size: 1.5rem;
	}

	.product-card.is-hovered .product-name {
		color: var(--accent-purple, #8b5cf6);
	}

	/* Hover reveal section */
	.hover-reveal {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
		max-height: 0;
		opacity: 0;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.product-card.is-hovered .hover-reveal {
		max-height: 60px;
		opacity: 1;
	}

	.material-text {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.8125rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
	}

	.price-text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8125rem;
		color: var(--white-70, rgba(255, 255, 255, 0.7));
	}
</style>
