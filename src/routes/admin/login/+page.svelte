<script lang="ts">
	import { goto } from '$app/navigation';
	import { language } from '$stores/language.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// Check for error in URL
	const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
	const urlError = urlParams?.get('error');
	if (urlError === 'not_admin') {
		error = language.current === 'es'
			? 'No tienes permisos de administrador'
			: 'You do not have admin permissions';
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			// Import Supabase client dynamically to avoid SSR issues
			const { createBrowserSupabaseClient } = await import('$utils/supabase');
			const supabase = createBrowserSupabaseClient();

			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (authError) {
				error = language.current === 'es'
					? 'Credenciales inválidas'
					: 'Invalid credentials';
				return;
			}

			if (data.session) {
				// Check if user is admin
				const { data: adminUser } = await supabase
					.from('admin_users')
					.select('id')
					.eq('id', data.user.id)
					.single();

				if (!adminUser) {
					await supabase.auth.signOut();
					error = language.current === 'es'
						? 'No tienes permisos de administrador'
						: 'You do not have admin permissions';
					return;
				}

				goto('/admin');
			}
		} catch (err) {
			console.error('Login error:', err);
			error = language.current === 'es'
				? 'Error al iniciar sesión'
				: 'Login error';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen bg-cosmic-void flex items-center justify-center p-4">
	<!-- Star background effect -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-cosmic-blue/10"></div>
	</div>

	<div class="relative w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-flex items-center gap-3">
				<svg viewBox="0 0 40 40" class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M20 4 C 30 4, 36 10, 36 20 C 36 28, 30 34, 22 34 C 14 34, 10 28, 10 22 C 10 16, 14 12, 20 12 C 24 12, 28 16, 28 20 C 28 24, 24 26, 20 26 C 18 26, 16 24, 16 20" class="text-cosmic-gold" />
				</svg>
				<span class="font-display text-2xl italic">fam unic</span>
			</a>
			<p class="mt-2 text-white/50 text-sm">Admin Panel</p>
		</div>

		<!-- Login form -->
		<form onsubmit={handleSubmit} class="card-cosmic p-8 space-y-6">
			<h1 class="text-xl font-display text-center">
				{language.current === 'es' ? 'Iniciar Sesión' : 'Sign In'}
			</h1>

			{#if error}
				<div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
					{error}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm text-white/70 mb-2">
						{language.current === 'es' ? 'Correo electrónico' : 'Email'}
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="input-cosmic w-full"
						placeholder="admin@famunic.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm text-white/70 mb-2">
						{language.current === 'es' ? 'Contraseña' : 'Password'}
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="input-cosmic w-full"
						placeholder="••••••••"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if loading}
					<svg class="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				{:else}
					{language.current === 'es' ? 'Entrar' : 'Sign In'}
				{/if}
			</button>
		</form>

		<p class="text-center mt-6 text-white/30 text-sm">
			<a href="/" class="hover:text-white transition-colors">
				← {language.current === 'es' ? 'Volver a la tienda' : 'Back to store'}
			</a>
		</p>
	</div>
</div>
