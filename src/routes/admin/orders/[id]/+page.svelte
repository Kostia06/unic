<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const orderId = $page.params.id;

	interface Order {
		id: string;
		order_number: string;
		customer_email: string;
		customer_phone: string | null;
		shipping_address: any;
		items: any[];
		subtotal_mxn: number;
		currency_charged: string;
		amount_charged: number;
		payment_status: string;
		order_status: string;
		stripe_payment_intent_id: string | null;
		admin_notes: string | null;
		created_at: string;
		updated_at: string;
	}

	let order = $state<Order | null>(null);
	let loading = $state(true);
	let saving = $state(false);
	let adminNotes = $state('');

	onMount(async () => {
		await loadOrder();
	});

	async function loadOrder() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.eq('id', orderId)
				.single();

			if (error) throw error;
			order = data;
			adminNotes = data.admin_notes || '';
		} catch (err) {
			console.error('Failed to load order:', err);
		} finally {
			loading = false;
		}
	}

	async function updateStatus(newStatus: string) {
		if (!order) return;
		saving = true;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('orders')
				.update({ order_status: newStatus })
				.eq('id', orderId);

			if (error) throw error;
			order = { ...order, order_status: newStatus };
		} catch (err) {
			console.error('Failed to update status:', err);
		} finally {
			saving = false;
		}
	}

	async function saveNotes() {
		if (!order) return;
		saving = true;

		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { error } = await supabase
				.from('orders')
				.update({ admin_notes: adminNotes || null })
				.eq('id', orderId);

			if (error) throw error;
			order = { ...order, admin_notes: adminNotes || null };
		} catch (err) {
			console.error('Failed to save notes:', err);
		} finally {
			saving = false;
		}
	}

	function formatCurrency(amount: number, currency = 'MXN'): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency
		}).format(amount);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('es-MX', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
			case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
			default: return 'bg-white/10 text-white/70 border-white/20';
		}
	}

	function getPaymentStatusColor(status: string): string {
		switch (status) {
			case 'pending': return 'bg-yellow-500/20 text-yellow-400';
			case 'succeeded': return 'bg-green-500/20 text-green-400';
			case 'failed': return 'bg-red-500/20 text-red-400';
			case 'refunded': return 'bg-purple-500/20 text-purple-400';
			default: return 'bg-white/10 text-white/70';
		}
	}

	const statusLabels: Record<string, string> = {
		new: 'Nuevo',
		processing: 'Procesando',
		shipped: 'Enviado',
		delivered: 'Entregado',
		cancelled: 'Cancelado'
	};

	const paymentLabels: Record<string, string> = {
		pending: 'Pendiente',
		succeeded: 'Pagado',
		failed: 'Fallido',
		refunded: 'Reembolsado'
	};

	const statuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
</script>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/admin/orders" class="p-2 rounded-lg hover:bg-white/10 transition-colors">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<div>
			<h1 class="text-2xl font-display">Pedido {order?.order_number || ''}</h1>
			{#if order}
				<p class="text-white/50 text-sm">{formatDate(order.created_at)}</p>
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
				<span class="text-white/50">Cargando pedido...</span>
			</div>
		</div>
	{:else if !order}
		<div class="card-cosmic p-8 text-center">
			<p class="text-white/50">Pedido no encontrado</p>
		</div>
	{:else}
		<!-- Status Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Order Status -->
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-sm text-white/50">Estado del Pedido</h2>
				<div class="flex flex-wrap gap-2">
					{#each statuses as status}
						<button
							onclick={() => updateStatus(status)}
							disabled={saving}
							class="px-3 py-2 rounded-lg text-sm border transition-colors {order.order_status === status ? getStatusColor(status) + ' border' : 'border-white/10 text-white/50 hover:border-white/30'}"
						>
							{statusLabels[status]}
						</button>
					{/each}
				</div>
			</div>

			<!-- Payment Status -->
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-sm text-white/50">Estado del Pago</h2>
				<div class="flex items-center gap-4">
					<span class="px-3 py-2 rounded-lg text-sm {getPaymentStatusColor(order.payment_status)}">
						{paymentLabels[order.payment_status] || order.payment_status}
					</span>
					{#if order.stripe_payment_intent_id}
						<a
							href="https://dashboard.stripe.com/payments/{order.stripe_payment_intent_id}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-cosmic-gold text-sm hover:underline"
						>
							Ver en Stripe →
						</a>
					{/if}
				</div>
				<div class="text-2xl font-display">
					{formatCurrency(order.amount_charged, order.currency_charged)}
				</div>
				{#if order.currency_charged !== 'MXN'}
					<p class="text-white/30 text-sm">
						{formatCurrency(order.subtotal_mxn, 'MXN')} MXN
					</p>
				{/if}
			</div>
		</div>

		<!-- Customer Info -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-sm text-white/50">Contacto</h2>
				<div class="space-y-2">
					<p>
						<a href="mailto:{order.customer_email}" class="text-cosmic-gold hover:underline">
							{order.customer_email}
						</a>
					</p>
					{#if order.customer_phone}
						<p>
							<a href="tel:{order.customer_phone}" class="text-white/70 hover:text-white">
								{order.customer_phone}
							</a>
						</p>
					{/if}
				</div>
			</div>

			<div class="card-cosmic p-6 space-y-4">
				<h2 class="text-sm text-white/50">Dirección de Envío</h2>
				{#if order.shipping_address}
					<div class="space-y-1 text-white/70">
						<p class="text-white">{order.shipping_address.full_name}</p>
						<p>{order.shipping_address.address_line1}</p>
						{#if order.shipping_address.address_line2}
							<p>{order.shipping_address.address_line2}</p>
						{/if}
						<p>
							{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
						</p>
						<p>{order.shipping_address.country}</p>
					</div>
				{:else}
					<p class="text-white/30">Sin dirección</p>
				{/if}
			</div>
		</div>

		<!-- Order Items -->
		<div class="card-cosmic p-6 space-y-4">
			<h2 class="text-lg font-display">Productos</h2>
			<div class="space-y-4">
				{#each order.items as item}
					<div class="flex gap-4 p-4 rounded-lg bg-white/5">
						{#if item.image}
							<img
								src={item.image}
								alt={item.name}
								class="w-20 h-20 object-cover rounded-lg"
							/>
						{:else}
							<div class="w-20 h-20 bg-white/10 rounded-lg"></div>
						{/if}
						<div class="flex-1">
							<p class="font-medium">{item.name}</p>
							{#if item.variant}
								<p class="text-white/50 text-sm">
									{Object.entries(item.variant || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
								</p>
							{/if}
							<p class="text-white/50 text-sm">
								Cantidad: {item.quantity}
							</p>
						</div>
						<div class="text-right">
							<p>{formatCurrency(item.price_mxn * item.quantity)}</p>
							<p class="text-white/50 text-sm">{formatCurrency(item.price_mxn)} c/u</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="border-t border-white/10 pt-4 flex justify-between text-lg">
				<span>Total</span>
				<span class="font-display">{formatCurrency(order.subtotal_mxn)}</span>
			</div>
		</div>

		<!-- Admin Notes -->
		<div class="card-cosmic p-6 space-y-4">
			<h2 class="text-lg font-display">Notas del Administrador</h2>
			<textarea
				bind:value={adminNotes}
				rows="4"
				class="input-cosmic w-full resize-none"
				placeholder="Agregar notas internas sobre este pedido..."
			></textarea>
			<button
				onclick={saveNotes}
				disabled={saving}
				class="btn-primary"
			>
				{saving ? 'Guardando...' : 'Guardar Notas'}
			</button>
		</div>
	{/if}
</div>
