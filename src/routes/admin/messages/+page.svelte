<script lang="ts">
	import { onMount } from 'svelte';

	interface Message {
		id: string;
		name: string;
		email: string;
		message: string;
		read: boolean;
		created_at: string;
	}

	let messages = $state<Message[]>([]);
	let loading = $state(true);
	let selectedMessage = $state<Message | null>(null);

	onMount(async () => {
		await loadMessages();
	});

	async function loadMessages() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase
				.from('contact_messages')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			messages = data || [];
		} catch (err) {
			console.error('Failed to load messages:', err);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(message: Message) {
		if (message.read) return;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('contact_messages')
				.update({ read: true })
				.eq('id', message.id);

			if (error) throw error;

			messages = messages.map(m =>
				m.id === message.id ? { ...m, read: true } : m
			);
		} catch (err) {
			console.error('Failed to mark as read:', err);
		}
	}

	async function deleteMessage(message: Message) {
		if (!confirm('¿Eliminar este mensaje?')) return;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('contact_messages')
				.delete()
				.eq('id', message.id);

			if (error) throw error;

			messages = messages.filter(m => m.id !== message.id);
			if (selectedMessage?.id === message.id) {
				selectedMessage = null;
			}
		} catch (err) {
			console.error('Failed to delete message:', err);
		}
	}

	function selectMessage(message: Message) {
		selectedMessage = message;
		markAsRead(message);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('es-MX', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	let unreadCount = $derived(() => messages.filter(m => !m.read).length);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-display">Mensajes</h1>
			{#if unreadCount() > 0}
				<p class="text-white/50 text-sm">{unreadCount()} mensaje{unreadCount() !== 1 ? 's' : ''} sin leer</p>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="card-cosmic p-8">
			<div class="flex items-center justify-center gap-3">
				<svg class="animate-spin w-5 h-5 text-cosmic-gold" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-white/50">Cargando mensajes...</span>
			</div>
		</div>
	{:else if messages.length === 0}
		<div class="card-cosmic p-8 text-center">
			<svg class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
			</svg>
			<p class="text-white/50">No hay mensajes</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Messages List -->
			<div class="lg:col-span-1 space-y-2">
				{#each messages as message}
					<button
						onclick={() => selectMessage(message)}
						class="w-full text-left card-cosmic p-4 transition-colors {selectedMessage?.id === message.id ? 'border-cosmic-gold/50' : ''} {!message.read ? 'bg-white/5' : ''}"
					>
						<div class="flex items-start justify-between gap-2">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									{#if !message.read}
										<span class="w-2 h-2 rounded-full bg-cosmic-gold"></span>
									{/if}
									<p class="font-medium truncate">{message.name}</p>
								</div>
								<p class="text-white/50 text-sm truncate">{message.email}</p>
								<p class="text-white/30 text-sm mt-2 line-clamp-2">{message.message}</p>
							</div>
						</div>
						<p class="text-white/30 text-xs mt-2">{formatDate(message.created_at)}</p>
					</button>
				{/each}
			</div>

			<!-- Message Detail -->
			<div class="lg:col-span-2">
				{#if selectedMessage}
					<div class="card-cosmic p-6 space-y-6">
						<div class="flex items-start justify-between">
							<div>
								<h2 class="text-xl font-display">{selectedMessage.name}</h2>
								<a href="mailto:{selectedMessage.email}" class="text-cosmic-gold hover:underline">
									{selectedMessage.email}
								</a>
								<p class="text-white/30 text-sm mt-1">{formatDate(selectedMessage.created_at)}</p>
							</div>
							<div class="flex gap-2">
								<a
									href="mailto:{selectedMessage.email}?subject=Re: Mensaje de contacto - Fam Unic"
									class="btn-primary text-sm"
								>
									Responder
								</a>
								<button
									onclick={() => deleteMessage(selectedMessage)}
									class="p-2 rounded-lg border border-white/20 hover:bg-red-500/20 hover:border-red-500/30 text-white/50 hover:text-red-400 transition-colors"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>

						<div class="prose prose-invert prose-sm max-w-none">
							<p class="whitespace-pre-wrap text-white/80 leading-relaxed">
								{selectedMessage.message}
							</p>
						</div>
					</div>
				{:else}
					<div class="card-cosmic p-8 text-center">
						<svg class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
						</svg>
						<p class="text-white/50">Selecciona un mensaje para ver los detalles</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
