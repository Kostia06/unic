<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const productId = $page.params.id;

	// Form state
	let name = $state('');
	let slug = $state('');
	let description = $state('');
	let category = $state('rings');
	let basePriceMxn = $state(0);
	let stock = $state<number | null>(null);
	let isActive = $state(true);
	let imageUrl = $state('');
	let images = $state<string[]>([]);
	let variantTypes = $state<Array<{ name: string; options: Array<{ value: string; priceAdjustment: number }> }>>([]);

	let loading = $state(true);
	let saving = $state(false);
	let error = $state('');

	onMount(async () => {
		await loadProduct();
	});

	async function loadProduct() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error: dbError } = await supabase
				.from('products')
				.select('*')
				.eq('id', productId)
				.single();

			if (dbError) throw dbError;

			if (data) {
				name = data.name;
				slug = data.slug;
				description = data.description || '';
				category = data.category;
				basePriceMxn = data.base_price_mxn;
				stock = data.stock;
				isActive = data.is_active;
				images = data.images || [];
				variantTypes = (data.variant_types || []).map((t: any) => ({
					name: t.name,
					options: (t.options || []).map((o: any) => ({
						value: o.value,
						priceAdjustment: o.price_adjustment || 0
					}))
				}));
			}
		} catch (err) {
			console.error('Failed to load product:', err);
			error = 'Error al cargar el producto';
		} finally {
			loading = false;
		}
	}

	function addImage() {
		if (imageUrl && !images.includes(imageUrl)) {
			images = [...images, imageUrl];
			imageUrl = '';
		}
	}

	function removeImage(url: string) {
		images = images.filter(i => i !== url);
	}

	function addVariantType() {
		variantTypes = [
			...variantTypes,
			{ name: '', options: [{ value: '', priceAdjustment: 0 }] }
		];
	}

	function removeVariantType(index: number) {
		variantTypes = variantTypes.filter((_, i) => i !== index);
	}

	function addVariantOption(typeIndex: number) {
		variantTypes = variantTypes.map((type, i) =>
			i === typeIndex
				? { ...type, options: [...type.options, { value: '', priceAdjustment: 0 }] }
				: type
		);
	}

	function removeVariantOption(typeIndex: number, optionIndex: number) {
		variantTypes = variantTypes.map((type, i) =>
			i === typeIndex
				? { ...type, options: type.options.filter((_, j) => j !== optionIndex) }
				: type
		);
	}

	function updateVariantTypeName(index: number, value: string) {
		variantTypes = variantTypes.map((type, i) =>
			i === index ? { ...type, name: value } : type
		);
	}

	function updateVariantOption(typeIndex: number, optionIndex: number, field: 'value' | 'priceAdjustment', value: string | number) {
		variantTypes = variantTypes.map((type, i) =>
			i === typeIndex
				? {
					...type,
					options: type.options.map((opt, j) =>
						j === optionIndex ? { ...opt, [field]: value } : opt
					)
				}
				: type
		);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		saving = true;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			// Clean up variant types
			const cleanedVariantTypes = variantTypes
				.filter(t => t.name.trim())
				.map(t => ({
					name: t.name.trim(),
					options: t.options
						.filter(o => o.value.trim())
						.map(o => ({
							value: o.value.trim(),
							price_adjustment: o.priceAdjustment
						}))
				}));

			const { error: dbError } = await supabase
				.from('products')
				.update({
					name: name.trim(),
					slug: slug.trim(),
					description: description.trim() || null,
					category,
					base_price_mxn: basePriceMxn,
					stock,
					is_active: isActive,
					images,
					variant_types: cleanedVariantTypes
				})
				.eq('id', productId);

			if (dbError) throw dbError;

			goto('/admin/products');
		} catch (err: any) {
			console.error('Failed to update product:', err);
			error = err.message || 'Error al actualizar el producto';
		} finally {
			saving = false;
		}
	}

	const categories = [
		{ value: 'rings', label: 'Anillos' },
		{ value: 'necklaces', label: 'Collares' },
		{ value: 'earrings', label: 'Aretes' },
		{ value: 'bracelets', label: 'Pulseras' }
	];
