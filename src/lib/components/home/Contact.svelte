<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { t } from '$utils/i18n';
	import { onMount } from 'svelte';

	// State
	let isVisible = $state(false);
	let sectionRef: HTMLElement;

	// Form state
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');

	// Validation
	let errors = $state<{ name?: string; email?: string; message?: string }>({});

	function validateForm(): boolean {
		errors = {};

		if (!name.trim()) {
			errors.name = language.current === 'es' ? 'El nombre es requerido' : 'Name is required';
		}

		if (!email.trim()) {
			errors.email = language.current === 'es' ? 'El correo es requerido' : 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = language.current === 'es' ? 'Correo invalido' : 'Invalid email';
		}

		if (!message.trim()) {
			errors.message = language.current === 'es' ? 'El mensaje es requerido' : 'Message is required';
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) return;

		isSubmitting = true;
		submitStatus = 'idle';

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Reset form
			name = '';
			email = '';
			message = '';
			submitStatus = 'success';

			// Reset status after 5 seconds
			setTimeout(() => {
				submitStatus = 'idle';
			}, 5000);
		} catch {
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		return () => observer.disconnect();
	});
</script>

<style>
	.input-cosmic {
		width: 100%;
		padding: 1rem 0;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--white-30);
		color: var(--white-white);
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}

	.input-cosmic::placeholder {
		color: var(--white-30);
	}

	.input-cosmic:focus {
		outline: none;
		border-bottom-color: var(--accent-purple, #8b5cf6);
	}

	.input-cosmic.error {
		border-bottom-color: #ef4444;
	}

	.btn-bordered {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2.5rem;
		border: 1px solid var(--white-30);
		background: transparent;
		color: var(--white-white);
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.btn-bordered:hover:not(:disabled) {
		background: var(--white-white);
		color: var(--navy-deepest, #001239);
		border-color: var(--white-white);
	}

	.btn-bordered:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

<section id="contacto" bind:this={sectionRef} class="py-24 md:py-32 lg:py-40">
	<div class="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
			<!-- Left Column - Contact Info -->
			<div
				class="lg:col-span-5"
				class:opacity-0={!isVisible}
				class:translate-y-8={!isVisible}
				style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
			>
				<!-- Section Label -->
				<span class="section-title block text-xs tracking-[0.3em] uppercase text-[var(--white-50)] mb-6">
					{language.current === 'es' ? 'Contacto' : 'Contact'}
				</span>

				<!-- Headline -->
				<h2 class="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--white-white)] mb-6 leading-[0.95]">
					{t(language.current, 'contact.title')}
				</h2>

				<p class="text-[var(--white-70)] font-body text-base md:text-lg mb-12 max-w-md">
					{t(language.current, 'contact.subtitle')}
				</p>

				<!-- Contact Details -->
				<div class="space-y-8">
					<!-- Email -->
					<div>
						<div class="text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-2">
							{t(language.current, 'contact.info.email')}
						</div>
						<a
							href="mailto:hola@famunic.com"
							class="text-[var(--white-white)] text-lg hover:text-[var(--accent-purple, #8b5cf6)] transition-colors"
						>
							hola@famunic.com
						</a>
					</div>

					<!-- Instagram -->
					<div>
						<div class="text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-2">
							{t(language.current, 'contact.info.instagram')}
						</div>
						<a
							href="https://instagram.com/famunic"
							target="_blank"
							rel="noopener noreferrer"
							class="text-[var(--white-white)] text-lg hover:text-[var(--accent-purple, #8b5cf6)] transition-colors"
						>
							@famunic
						</a>
					</div>

					<!-- Location -->
					<div>
						<div class="text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-2">
							{t(language.current, 'contact.info.location')}
						</div>
						<span class="text-[var(--white-white)] text-lg">Mexico</span>
					</div>
				</div>
			</div>

			<!-- Right Column - Form -->
			<div
				class="lg:col-span-6 lg:col-start-7"
				class:opacity-0={!isVisible}
				class:translate-y-8={!isVisible}
				style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: 0.15s"
			>
				{#if submitStatus === 'success'}
					<!-- Success State -->
					<div class="py-16 text-center">
						<div class="w-16 h-16 mx-auto mb-6 border border-[var(--white-30)] rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-[var(--white-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<p class="text-[var(--white-white)] text-lg font-display">
							{t(language.current, 'contact.form.success')}
						</p>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-8">
						<!-- Name Field -->
						<div>
							<label for="name" class="block text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-4">
								{t(language.current, 'contact.form.name')}
							</label>
							<input
								type="text"
								id="name"
								bind:value={name}
								class="input-cosmic"
								class:error={errors.name}
								placeholder={language.current === 'es' ? 'Tu nombre' : 'Your name'}
							/>
							{#if errors.name}
								<p class="text-red-400 text-xs mt-2">{errors.name}</p>
							{/if}
						</div>

						<!-- Email Field -->
						<div>
							<label for="email" class="block text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-4">
								{t(language.current, 'contact.form.email')}
							</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								class="input-cosmic"
								class:error={errors.email}
								placeholder={language.current === 'es' ? 'tu@correo.com' : 'your@email.com'}
							/>
							{#if errors.email}
								<p class="text-red-400 text-xs mt-2">{errors.email}</p>
							{/if}
						</div>

						<!-- Message Field -->
						<div>
							<label for="message" class="block text-xs tracking-[0.2em] uppercase text-[var(--white-50)] mb-4">
								{t(language.current, 'contact.form.message')}
							</label>
							<textarea
								id="message"
								bind:value={message}
								rows={4}
								class="input-cosmic resize-none"
								class:error={errors.message}
								placeholder={language.current === 'es' ? 'Tu mensaje...' : 'Your message...'}
							></textarea>
							{#if errors.message}
								<p class="text-red-400 text-xs mt-2">{errors.message}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<div class="pt-4">
							<button
								type="submit"
								class="btn-bordered w-full md:w-auto"
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<span class="flex items-center gap-3">
										<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										{t(language.current, 'contact.form.sending')}
									</span>
								{:else}
									{t(language.current, 'contact.form.send')}
								{/if}
							</button>
						</div>

						{#if submitStatus === 'error'}
							<p class="text-red-400 text-sm">
								{t(language.current, 'contact.form.error')}
							</p>
						{/if}
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
