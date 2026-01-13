<script lang="ts">
	import type { Product } from '$types';
	import { language, getLocalizedName } from '$stores/language.svelte';
	import { t } from '$utils/i18n';
	import { mockProducts, productCategories } from '$data/products';
	import ProductCard from './ProductCard.svelte';
	import ProductModal from './ProductModal.svelte';

	// State
	let selectedCategory = $state('all');
	let sortBy = $state('newest');
	let visibleCount = $state(8);
	let selectedProduct = $state<Product | null>(null);
	let isModalOpen = $state(false);

	// Filtered and sorted products
	let filteredProducts = $derived.by(() => {
		let products = [...mockProducts];

		// Filter by category
		if (selectedCategory !== 'all') {
			products = products.filter((p) => p.category === selectedCategory);
		}

		// Sort
		switch (sortBy) {
			case 'priceAsc':
				products.sort((a, b) => a.base_price_mxn - b.base_price_mxn);
				break;
			case 'priceDesc':
				products.sort((a, b) => b.base_price_mxn - a.base_price_mxn);
				break;
			case 'name':
				products.sort((a, b) => getLocalizedName(a).localeCompare(getLocalizedName(b)));
				break;
			// 'newest' is default order
		}

		return products;
	});

	let displayedProducts = $derived(filteredProducts.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < filteredProducts.length);

	// Hierarchical card sizing - creates visual hierarchy
	// 'hero' = largest featured item (spans full width, tall)
	// 'featured' = prominent secondary items (half width, tall)
	// 'standard' = regular items (half width, normal height)
	function getCardSize(index: number): 'hero' | 'featured' | 'standard' {
		// First item is always hero
		if (index === 0) return 'hero';

		// Create a repeating hierarchical pattern for remaining items
		const patternIndex = (index - 1) % 6;
		const pattern: ('featured' | 'standard')[] = [
			'featured',  // 1: prominent left
			'standard',  // 2: normal right
			'standard',  // 3: normal left
			'featured',  // 4: prominent right
			'standard',  // 5: normal left
			'standard',  // 6: normal right
		];
		return pattern[patternIndex];
	}

	function loadMore() {
		visibleCount += 4;
	}

	function openProductModal(product: Product) {
		selectedProduct = product;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		setTimeout(() => {
			selectedProduct = null;
		}, 300);
	}

	// Get localized category label
	function getCategoryLabel(category: (typeof productCategories)[0]) {
		return language.current === 'en' ? category.label_en : category.label_es;
	}
</script>