</script>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/admin/products" class="p-2 rounded-lg hover:bg-white/10 transition-colors">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-2xl font-display">Editar Producto</h1>
	</div>

	{#if loading}
		<div class="card-cosmic p-8">
			<div class="flex items-center justify-center gap-3">
				<svg class="animate-spin w-5 h-5 text-cosmic-gold" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-white/50">Cargando producto...</span>
			</div>
		</div>
	{:else}
		{#if error}
			<div class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
				{error}
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Basic Info -->
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-lg font-display">Información Básica</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="name" class="block text-sm text-white/70 mb-2">Nombre *</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="input-cosmic w-full"
						/>
					</div>

					<div>
						<label for="slug" class="block text-sm text-white/70 mb-2">Slug *</label>
						<input
							type="text"
							id="slug"
							bind:value={slug}
							required
							class="input-cosmic w-full"
						/>
					</div>
				</div>

				<div>
					<label for="description" class="block text-sm text-white/70 mb-2">Descripción</label>
					<textarea
						id="description"
						bind:value={description}
						rows="4"
						class="input-cosmic w-full resize-none"
					></textarea>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label for="category" class="block text-sm text-white/70 mb-2">Categoría *</label>
						<select id="category" bind:value={category} class="input-cosmic w-full bg-cosmic-deep">
							{#each categories as cat}
								<option value={cat.value}>{cat.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="price" class="block text-sm text-white/70 mb-2">Precio Base (MXN) *</label>
						<input
							type="number"
							id="price"
							bind:value={basePriceMxn}
							required
							min="0"
							step="0.01"
							class="input-cosmic w-full"
						/>
					</div>

					<div>
						<label for="stock" class="block text-sm text-white/70 mb-2">Stock</label>
						<input
							type="number"
							id="stock"
							bind:value={stock}
							min="0"
							class="input-cosmic w-full"
							placeholder="Ilimitado"
						/>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<input
						type="checkbox"
						id="active"
						bind:checked={isActive}
						class="w-4 h-4 rounded border-white/20 bg-white/5 text-cosmic-gold focus:ring-cosmic-gold"
					/>
					<label for="active" class="text-sm text-white/70">Producto activo (visible en tienda)</label>
				</div>
			</div>

			<!-- Images -->
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-lg font-display">Imágenes</h2>

				<div class="flex gap-2">
					<input
						type="url"
						bind:value={imageUrl}
						class="input-cosmic flex-1"
						placeholder="https://example.com/image.jpg"
					/>
					<button
						type="button"
						onclick={addImage}
						class="btn-primary px-4"
					>
						Agregar
					</button>
				</div>

				{#if images.length > 0}
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						{#each images as image, i}
							<div class="relative group">
								<img
									src={image}
									alt="Product {i + 1}"
									class="w-full aspect-square object-cover rounded-lg"
								/>
								<button
									type="button"
									onclick={() => removeImage(image)}
									class="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
								{#if i === 0}
									<span class="absolute bottom-2 left-2 px-2 py-1 rounded text-xs bg-cosmic-gold/80 text-cosmic-void">
										Principal
									</span>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-white/30 text-sm text-center py-4">
						No hay imágenes agregadas
					</p>
				{/if}
			</div>

			<!-- Variants -->
			<div class="card-cosmic p-6 space-y-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-display">Variantes</h2>
					<button
						type="button"
						onclick={addVariantType}
						class="text-cosmic-gold text-sm hover:underline"
					>
						+ Agregar tipo de variante
					</button>
				</div>

				{#if variantTypes.length === 0}
					<p class="text-white/30 text-sm text-center py-4">
						No hay variantes configuradas
					</p>
				{:else}
					<div class="space-y-6">
						{#each variantTypes as variantType, typeIndex}
							<div class="p-4 rounded-lg bg-white/5 space-y-4">
								<div class="flex items-center justify-between gap-4">
									<input
										type="text"
										value={variantType.name}
										oninput={(e) => updateVariantTypeName(typeIndex, e.currentTarget.value)}
										class="input-cosmic flex-1"
										placeholder="Nombre del tipo (ej: Material)"
									/>
									<button
										type="button"
										onclick={() => removeVariantType(typeIndex)}
										class="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>

								<div class="space-y-2">
									{#each variantType.options as option, optionIndex}
										<div class="flex items-center gap-2">
											<input
												type="text"
												value={option.value}
												oninput={(e) => updateVariantOption(typeIndex, optionIndex, 'value', e.currentTarget.value)}
												class="input-cosmic flex-1"
												placeholder="Opción (ej: Oro 14k)"
											/>
											<input
												type="number"
												value={option.priceAdjustment}
												oninput={(e) => updateVariantOption(typeIndex, optionIndex, 'priceAdjustment', parseFloat(e.currentTarget.value) || 0)}
												class="input-cosmic w-32"
												placeholder="+/- precio"
											/>
											<button
												type="button"
												onclick={() => removeVariantOption(typeIndex, optionIndex)}
												class="p-2 text-white/30 hover:text-red-400 transition-colors"
												disabled={variantType.options.length === 1}
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										</div>
									{/each}
								</div>

								<button
									type="button"
									onclick={() => addVariantOption(typeIndex)}
									class="text-cosmic-gold text-sm hover:underline"
								>
									+ Agregar opción
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Submit -->
			<div class="flex justify-end gap-4">
				<a href="/admin/products" class="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors">
					Cancelar
				</a>
				<button
					type="submit"
					disabled={saving}
					class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if saving}
						<svg class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Guardando...
					{:else}
						Guardar Cambios
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
