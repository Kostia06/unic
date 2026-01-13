<script lang="ts">
	import 'virtual:uno.css';
	import '../../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	// Sidebar navigation items
	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/admin/products', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
		{ href: '/admin/orders', label: 'Pedidos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
		{ href: '/admin/messages', label: 'Mensajes', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
		{ href: '/admin/settings', label: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
	];

	// State
	let isSidebarOpen = $state(false);

	// Check if current path
	function isActive(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}

	// Logout handler
	async function handleLogout() {
		// TODO: Call Supabase signOut
		goto('/admin/login');
	}
</script>

<svelte:head>
	<title>Admin | Fam Unic</title>
</svelte:head>

<!-- Skip login page layout -->
{#if $page.url.pathname === '/admin/login'}
	{@render children()}
{:else}
	<div class="min-h-screen bg-cosmic-void flex">
		<!-- Sidebar -->
		<aside
			class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-cosmic-deep border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
		>
			<!-- Logo -->
			<div class="h-16 flex items-center justify-between px-4 border-b border-white/10">
				<a href="/admin" class="flex items-center gap-2">
					<svg viewBox="0 0 40 40" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M20 4 C 30 4, 36 10, 36 20 C 36 28, 30 34, 22 34 C 14 34, 10 28, 10 22 C 10 16, 14 12, 20 12 C 24 12, 28 16, 28 20 C 28 24, 24 26, 20 26 C 18 26, 16 24, 16 20" class="text-cosmic-gold" />
					</svg>
					<span class="font-display text-lg italic">fam unic</span>
				</a>
				<button onclick={() => (isSidebarOpen = false)} class="lg:hidden p-2 hover:text-cosmic-gold" aria-label="Cerrar menú">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Navigation -->
			<nav class="p-4 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors {isActive(item.href) ? 'bg-cosmic-gold/10 text-cosmic-gold' : 'text-white/70 hover:bg-white/5 hover:text-white'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={item.icon} />
						</svg>
						<span class="text-sm">{item.label}</span>
					</a>
				{/each}
			</nav>

			<!-- Logout -->
			<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span class="text-sm">Cerrar Sesión</span>
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex-1 flex flex-col min-w-0">
			<!-- Top bar -->
			<header class="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/10 bg-cosmic-deep/50">
				<button onclick={() => (isSidebarOpen = true)} class="lg:hidden p-2 hover:text-cosmic-gold" aria-label="Abrir menú">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>

				<div class="hidden lg:block"></div>

				<a href="/" target="_blank" class="text-sm text-white/50 hover:text-white transition-colors">
					Ver tienda →
				</a>
			</header>

			<!-- Page content -->
			<main class="flex-1 p-4 lg:p-6 overflow-auto">
				{@render children()}
			</main>
		</div>

		<!-- Mobile sidebar backdrop -->
		{#if isSidebarOpen}
			<button
				class="fixed inset-0 bg-cosmic-void/80 z-40 lg:hidden cursor-default"
				onclick={() => (isSidebarOpen = false)}
				aria-label="Cerrar menú"
			></button>
		{/if}
	</div>
{/if}