<section id="products" class="products-section">
	<!-- Section header - Split layout -->
	<header class="section-header">
		<div class="header-left">
			<h2 class="section-title">
				Descubre
				<span class="title-script">nuestra</span>
				coleccion
			</h2>
		</div>
		<div class="header-right">
			<p class="section-subtitle">
				{t(language.current, 'products.subtitle')}
			</p>
		</div>
	</header>

	<!-- Filters and sort -->
	<div class="filters-container">
		<!-- Category filters -->
		<nav class="category-filters" aria-label="Product categories">
			{#each productCategories as category (category.value)}
				<button
					onclick={() => {
						selectedCategory = category.value;
						visibleCount = 8;
					}}
					class="category-filter"
					class:active={selectedCategory === category.value}
					aria-pressed={selectedCategory === category.value}
				>
					{getCategoryLabel(category)}
				</button>
			{/each}
		</nav>

		<!-- Sort dropdown -->
		<div class="sort-container">
			<label for="sort-select" class="sort-label">
				{t(language.current, 'products.sort')}
			</label>
			<select
				id="sort-select"
				bind:value={sortBy}
				class="sort-select"
			>
				<option value="newest">{t(language.current, 'products.sortOptions.newest')}</option>
				<option value="priceAsc">{t(language.current, 'products.sortOptions.priceAsc')}</option>
				<option value="priceDesc">{t(language.current, 'products.sortOptions.priceDesc')}</option>
				<option value="name">{t(language.current, 'products.sortOptions.name')}</option>
			</select>
		</div>
	</div>

	<!-- Product grid -->
	{#if displayedProducts.length > 0}
		<div class="product-grid">
			{#each displayedProducts as product, index (product.id)}
				{@const size = getCardSize(index)}
				<div
					class="product-card-wrapper"
					class:size-hero={size === 'hero'}
					class:size-featured={size === 'featured'}
					class:size-standard={size === 'standard'}
				>
					<ProductCard
						{product}
						{index}
						onViewDetails={openProductModal}
						{size}
					/>
				</div>
			{/each}
		</div>

		<!-- Load more button -->
		{#if hasMore}
			<div class="load-more-container">
				<button
					onclick={loadMore}
					class="load-more-btn"
				>
					<span>{t(language.current, 'products.loadMore')}</span>
					<svg class="load-more-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</button>
			</div>
		{/if}
	{:else}
		<!-- Empty state -->
		<div class="empty-state">
			<svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
			<p class="empty-text">{t(language.current, 'products.noProducts')}</p>
		</div>
	{/if}
</section>

<!-- Product Modal -->
{#if selectedProduct}
	<ProductModal
		product={selectedProduct}
		open={isModalOpen}
		onClose={closeModal}
	/>
{/if}

<style>
	/* Section container */
	.products-section {
		max-width: 1440px;
		margin: 0 auto;
		padding: 6rem 2rem;
	}

	/* Section header - Split layout */
	.section-header {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 4rem;
	}

	@media (min-width: 768px) {
		.section-header {
			grid-template-columns: 1fr 1fr;
			align-items: end;
		}
	}

	.section-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 400;
		color: var(--white, #ffffff);
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.title-script {
		font-family: 'Pinyon Script', cursive;
		color: var(--accent-purple, #8b5cf6);
		font-size: 1.1em;
	}

	.section-subtitle {
		font-size: 1rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		max-width: 400px;
		margin: 0;
		line-height: 1.7;
	}

	/* Filters container */
	.filters-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--white-10, rgba(255, 255, 255, 0.1));
	}

	@media (min-width: 640px) {
		.filters-container {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	/* Category filters */
	.category-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.category-filter {
		position: relative;
		background: none;
		border: none;
		padding: 0;
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		cursor: pointer;
		transition: color 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.category-filter::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 100%;
		height: 1px;
		background: var(--accent-purple, #8b5cf6);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.category-filter:hover {
		color: var(--white-70, rgba(255, 255, 255, 0.7));
	}

	.category-filter.active {
		color: var(--white, #ffffff);
	}

	.category-filter.active::after {
		transform: scaleX(1);
	}

	/* Sort dropdown */
	.sort-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.sort-label {
		font-size: 0.75rem;
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.sort-select {
		appearance: none;
		background: transparent;
		border: 1px solid var(--white-30, rgba(255, 255, 255, 0.3));
		border-radius: 0;
		padding: 0.5rem 2rem 0.5rem 0.75rem;
		font-family: 'Inter', system-ui, sans-serif;
		font-size: 0.875rem;
		color: var(--white, #ffffff);
		cursor: pointer;
		transition: border-color 0.3s ease;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff80'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
		background-size: 1rem;
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
	}

	.sort-select:hover,
	.sort-select:focus {
		border-color: var(--accent-purple, #8b5cf6);
		outline: none;
	}

	.sort-select option {
		background: var(--navy-deep, #001a4d);
		color: var(--white, #ffffff);
	}

	/* Hierarchical product grid */
	.product-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.product-grid {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 320px;
			gap: 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.product-grid {
			grid-auto-rows: 380px;
			gap: 2rem;
		}
	}

	/* Card wrapper base */
	.product-card-wrapper {
		min-height: 300px;
	}

	/* Mobile: all cards full width */
	@media (max-width: 639px) {
		.product-card-wrapper.size-hero {
			min-height: 450px;
		}

		.product-card-wrapper.size-featured {
			min-height: 380px;
		}

		.product-card-wrapper.size-standard {
			min-height: 300px;
		}
	}

	/* Tablet and up: hierarchical layout */
	@media (min-width: 640px) {
		/* Hero: full width, extra tall - the main focus */
		.product-card-wrapper.size-hero {
			grid-column: span 2;
			grid-row: span 2;
		}

		/* Featured: half width, tall - secondary prominence */
		.product-card-wrapper.size-featured {
			grid-column: span 1;
			grid-row: span 2;
		}

		/* Standard: half width, normal height */
		.product-card-wrapper.size-standard {
			grid-column: span 1;
			grid-row: span 1;
		}
	}

	/* Load more button */
	.load-more-container {
		display: flex;
		justify-content: center;
		margin-top: 4rem;
	}

	.load-more-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: transparent;
		border: 1px solid var(--white-30, rgba(255, 255, 255, 0.3));
		color: var(--white, #ffffff);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.load-more-btn:hover {
		border-color: var(--white, #ffffff);
		background: var(--white, #ffffff);
		color: var(--navy-deepest, #001239);
	}

	.load-more-icon {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform 0.3s ease;
	}

	.load-more-btn:hover .load-more-icon {
		transform: translateY(4px);
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 6rem 2rem;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		color: var(--white-30, rgba(255, 255, 255, 0.3));
		margin: 0 auto 1.5rem;
	}

	.empty-text {
		color: var(--white-50, rgba(255, 255, 255, 0.5));
		font-size: 1rem;
		margin: 0;
	}
</style>
