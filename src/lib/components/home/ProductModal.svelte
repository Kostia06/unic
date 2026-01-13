<script lang="ts">
	import type { Product, ProductVariant } from '$types';
	import { language, getLocalizedName, getLocalizedDescription } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { cart } from '$stores/cart.svelte';
	import { t } from '$utils/i18n';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Props
	let {
		product,
		open,
		onClose
	}: {
		product: Product;
		open: boolean;
		onClose: () => void;
	} = $props();

	// State
	let selectedVariantId = $state<string | null>(null);
	let quantity = $state(1);
	let currentImageIndex = $state(0);
	let showAddedNotification = $state(false);

	// Computed
	let allImages = $derived.by(() => {
		const images: string[] = [];

		// Add product images
		if (product.images) {
			images.push(...product.images.map((img) => img.url));
		}

		// Add variant images
		if (product.variants) {
			product.variants.forEach((v) => {
				if (v.image_url && !images.includes(v.image_url)) {
					images.push(v.image_url);
				}
			});
		}

		return images.length > 0 ? images : [''];
	});

	let selectedVariant = $derived(
		product.variants?.find((v) => v.id === selectedVariantId) ?? null
	);

	let currentPrice = $derived(
		selectedVariant?.price_mxn ?? product.base_price_mxn
	);

	let currentImage = $derived(
		selectedVariant?.image_url ?? allImages[currentImageIndex] ?? ''
	);

	let description = $derived(getLocalizedDescription(product));

	// Group variants by type for color swatches vs text buttons
	let variantsByType = $derived.by(() => {
		if (!product.variant_types) return [];
		return product.variant_types.map((variantType) => {
			const isColor = variantType.name_es.toLowerCase().includes('color');
			return {
				...variantType,
				isColor,
				options: variantType.options ?? []
			};
		});
	});

	// Reset state when product changes
	$effect(() => {
		if (product) {
			selectedVariantId = product.variants?.[0]?.id ?? null;
			quantity = 1;
			currentImageIndex = 0;
		}
	});

	// Lock body scroll when modal is open
	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleAddToCart() {
		cart.add(product, selectedVariant, quantity);
		showAddedNotification = true;
		setTimeout(() => {
			showAddedNotification = false;
		}, 2000);
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			onClose();
		}
	}

	function selectImage(index: number) {
		currentImageIndex = index;
	}

	function selectVariant(variantId: string) {
		selectedVariantId = variantId;
		// Update image to variant image if available
		const variant = product.variants?.find((v) => v.id === variantId);
		if (variant?.image_url) {
			const imageIndex = allImages.indexOf(variant.image_url);
			if (imageIndex >= 0) {
				currentImageIndex = imageIndex;
			}
		}
	}

	function getColorValue(optionName: string): string {
		// Map common color names to hex values
		const colorMap: Record<string, string> = {
			'negro': '#000000',
			'black': '#000000',
			'blanco': '#ffffff',
			'white': '#ffffff',
			'rojo': '#dc2626',
			'red': '#dc2626',
			'azul': '#2563eb',
			'blue': '#2563eb',
			'verde': '#16a34a',
			'green': '#16a34a',
			'amarillo': '#eab308',
			'yellow': '#eab308',
			'rosa': '#ec4899',
			'pink': '#ec4899',
			'morado': '#8b5cf6',
			'purple': '#8b5cf6',
			'naranja': '#ea580c',
			'orange': '#ea580c',
			'gris': '#6b7280',
			'gray': '#6b7280',
			'beige': '#d4c4a8',
			'cafe': '#8b4513',
			'brown': '#8b4513',
			'dorado': '#ffd700',
			'gold': '#ffd700',
			'plateado': '#c0c0c0',
			'silver': '#c0c0c0',
		};
		const lowerName = optionName.toLowerCase();
		return colorMap[lowerName] || '#6b7280';
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Full-screen overlay with backdrop blur -->
	<div
		class="modal-overlay"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label={getLocalizedName(product)}
		tabindex="-1"
		transition:fade={{ duration: 300 }}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			transition:fly={{ y: 40, duration: 400, easing: cubicOut }}
		>
			<!-- Close button -->
			<button
				onclick={onClose}
				class="close-button"
				aria-label={t(language.current, 'common.close')}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>

			<div class="modal-grid">
				<!-- Left side - Images -->
				<div class="images-section">
					<!-- Main image container -->
					<div class="main-image-container">
						{#if currentImage}
							<img
								src={currentImage}
								alt={getLocalizedName(product)}
								class="main-image"
							/>
						{/if}
					</div>

					<!-- Thumbnails -->
					{#if allImages.length > 1}
						<div class="thumbnails">
							{#each allImages as image, i (image)}
								<button
									class="thumbnail"
									class:active={currentImageIndex === i}
									onclick={() => selectImage(i)}
									aria-label="View image {i + 1}"
								>
									<img src={image} alt="" />
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Right side - Product details -->
				<div class="details-section">
					<!-- Category label -->
					{#if product.category}
						<span class="category-label">
							{product.category}
						</span>
					{/if}

					<!-- Product title -->
					<h2 class="product-title">
						{getLocalizedName(product)}
					</h2>

					<!-- Price -->
					<div class="price-container">
						<span class="price">
							{currency.format(currentPrice)}
						</span>
						{#if currency.current === 'MXN'}
							<span class="price-alt">
								{currency.formatWithAlternate(currentPrice).secondary}
							</span>
						{/if}
					</div>

					<!-- Description -->
					{#if description}
						<p class="description">
							{description}
						</p>
					{/if}

					<!-- Variant selectors -->
					{#if variantsByType.length > 0}
						<div class="variants-container">
							{#each variantsByType as variantType (variantType.name_es)}
								<div class="variant-group">
									<span class="variant-label">
										{language.current === 'en' && variantType.name_en
											? variantType.name_en
											: variantType.name_es}
									</span>
									<div class="variant-options">
										{#each variantType.options as option (option.name_es)}
											{@const matchingVariants = product.variants?.filter(
												(v) => Object.values(v.options).some(
													(val) => val === option.name_es.toLowerCase().replace(/\s+/g, '-')
												)
											) ?? []}
											{@const isSelected = matchingVariants.some((v) => v.id === selectedVariantId)}

											{#if variantType.isColor}
												<!-- Color swatch -->
												<button
													class="color-swatch"
													class:active={isSelected}
													style="--swatch-color: {getColorValue(option.name_es)}"
													onclick={() => {
														if (matchingVariants.length > 0) {
															selectVariant(matchingVariants[0].id);
														}
													}}
													aria-label={language.current === 'en' && option.name_en ? option.name_en : option.name_es}
													title={language.current === 'en' && option.name_en ? option.name_en : option.name_es}
												></button>
											{:else}
												<!-- Text button -->
												<button
													class="variant-button"
													class:active={isSelected}
													onclick={() => {
														if (matchingVariants.length > 0) {
															selectVariant(matchingVariants[0].id);
														}
													}}
												>
													{language.current === 'en' && option.name_en
														? option.name_en
														: option.name_es}
												</button>
											{/if}
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Quantity selector -->
					<div class="quantity-container">
						<span class="quantity-label">
							{t(language.current, 'products.quantity')}
						</span>
						<div class="quantity-controls">
							<button
								class="quantity-button"
								onclick={() => quantity > 1 && (quantity -= 1)}
								disabled={quantity <= 1}
								aria-label="Decrease quantity"
							>
								-
							</button>
							<span class="quantity-value">{quantity}</span>
							<button
								class="quantity-button"
								onclick={() => (quantity += 1)}
								aria-label="Increase quantity"
							>
								+
							</button>
						</div>
					</div>

					<!-- Add to cart button -->
					<button
						class="add-to-cart-button"
						onclick={handleAddToCart}
					>
						<span class="button-text">
							{#if showAddedNotification}
								{t(language.current, 'cart.added')}
							{:else}
								{t(language.current, 'products.addToCart')}
							{/if}
						</span>
						<span class="button-price">
							{currency.format(currentPrice * quantity)}
						</span>
					</button>

					<!-- Meta info -->
					<div class="meta-info">
						<div class="meta-item">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
								<path d="M10 12h4" />
							</svg>
							<span>Envio a todo Mexico</span>
						</div>
						<div class="meta-item">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
								<path d="M7 11V7a5 5 0 0110 0v4" />
								<path d="M4 11h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V11z" />
								<circle cx="12" cy="16" r="1" />
							</svg>
							<span>Hecho a mano</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Modal overlay - full screen with backdrop blur */
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		overflow-y: auto;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
	}

	/* Modal content */
	.modal-content {
		position: relative;
		width: 100%;
		max-width: 1200px;
		background: var(--void-medium);
		border: 1px solid var(--star-10);
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	/* Close button */
	.close-button {
		position: absolute;
		top: 0;
		right: 0;
		width: 3rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--star-10);
		border-top: none;
		border-right: none;
		background: transparent;
		color: var(--star-50);
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 10;
	}

	.close-button:hover {
		background: var(--star-10);
		color: var(--star-white);
	}

	/* Modal grid layout */
	.modal-grid {
		display: grid;
		grid-template-columns: 1fr;
	}

	@media (min-width: 768px) {
		.modal-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Images section */
	.images-section {
		background: var(--void-soft);
		padding: 1.5rem;
	}

	.main-image-container {
		aspect-ratio: 1;
		background: var(--void-soft);
		border: 1px solid var(--star-10);
		overflow: hidden;
	}

	.main-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Thumbnails */
	.thumbnails {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.thumbnail {
		width: 60px;
		height: 60px;
		padding: 0;
		border: 1px solid var(--star-10);
		background: var(--void-soft);
		cursor: pointer;
		overflow: hidden;
		transition: border-color 0.2s ease;
	}

	.thumbnail:hover {
		border-color: var(--star-30);
	}

	.thumbnail.active {
		border-color: var(--star-white);
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Details section */
	.details-section {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	@media (min-width: 768px) {
		.details-section {
			padding: 2.5rem;
		}
	}

	/* Category label */
	.category-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--star-50);
	}

	/* Product title */
	.product-title {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: 1.75rem;
		font-weight: 300;
		line-height: 1.1;
		color: var(--star-white);
		margin: 0;
	}

	@media (min-width: 768px) {
		.product-title {
			font-size: 2.25rem;
		}
	}

	/* Price */
	.price-container {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.price {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.25rem;
		color: var(--nebula-purple);
	}

	.price-alt {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: var(--star-50);
	}

	/* Description */
	.description {
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--star-70);
		margin: 0;
	}

	/* Variants */
	.variants-container {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.variant-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.variant-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--star-50);
	}

	.variant-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	/* Color swatches */
	.color-swatch {
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 50%;
		border: 2px solid transparent;
		background: var(--swatch-color);
		cursor: pointer;
		transition: all 0.2s ease;
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	.color-swatch:hover {
		outline-color: var(--star-30);
	}

	.color-swatch.active {
		outline-color: var(--star-white);
	}

	/* Variant text buttons */
	.variant-button {
		padding: 0.5rem 1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: transparent;
		border: 1px solid var(--star-10);
		color: var(--star-70);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.variant-button:hover {
		border-color: var(--star-30);
		color: var(--star-white);
	}

	.variant-button.active {
		background: var(--star-white);
		border-color: var(--star-white);
		color: var(--void-medium);
	}

	/* Quantity */
	.quantity-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.quantity-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--star-50);
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		gap: 0;
		border: 1px solid var(--star-10);
		width: fit-content;
	}

	.quantity-button {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: var(--star-70);
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.quantity-button:hover:not(:disabled) {
		background: var(--star-10);
		color: var(--star-white);
	}

	.quantity-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.quantity-value {
		width: 3rem;
		text-align: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
		color: var(--star-white);
		border-left: 1px solid var(--star-10);
		border-right: 1px solid var(--star-10);
		padding: 0.5rem 0;
	}

	/* Add to cart button */
	.add-to-cart-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background: transparent;
		border: 1px solid var(--star-10);
		color: var(--star-white);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-to-cart-button:hover {
		background: var(--star-white);
		border-color: var(--star-white);
		color: var(--void-medium);
	}

	.button-text {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.button-price {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.875rem;
	}

	/* Meta info */
	.meta-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid var(--star-10);
		margin-top: 0.5rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: var(--star-50);
	}

	.meta-item svg {
		flex-shrink: 0;
	}

	.meta-item span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>
