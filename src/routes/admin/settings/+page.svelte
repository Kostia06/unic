<script lang="ts">
	import { onMount } from 'svelte';

	// Store settings
	let storeName = $state('Fam Unic');
	let storeEmail = $state('');
	let storePhone = $state('');
	let instagramUrl = $state('');
	let facebookUrl = $state('');
	let tiktokUrl = $state('');
	let shippingInfo = $state('');
	let returnPolicy = $state('');

	// FAQs
	interface FAQ {
		id?: string;
		question_es: string;
		question_en: string;
		answer_es: string;
		answer_en: string;
		sort_order: number;
	}

	let faqs = $state<FAQ[]>([]);
	let editingFaq = $state<FAQ | null>(null);

	let loading = $state(true);
	let saving = $state(false);
	let activeTab = $state<'general' | 'faqs'>('general');

	onMount(async () => {
		await Promise.all([loadSettings(), loadFaqs()]);
		loading = false;
	});

	async function loadSettings() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data } = await supabase
				.from('store_settings')
				.select('*')
				.single();

			if (data) {
				storeName = data.store_name || 'Fam Unic';
				storeEmail = data.store_email || '';
				storePhone = data.store_phone || '';
				instagramUrl = data.instagram_url || '';
				facebookUrl = data.facebook_url || '';
				tiktokUrl = data.tiktok_url || '';
				shippingInfo = data.shipping_info || '';
				returnPolicy = data.return_policy || '';
			}
		} catch (err) {
			console.error('Failed to load settings:', err);
		}
	}

	async function loadFaqs() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data } = await supabase
				.from('faqs')
				.select('*')
				.order('sort_order');

			faqs = data || [];
		} catch (err) {
			console.error('Failed to load FAQs:', err);
		}
	}

	async function saveSettings() {
		saving = true;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('store_settings')
				.upsert({
					id: 1,
					store_name: storeName,
					store_email: storeEmail,
					store_phone: storePhone,
					instagram_url: instagramUrl,
					facebook_url: facebookUrl,
					tiktok_url: tiktokUrl,
					shipping_info: shippingInfo,
					return_policy: returnPolicy
				});

			if (error) throw error;
			alert('Configuración guardada');
		} catch (err) {
			console.error('Failed to save settings:', err);
			alert('Error al guardar');
		} finally {
			saving = false;
		}
	}

	function startEditFaq(faq?: FAQ) {
		editingFaq = faq || {
			question_es: '',
			question_en: '',
			answer_es: '',
			answer_en: '',
			sort_order: faqs.length
		};
	}

	async function saveFaq() {
		if (!editingFaq) return;
		saving = true;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			if (editingFaq.id) {
				// Update
				const { error } = await supabase
					.from('faqs')
					.update({
						question_es: editingFaq.question_es,
						question_en: editingFaq.question_en,
						answer_es: editingFaq.answer_es,
						answer_en: editingFaq.answer_en,
						sort_order: editingFaq.sort_order
					})
					.eq('id', editingFaq.id);

				if (error) throw error;
			} else {
				// Insert
				const { error } = await supabase
					.from('faqs')
					.insert({
						question_es: editingFaq.question_es,
						question_en: editingFaq.question_en,
						answer_es: editingFaq.answer_es,
						answer_en: editingFaq.answer_en,
						sort_order: editingFaq.sort_order
					});

				if (error) throw error;
			}

			await loadFaqs();
			editingFaq = null;
		} catch (err) {
			console.error('Failed to save FAQ:', err);
		} finally {
			saving = false;
		}
	}

	async function deleteFaq(faq: FAQ) {
		if (!faq.id || !confirm('¿Eliminar esta pregunta?')) return;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('faqs')
				.delete()
				.eq('id', faq.id);

			if (error) throw error;
			await loadFaqs();
		} catch (err) {
			console.error('Failed to delete FAQ:', err);
		}
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-display">Configuración</h1>

	<!-- Tabs -->
	<div class="flex gap-4 border-b border-white/10">
		<button
			onclick={() => (activeTab = 'general')}
			class="pb-3 px-1 text-sm transition-colors border-b-2 -mb-px {activeTab === 'general' ? 'border-cosmic-gold text-cosmic-gold' : 'border-transparent text-white/50 hover:text-white'}"
		>
			General
		</button>
		<button
			onclick={() => (activeTab = 'faqs')}
			class="pb-3 px-1 text-sm transition-colors border-b-2 -mb-px {activeTab === 'faqs' ? 'border-cosmic-gold text-cosmic-gold' : 'border-transparent text-white/50 hover:text-white'}"
		>
			Preguntas Frecuentes
		</button>
	</div>

	{#if loading}
		<div class="card-cosmic p-8">
			<div class="flex items-center justify-center gap-3">
				<svg class="animate-spin w-5 h-5 text-cosmic-gold" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-white/50">Cargando...</span>
			</div>
		</div>
	{:else if activeTab === 'general'}
		<!-- General Settings -->
		<form onsubmit={(e) => { e.preventDefault(); saveSettings(); }} class="space-y-6">
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-lg font-display">Información de la Tienda</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="storeName" class="block text-sm text-white/70 mb-2">Nombre de la Tienda</label>
						<input
							type="text"
							id="storeName"
							bind:value={storeName}
							class="input-cosmic w-full"
						/>
					</div>

					<div>
						<label for="storeEmail" class="block text-sm text-white/70 mb-2">Email de Contacto</label>
						<input
							type="email"
							id="storeEmail"
							bind:value={storeEmail}
							class="input-cosmic w-full"
							placeholder="contacto@famunic.com"
						/>
					</div>

					<div>
						<label for="storePhone" class="block text-sm text-white/70 mb-2">Teléfono</label>
						<input
							type="tel"
							id="storePhone"
							bind:value={storePhone}
							class="input-cosmic w-full"
							placeholder="+52 55 1234 5678"
						/>
					</div>
				</div>
			</div>

			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-lg font-display">Redes Sociales</h2>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label for="instagram" class="block text-sm text-white/70 mb-2">Instagram</label>
						<input
							type="url"
							id="instagram"
							bind:value={instagramUrl}
							class="input-cosmic w-full"
							placeholder="https://instagram.com/famunic"
						/>
					</div>

					<div>
						<label for="facebook" class="block text-sm text-white/70 mb-2">Facebook</label>
						<input
							type="url"
							id="facebook"
							bind:value={facebookUrl}
							class="input-cosmic w-full"
							placeholder="https://facebook.com/famunic"
						/>
					</div>

					<div>
						<label for="tiktok" class="block text-sm text-white/70 mb-2">TikTok</label>
						<input
							type="url"
							id="tiktok"
							bind:value={tiktokUrl}
							class="input-cosmic w-full"
							placeholder="https://tiktok.com/@famunic"
						/>
					</div>
				</div>
			</div>

			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-lg font-display">Políticas</h2>

				<div>
					<label for="shipping" class="block text-sm text-white/70 mb-2">Información de Envío</label>
					<textarea
						id="shipping"
						bind:value={shippingInfo}
						rows="4"
						class="input-cosmic w-full resize-none"
						placeholder="Describe las opciones de envío, tiempos de entrega, etc."
					></textarea>
				</div>

				<div>
					<label for="returns" class="block text-sm text-white/70 mb-2">Política de Devoluciones</label>
					<textarea
						id="returns"
						bind:value={returnPolicy}
						rows="4"
						class="input-cosmic w-full resize-none"
						placeholder="Describe las políticas de devolución y cambios."
					></textarea>
				</div>
			</div>

			<div class="flex justify-end">
				<button
					type="submit"
					disabled={saving}
					class="btn-primary disabled:opacity-50"
				>
					{saving ? 'Guardando...' : 'Guardar Configuración'}
				</button>
			</div>
		</form>
	{:else}
		<!-- FAQs -->
		<div class="space-y-6">
			<div class="flex justify-end">
				<button onclick={() => startEditFaq()} class="btn-primary inline-flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
					</svg>
					Nueva Pregunta
				</button>
			</div>

			{#if editingFaq}
				<div class="card-cosmic p-6 space-y-4">
					<h2 class="text-lg font-display">{editingFaq.id ? 'Editar' : 'Nueva'} Pregunta</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm text-white/70 mb-2">Pregunta (Español) *</label>
							<input
								type="text"
								bind:value={editingFaq.question_es}
								class="input-cosmic w-full"
								placeholder="¿Cuánto tarda el envío?"
							/>
						</div>

						<div>
							<label class="block text-sm text-white/70 mb-2">Pregunta (Inglés)</label>
							<input
								type="text"
								bind:value={editingFaq.question_en}
								class="input-cosmic w-full"
								placeholder="How long does shipping take?"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm text-white/70 mb-2">Respuesta (Español) *</label>
							<textarea
								bind:value={editingFaq.answer_es}
								rows="4"
								class="input-cosmic w-full resize-none"
								placeholder="Los envíos nacionales toman..."
							></textarea>
						</div>

						<div>
							<label class="block text-sm text-white/70 mb-2">Respuesta (Inglés)</label>
							<textarea
								bind:value={editingFaq.answer_en}
								rows="4"
								class="input-cosmic w-full resize-none"
								placeholder="Domestic shipping takes..."
							></textarea>
						</div>
					</div>

					<div class="flex gap-4">
						<button
							type="button"
							onclick={saveFaq}
							disabled={saving || !editingFaq.question_es || !editingFaq.answer_es}
							class="btn-primary disabled:opacity-50"
						>
							{saving ? 'Guardando...' : 'Guardar'}
						</button>
						<button
							type="button"
							onclick={() => (editingFaq = null)}
							class="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5"
						>
							Cancelar
						</button>
					</div>
				</div>
			{/if}

			{#if faqs.length === 0}
				<div class="card-cosmic p-8 text-center">
					<svg class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-white/50">No hay preguntas frecuentes</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each faqs as faq, i}
						<div class="card-cosmic p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<p class="font-medium">{faq.question_es}</p>
									{#if faq.question_en}
										<p class="text-white/50 text-sm">{faq.question_en}</p>
									{/if}
									<p class="text-white/70 text-sm mt-2">{faq.answer_es}</p>
								</div>
								<div class="flex gap-2">
									<button
										onclick={() => startEditFaq(faq)}
										class="p-2 rounded-lg hover:bg-white/10 transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</button>
									<button
										onclick={() => deleteFaq(faq)}
										class="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
