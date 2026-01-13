<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

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
		created_at: string;
	}

	let orders = $state<Order[]>([]);
	let loading = $state(true);
	let statusFilter = $state('all');
	let searchQuery = $state('');

	// Check URL params for initial filter
	const urlStatus = $page.url.searchParams.get('status');
	if (urlStatus) {
		statusFilter = urlStatus;
	}

	// Filtered orders
	let filteredOrders = $derived(() => {
		let result = orders;

		if (statusFilter !== 'all') {
			result = result.filter(o => o.order_status === statusFilter);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(o =>
				o.order_number.toLowerCase().includes(query) ||
				o.customer_email.toLowerCase().includes(query)
			);
		}

		return result;
	});

	onMount(async () => {
		await loadOrders();
	});

	async function loadOrders() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			orders = data || [];
		} catch (err) {
			console.error('Failed to load orders:', err);
		} finally {
			loading = false;
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
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'new': return 'bg-blue-500/20 text-blue-400';
			case 'processing': return 'bg-yellow-500/20 text-yellow-400';
			case 'shipped': return 'bg-purple-500/20 text-purple-400';
			case 'delivered': return 'bg-green-500/20 text-green-400';
			case 'cancelled': return 'bg-red-500/20 text-red-400';
			default: return 'bg-white/10 text-white/70';
		}
	}

	function getPaymentStatusColor(status: string): string {
		switch (status) {
			case 'pending': return 'text-yellow-400';
			case 'succeeded': return 'text-green-400';
			case 'failed': return 'text-red-400';
			case 'refunded': return 'text-purple-400';
			default: return 'text-white/70';
		}
	}

	const statusLabels: Record<string, string> = {
		all: 'Todos',
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

	const statuses = ['all', 'new', 'processing', 'shipped', 'delivered', 'cancelled'];
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<h1 class="text-2xl font-display">Pedidos</h1>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4">
		<div class="flex-1">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Buscar por número o email..."
				class="input-cosmic w-full"
			/>
		</div>
		<div>
			<select
				bind:value={statusFilter}
				class="input-cosmic bg-cosmic-deep"
			>
				{#each statuses as status}
					<option value={status}>{statusLabels[status]}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Orders Table -->
	{#if loading}
		<div class="card-cosmic p-8">
			<div class="flex items-center justify-center gap-3">
				<svg class="animate-spin w-5 h-5 text-cosmic-gold" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="text-white/50">Cargando pedidos...</span>
			</div>
		</div>
	{:else if filteredOrders().length === 0}
		<div class="card-cosmic p-8 text-center">
			<svg class="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
			</svg>
			{#if searchQuery || statusFilter !== 'all'}
				<p class="text-white/50">No se encontraron pedidos</p>
				<button
					onclick={() => { searchQuery = ''; statusFilter = 'all'; }}
					class="text-cosmic-gold text-sm mt-2 hover:underline"
				>
					Limpiar filtros
				</button>
			{:else}
				<p class="text-white/50">No hay pedidos aún</p>
			{/if}
		</div>
	{:else}
		<div class="card-cosmic overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-white/10 bg-white/5">
							<th class="text-left text-white/50 text-sm font-normal p-4">Pedido</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Cliente</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Total</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Pago</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Estado</th>
							<th class="text-left text-white/50 text-sm font-normal p-4">Fecha</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredOrders() as order}
							<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
								<td class="p-4">
									<a href="/admin/orders/{order.id}" class="text-cosmic-gold hover:underline font-medium">
										{order.order_number}
									</a>
									<p class="text-white/30 text-xs mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
								</td>
								<td class="p-4">
									<p class="text-white/90">{order.customer_email}</p>
									{#if order.customer_phone}
										<p class="text-white/30 text-sm">{order.customer_phone}</p>
									{/if}
								</td>
								<td class="p-4">
									<p>{formatCurrency(order.amount_charged, order.currency_charged)}</p>
									{#if order.currency_charged !== 'MXN'}
										<p class="text-white/30 text-xs">{formatCurrency(order.subtotal_mxn, 'MXN')}</p>
									{/if}
								</td>
								<td class="p-4">
									<span class={getPaymentStatusColor(order.payment_status)}>
										{paymentLabels[order.payment_status] || order.payment_status}
									</span>
								</td>
								<td class="p-4">
									<span class="px-2 py-1 rounded-full text-xs {getStatusColor(order.order_status)}">
										{statusLabels[order.order_status] || order.order_status}
									</span>
								</td>
								<td class="p-4 text-white/50 text-sm">
									{formatDate(order.created_at)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<p class="text-white/30 text-sm text-center">
			{filteredOrders().length} pedido{filteredOrders().length !== 1 ? 's' : ''}
		</p>
	{/if}
</div>
