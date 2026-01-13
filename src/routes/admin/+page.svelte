<script lang="ts">
	import { onMount } from 'svelte';

	// Stats state
	let stats = $state({
		ordersToday: 0,
		ordersWeek: 0,
		ordersMonth: 0,
		revenueToday: 0,
		revenueWeek: 0,
		revenueMonth: 0,
		pendingOrders: 0,
		newMessages: 0
	});

	let recentOrders = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		await loadDashboardData();
	});

	async function loadDashboardData() {
		try {
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			// Get date ranges
			const now = new Date();
			const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
			const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
			const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

			// Fetch orders
			const { data: orders } = await supabase
				.from('orders')
				.select('*')
				.order('created_at', { ascending: false });

			if (orders) {
				// Calculate stats
				const today = orders.filter(o => o.created_at >= todayStart);
				const week = orders.filter(o => o.created_at >= weekStart);
				const month = orders.filter(o => o.created_at >= monthStart);
				const pending = orders.filter(o => o.order_status === 'new' || o.order_status === 'processing');

				stats = {
					ordersToday: today.length,
					ordersWeek: week.length,
					ordersMonth: month.length,
					revenueToday: today.reduce((sum, o) => sum + (o.subtotal_mxn || 0), 0),
					revenueWeek: week.reduce((sum, o) => sum + (o.subtotal_mxn || 0), 0),
					revenueMonth: month.reduce((sum, o) => sum + (o.subtotal_mxn || 0), 0),
					pendingOrders: pending.length,
					newMessages: 0
				};

				recentOrders = orders.slice(0, 5);
			}

			// Fetch unread messages count
			const { count } = await supabase
				.from('contact_messages')
				.select('*', { count: 'exact', head: true })
				.eq('read', false);

			if (count !== null) {
				stats.newMessages = count;
			}
		} catch (err) {
			console.error('Failed to load dashboard data:', err);
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN'
		}).format(amount);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('es-MX', {
			day: 'numeric',
			month: 'short',
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

	function getStatusLabel(status: string): string {
		const labels: Record<string, string> = {
			new: 'Nuevo',
			processing: 'Procesando',
			shipped: 'Enviado',
			delivered: 'Entregado',
			cancelled: 'Cancelado'
		};
		return labels[status] || status;
	}
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-display">Dashboard</h1>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each Array(4) as _}
				<div class="card-cosmic p-6 animate-pulse">
					<div class="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
					<div class="h-8 bg-white/10 rounded w-3/4"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Orders Today -->
			<div class="card-cosmic p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-white/50 text-sm">Pedidos Hoy</p>
						<p class="text-3xl font-display mt-1">{stats.ordersToday}</p>
					</div>
					<div class="w-12 h-12 rounded-full bg-cosmic-gold/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
				</div>
				<p class="text-white/30 text-sm mt-4">
					Semana: {stats.ordersWeek} • Mes: {stats.ordersMonth}
				</p>
			</div>

			<!-- Revenue Today -->
			<div class="card-cosmic p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-white/50 text-sm">Ingresos Hoy</p>
						<p class="text-3xl font-display mt-1">{formatCurrency(stats.revenueToday)}</p>
					</div>
					<div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<p class="text-white/30 text-sm mt-4">
					Mes: {formatCurrency(stats.revenueMonth)}
				</p>
			</div>

			<!-- Pending Orders -->
			<div class="card-cosmic p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-white/50 text-sm">Pedidos Pendientes</p>
						<p class="text-3xl font-display mt-1">{stats.pendingOrders}</p>
					</div>
					<div class="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
				<a href="/admin/orders?status=new" class="text-cosmic-gold text-sm mt-4 inline-block hover:underline">
					Ver pendientes →
				</a>
			</div>

			<!-- New Messages -->
			<div class="card-cosmic p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-white/50 text-sm">Mensajes Nuevos</p>
						<p class="text-3xl font-display mt-1">{stats.newMessages}</p>
					</div>
					<div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
						<svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
				</div>
				<a href="/admin/messages" class="text-cosmic-gold text-sm mt-4 inline-block hover:underline">
					Ver mensajes →
				</a>
			</div>
		</div>

		<!-- Recent Orders -->
		<div class="card-cosmic p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-display">Pedidos Recientes</h2>
				<a href="/admin/orders" class="text-cosmic-gold text-sm hover:underline">
					Ver todos →
				</a>
			</div>

			{#if recentOrders.length === 0}
				<p class="text-white/50 text-center py-8">No hay pedidos aún</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-white/10">
								<th class="text-left text-white/50 text-sm font-normal pb-3">Pedido</th>
								<th class="text-left text-white/50 text-sm font-normal pb-3">Cliente</th>
								<th class="text-left text-white/50 text-sm font-normal pb-3">Total</th>
								<th class="text-left text-white/50 text-sm font-normal pb-3">Estado</th>
								<th class="text-left text-white/50 text-sm font-normal pb-3">Fecha</th>
							</tr>
						</thead>
						<tbody>
							{#each recentOrders as order}
								<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
									<td class="py-4">
										<a href="/admin/orders/{order.id}" class="text-cosmic-gold hover:underline">
											{order.order_number}
										</a>
									</td>
									<td class="py-4 text-white/70">{order.customer_email}</td>
									<td class="py-4">{formatCurrency(order.subtotal_mxn)}</td>
									<td class="py-4">
										<span class="px-2 py-1 rounded-full text-xs {getStatusColor(order.order_status)}">
											{getStatusLabel(order.order_status)}
										</span>
									</td>
									<td class="py-4 text-white/50 text-sm">{formatDate(order.created_at)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<a href="/admin/products/new" class="card-cosmic p-6 hover:border-cosmic-gold/50 transition-colors group">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 rounded-full bg-cosmic-gold/10 flex items-center justify-center group-hover:bg-cosmic-gold/20 transition-colors">
						<svg class="w-5 h-5 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
						</svg>
					</div>
					<div>
						<p class="font-medium">Agregar Producto</p>
						<p class="text-white/50 text-sm">Crear nuevo producto</p>
					</div>
				</div>
			</a>

			<a href="/admin/orders" class="card-cosmic p-6 hover:border-cosmic-gold/50 transition-colors group">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 rounded-full bg-cosmic-gold/10 flex items-center justify-center group-hover:bg-cosmic-gold/20 transition-colors">
						<svg class="w-5 h-5 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<div>
						<p class="font-medium">Gestionar Pedidos</p>
						<p class="text-white/50 text-sm">Ver y actualizar pedidos</p>
					</div>
				</div>
			</a>

			<a href="/admin/settings" class="card-cosmic p-6 hover:border-cosmic-gold/50 transition-colors group">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 rounded-full bg-cosmic-gold/10 flex items-center justify-center group-hover:bg-cosmic-gold/20 transition-colors">
						<svg class="w-5 h-5 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<p class="font-medium">Configuración</p>
						<p class="text-white/50 text-sm">Ajustes de la tienda</p>
					</div>
				</div>
			</a>
		</div>
	{/if}
</div>
