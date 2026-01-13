<script lang="ts">
	import { onMount } from 'svelte';
	import type { Product } from '$types';

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let searchQuery = $state('');
	let categoryFilter = $state('all');

	// Filtered products
	let filteredProducts = $derived(() => {
		let result = products;

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(p =>
				p.name.toLowerCase().includes(query) ||
				p.slug.toLowerCase().includes(query)
			);
		}

		if (categoryFilter !== 'all') {
			result = result.filter(p => p.category === categoryFilter);
		}

		return result;
	});

	// Get unique categories
	let categories = $derived(() => {
		const cats = new Set(products.map(p => p.category));
		return ['all', ...Array.from(cats)];
	});

	onMount(async () => {
		await loadProducts();
	});

	async function loadProducts() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase
				.from('products')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			products = data || [];
		} catch (err) {
			console.error('Failed to load products:', err);
		} finally {
			loading = false;
		}
	}

	async function toggleActive(product: Product) {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('products')
				.update({ is_active: !product.is_active })
				.eq('id', product.id);

			if (error) throw error;

			// Update local state
			products = products.map(p =>
				p.id === product.id ? { ...p, is_active: !p.is_active } : p
			);
		} catch (err) {
			console.error('Failed to toggle product:', err);
		}
	}

	async function deleteProduct(product: Product) {
		if (!confirm(`¿Eliminar "${product.name}"?`)) return;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('products')
				.delete()
				.eq('id', product.id);

			if (error) throw error;

			products = products.filter(p => p.id !== product.id);
		} catch (err) {
			console.error('Failed to delete product:', err);
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN'
		}).format(amount);
	}

	const categoryLabels: Record<string, string> = {
		all: 'Todas',
		rings: 'Anillos',
		necklaces: 'Collares',
		earrings: 'Aretes',
		bracelets: 'Pulseras'
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<h1 class="text-2xl font-display">Productos</h1>
		<a href="/admin/products/new" class="btn-primary inline-flex items-center gap-2">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
			</svg>
			Nuevo Producto
		</a>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4">
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Buscar productos..."
				class="input-cosmic w-full"
			/>
		</div>
		<div>
			<select
				bind:value={categoryFilter}
				class="input-cosmic bg-cosmic-deep"
			>
				{#each categories() as cat}
					<option value={cat}>{categoryLabels[cat] || cat}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Products Table -->
	{#if loading}
		<div class="card-cosmic p-8">
			<div class="flex items-center justify-center gap-3">
				<svg class="animate-spin w-5 h-5 text-cosmic-gold" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-white/50">Cargando productos...</span>
			</div>
		</div>
	{:else if filteredProducts().length === 0}
		<div class="card-cosmic p-8 text-center">
			<svg class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
			</svg>
			{#if searchQuery || categoryFilter !== 'all'}
				<p class="text-white/50">No se encontraron productos</p>
				<button
					onclick={() => { searchQuery = ''; categoryFilter = 'all'; }}
					class="text-cosmic-gold text-sm mt-2 hover:underline"
				>
					Limpiar filtros
				</button>
			{:else}
				<p class="text-white/50 mb-4">No hay productos aún</p>
				<a href="/admin/products/new" class="btn-primary">
					Crear primer producto
				</a>
			{/if}
		</div>
	{:else}
		<div class="card-cosmic overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-white/10 bg-white/5">
							<th class="text-left text-white/50 text-sm font-normal p-4">Producto</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Categoría</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Precio Base</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Stock</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Estado</th>
							<th class="text-right text-white/50 text-sm font-normal p-4">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredProducts() as product}
							<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
								<td class="p-4">
									<div class="flex items-center gap-3">
										<div class="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
											{#if product.images?.[0]}
												<img
													src={product.images[0]}
													alt={product.name}
													class="w-full h-full object-cover"
												/>
											{/if}
										</div>
										<div>
											<p class="font-medium">{product.name}</p>
											<p class="text-white/50 text-sm">{product.slug}</p>
										</div>
									</div>
								</td>
								<td class="p-4">
									<span class="px-2 py-1 rounded-full text-xs bg-white/10">
										{categoryLabels[product.category] || product.category}
									</span>
								</td>
								<td class="p-4">{formatCurrency(product.base_price_mxn)}</td>
								<td class="p-4">
									{#if product.stock !== null}
										<span class={product.stock < 5 ? 'text-red-400' : ''}>
											{product.stock}
										</span>
									{:else}
										<span class="text-white/30">∞</span>
									{/if}
								</td>
								<td class="p-4">
									<button
										onclick={() => toggleActive(product)}
										class="px-2 py-1 rounded-full text-xs transition-colors {product.is_active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-white/10 text-white/50 hover:bg-white/20'}"
									>
										{product.is_active ? 'Activo' : 'Inactivo'}
									</button>
								</td>
								<td class="p-4">
									<div class="flex items-center justify-end gap-2">
										<a
											href="/admin/products/{product.id}"
											class="p-2 rounded-lg hover:bg-white/10 transition-colors"
											title="Editar"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</a>
										<button
											onclick={() => deleteProduct(product)}
											class="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
											title="Eliminar"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<p class="text-white/30 text-sm text-center">
			{filteredProducts().length} producto{filteredProducts().length !== 1 ? 's' : ''}
		</p>
	{/if}
</div>
