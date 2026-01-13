<script lang="ts">
	import { language } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { cart } from '$stores/cart.svelte';
	import { t } from '$utils/i18n';
	import { goto } from '$app/navigation';
	import type { CheckoutFormData, ShippingAddress } from '$types';

	// Step management
	type Step = 'contact' | 'shipping' | 'review' | 'payment' | 'success';
	let currentStep = $state<Step>('contact');
	let orderNumber = $state('');

	// Form data
	let formData = $state<CheckoutFormData>({
		contact: {
			email: '',
			phone: '',
			subscribe_newsletter: false
		},
		shipping: {
			full_name: '',
			street_address: '',
			city: '',
			state: '',
			postal_code: '',
			country: 'MX'
		}
	});

	// Validation errors
	let errors = $state<Record<string, string>>({});

	// Loading state
	let isSubmitting = $state(false);

	// Steps configuration
	const steps: { key: Step; label: string }[] = [
		{ key: 'contact', label: 'checkout.steps.contact' },
		{ key: 'shipping', label: 'checkout.steps.shipping' },
		{ key: 'review', label: 'checkout.steps.review' },
		{ key: 'payment', label: 'checkout.steps.payment' }
	];

	// Countries list (simplified)
	const countries = [
		{ code: 'MX', name_es: 'México', name_en: 'Mexico' },
		{ code: 'US', name_es: 'Estados Unidos', name_en: 'United States' },
		{ code: 'CA', name_es: 'Canadá', name_en: 'Canada' },
		{ code: 'ES', name_es: 'España', name_en: 'Spain' },
		{ code: 'AR', name_es: 'Argentina', name_en: 'Argentina' },
		{ code: 'CO', name_es: 'Colombia', name_en: 'Colombia' },
		{ code: 'CL', name_es: 'Chile', name_en: 'Chile' },
		{ code: 'PE', name_es: 'Perú', name_en: 'Peru' },
		{ code: 'BR', name_es: 'Brasil', name_en: 'Brazil' }
	];

	// Validate contact step
	function validateContact(): boolean {
		errors = {};

		if (!formData.contact.email.trim()) {
			errors.email = language.current === 'es' ? 'El correo es requerido' : 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
			errors.email = language.current === 'es' ? 'Correo inválido' : 'Invalid email';
		}

		return Object.keys(errors).length === 0;
	}

	// Validate shipping step
	function validateShipping(): boolean {
		errors = {};

		if (!formData.shipping.full_name.trim()) {
			errors.full_name = language.current === 'es' ? 'El nombre es requerido' : 'Name is required';
		}
		if (!formData.shipping.street_address.trim()) {
			errors.street_address = language.current === 'es' ? 'La dirección es requerida' : 'Address is required';
		}
		if (!formData.shipping.city.trim()) {
			errors.city = language.current === 'es' ? 'La ciudad es requerida' : 'City is required';
		}
		if (!formData.shipping.state.trim()) {
			errors.state = language.current === 'es' ? 'El estado es requerido' : 'State is required';
		}
		if (!formData.shipping.postal_code.trim()) {
			errors.postal_code = language.current === 'es' ? 'El código postal es requerido' : 'Postal code is required';
		}

		return Object.keys(errors).length === 0;
	}

	// Navigate steps
	function nextStep() {
		if (currentStep === 'contact' && validateContact()) {
			currentStep = 'shipping';
		} else if (currentStep === 'shipping' && validateShipping()) {
			currentStep = 'review';
		} else if (currentStep === 'review') {
			currentStep = 'payment';
		}
	}

	function prevStep() {
		if (currentStep === 'shipping') currentStep = 'contact';
		else if (currentStep === 'review') currentStep = 'shipping';
		else if (currentStep === 'payment') currentStep = 'review';
	}

	// Submit order
	async function submitOrder() {
		isSubmitting = true;

		try {
			// TODO: Create order via API
			// const response = await fetch('/api/orders', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     contact: formData.contact,
			//     shipping: formData.shipping,
			//     items: cart.items,
			//     currency: currency.current
			//   })
			// });

			// Simulate order creation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate order number
			const year = new Date().getFullYear();
			const random = Math.random().toString(36).substring(2, 6).toUpperCase();
			orderNumber = `FU-${year}-${random}`;

			// Clear cart
			cart.clear();

			// Move to success
			currentStep = 'success';
		} catch (error) {
			console.error('Order failed:', error);
			// TODO: Show error toast
		} finally {
			isSubmitting = false;
		}
	}

	// Get step number
	function getStepNumber(step: Step): number {
		return steps.findIndex((s) => s.key === step) + 1;
	}

	// Check if step is complete
	function isStepComplete(step: Step): boolean {
		const currentIndex = steps.findIndex((s) => s.key === currentStep);
		const stepIndex = steps.findIndex((s) => s.key === step);
		return stepIndex < currentIndex;
	}

	// Redirect if cart is empty (unless on success page)
	$effect(() => {
		if (cart.isEmpty && currentStep !== 'success') {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>{t(language.current, 'checkout.title')} | Fam Unic</title>
</svelte:head>

<div class="min-h-screen pt-20 pb-12">
	<div class="container-cosmic max-w-3xl">
		{#if currentStep !== 'success'}
			<!-- Progress steps -->
			<div class="mb-8">
				<div class="flex items-center justify-between">
					{#each steps as step, i}
						{@const isActive = step.key === currentStep}
						{@const isComplete = isStepComplete(step.key)}
						<div class="flex items-center {i < steps.length - 1 ? 'flex-1' : ''}">
							<!-- Step circle -->
							<div
								class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 {isActive ? 'bg-cosmic-gold text-cosmic-void' : isComplete ? 'bg-cosmic-gold/20 text-cosmic-gold' : 'bg-white/10 text-white/50'}"
							>
								{#if isComplete}
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
								{:else}
									{i + 1}
								{/if}
							</div>

							<!-- Step label (hidden on mobile) -->
							<span class="hidden sm:block ml-2 text-sm {isActive ? 'text-cosmic-gold' : 'text-white/50'}">
								{t(language.current, step.label)}
							</span>

							<!-- Connector line -->
							{#if i < steps.length - 1}
								<div
									class="flex-1 h-px mx-4 transition-all duration-300 {isComplete ? 'bg-cosmic-gold' : 'bg-white/10'}"
								></div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Step content -->
		<div class="card-cosmic p-6 md:p-8">
			<!-- Contact Step -->
			{#if currentStep === 'contact'}
				<div class="animate-fade-in">
					<h2 class="font-display text-2xl mb-6">
						{t(language.current, 'checkout.contact.title')}
					</h2>

					<div class="space-y-4">
						<div>
							<label for="email" class="block text-sm text-white/70 mb-2">
								{t(language.current, 'checkout.contact.email')} *
							</label>
							<input
								type="email"
								id="email"
								bind:value={formData.contact.email}
								class="input-cosmic {errors.email ? 'border-red-500' : ''}"
								placeholder="tu@correo.com"
							/>
							{#if errors.email}
								<p class="text-red-400 text-xs mt-1">{errors.email}</p>
							{/if}
						</div>

						<div>
							<label for="phone" class="block text-sm text-white/70 mb-2">
								{t(language.current, 'checkout.contact.phone')}
							</label>
							<input
								type="tel"
								id="phone"
								bind:value={formData.contact.phone}
								class="input-cosmic"
								placeholder="+52 55 1234 5678"
							/>
						</div>

						<label class="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={formData.contact.subscribe_newsletter}
								class="w-5 h-5 rounded border-white/20 bg-cosmic-deep text-cosmic-gold focus:ring-cosmic-gold"
							/>
							<span class="text-sm text-white/70">
								{t(language.current, 'checkout.contact.newsletter')}
							</span>
						</label>
					</div>
				</div>

			<!-- Shipping Step -->
			{:else if currentStep === 'shipping'}
				<div class="animate-fade-in">
					<h2 class="font-display text-2xl mb-6">
						{t(language.current, 'checkout.shipping.title')}
					</h2>

					<div class="space-y-4">
						<div>
							<label for="full_name" class="block text-sm text-white/70 mb-2">
								{t(language.current, 'checkout.shipping.fullName')} *
							</label>
							<input
								type="text"
								id="full_name"
								bind:value={formData.shipping.full_name}
								class="input-cosmic {errors.full_name ? 'border-red-500' : ''}"
							/>
							{#if errors.full_name}
								<p class="text-red-400 text-xs mt-1">{errors.full_name}</p>
							{/if}
						</div>

						<div>
							<label for="street_address" class="block text-sm text-white/70 mb-2">
								{t(language.current, 'checkout.shipping.address')} *
							</label>
							<input
								type="text"
								id="street_address"
								bind:value={formData.shipping.street_address}
								class="input-cosmic {errors.street_address ? 'border-red-500' : ''}"
							/>
							{#if errors.street_address}
								<p class="text-red-400 text-xs mt-1">{errors.street_address}</p>
							{/if}
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="city" class="block text-sm text-white/70 mb-2">
									{t(language.current, 'checkout.shipping.city')} *
								</label>
								<input
									type="text"
									id="city"
									bind:value={formData.shipping.city}
									class="input-cosmic {errors.city ? 'border-red-500' : ''}"
								/>
								{#if errors.city}
									<p class="text-red-400 text-xs mt-1">{errors.city}</p>
								{/if}
							</div>

							<div>
								<label for="state" class="block text-sm text-white/70 mb-2">
									{t(language.current, 'checkout.shipping.state')} *
								</label>
								<input
									type="text"
									id="state"
									bind:value={formData.shipping.state}
									class="input-cosmic {errors.state ? 'border-red-500' : ''}"
								/>
								{#if errors.state}
									<p class="text-red-400 text-xs mt-1">{errors.state}</p>
								{/if}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="postal_code" class="block text-sm text-white/70 mb-2">
									{t(language.current, 'checkout.shipping.postalCode')} *
								</label>
								<input
									type="text"
									id="postal_code"
									bind:value={formData.shipping.postal_code}
									class="input-cosmic {errors.postal_code ? 'border-red-500' : ''}"
								/>
								{#if errors.postal_code}
									<p class="text-red-400 text-xs mt-1">{errors.postal_code}</p>
								{/if}
							</div>

							<div>
								<label for="country" class="block text-sm text-white/70 mb-2">
									{t(language.current, 'checkout.shipping.country')} *
								</label>
								<select
									id="country"
									bind:value={formData.shipping.country}
									class="input-cosmic"
								>
									{#each countries as country}
										<option value={country.code}>
											{language.current === 'en' ? country.name_en : country.name_es}
										</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
				</div>

			<!-- Review Step -->
			{:else if currentStep === 'review'}
				<div class="animate-fade-in">
					<h2 class="font-display text-2xl mb-6">
						{t(language.current, 'checkout.review.title')}
					</h2>

					<!-- Order summary -->
					<div class="mb-6">
						<h3 class="text-sm text-white/50 uppercase tracking-wider mb-3">
							{t(language.current, 'checkout.review.orderSummary')}
						</h3>
						<div class="space-y-3">
							{#each cart.items as item}
								<div class="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
									<div class="w-16 h-16 rounded-lg overflow-hidden bg-cosmic-nebula">
										{#if item.image_url}
											<img src={item.image_url} alt="" class="w-full h-full object-cover" />
										{/if}
									</div>
									<div class="flex-1">
										<p class="font-medium">{language.current === 'en' && item.name_en ? item.name_en : item.name_es}</p>
										<p class="text-sm text-white/50">x{item.quantity}</p>
									</div>
									<p class="text-cosmic-gold">
										{currency.format(item.price_mxn * item.quantity)}
									</p>
								</div>
							{/each}
						</div>

						<div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
							<span class="text-white/70">Total</span>
							<span class="font-display text-xl text-cosmic-gold">
								{currency.format(cart.subtotalMxn)}
							</span>
						</div>
					</div>

					<!-- Shipping address summary -->
					<div>
						<h3 class="text-sm text-white/50 uppercase tracking-wider mb-3">
							{t(language.current, 'checkout.review.shippingTo')}
						</h3>
						<div class="p-4 bg-white/5 rounded-lg">
							<p class="font-medium">{formData.shipping.full_name}</p>
							<p class="text-white/70">{formData.shipping.street_address}</p>
							<p class="text-white/70">
								{formData.shipping.city}, {formData.shipping.state} {formData.shipping.postal_code}
							</p>
							<p class="text-white/70">
								{countries.find((c) => c.code === formData.shipping.country)?.[language.current === 'en' ? 'name_en' : 'name_es']}
							</p>
							<p class="text-white/50 mt-2">{formData.contact.email}</p>
						</div>
					</div>
				</div>

			<!-- Payment Step -->
			{:else if currentStep === 'payment'}
				<div class="animate-fade-in">
					<h2 class="font-display text-2xl mb-6">
						{t(language.current, 'checkout.payment.title')}
					</h2>

					<!-- Stripe Elements placeholder -->
					<div class="p-8 border border-dashed border-white/20 rounded-lg text-center text-white/50 mb-6">
						<svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
						<p>Stripe Elements will be integrated here</p>
						<p class="text-sm mt-1">For now, click "Place Order" to simulate payment</p>
					</div>

					<!-- Order total -->
					<div class="flex items-center justify-between p-4 bg-cosmic-gold/10 rounded-lg">
						<span class="text-lg">Total</span>
						<span class="font-display text-2xl text-cosmic-gold">
							{currency.format(cart.subtotalMxn)}
						</span>
					</div>
				</div>

			<!-- Success Step -->
			{:else if currentStep === 'success'}
				<div class="animate-fade-in text-center py-8">
					<!-- Success animation -->
					<div class="w-20 h-20 rounded-full bg-cosmic-gold/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
						<svg class="w-10 h-10 text-cosmic-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>

					<h2 class="font-display text-3xl mb-4 text-cosmic-gold">
						{t(language.current, 'checkout.success.title')}
					</h2>

					<p class="text-white/70 mb-6">
						{t(language.current, 'checkout.success.message')}
					</p>

					<div class="inline-block p-4 bg-white/5 rounded-lg mb-8">
						<p class="text-sm text-white/50">{t(language.current, 'checkout.success.orderNumber')}</p>
						<p class="font-mono text-xl text-cosmic-gold">{orderNumber}</p>
					</div>

					<div>
						<a href="/" class="btn-primary">
							{t(language.current, 'checkout.success.backHome')}
						</a>
					</div>

					<!-- Star decoration -->
					<div class="mt-8 flex justify-center gap-2">
						{#each Array(5) as _, i}
							<span
								class="text-cosmic-gold animate-twinkle"
								style="animation-delay: {i * 0.2}s"
							>
								✦
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Navigation buttons -->
			{#if currentStep !== 'success'}
				<div class="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
					{#if currentStep !== 'contact'}
						<button onclick={prevStep} class="btn-ghost">
							{t(language.current, 'checkout.buttons.back')}
						</button>
					{:else}
						<div></div>
					{/if}

					{#if currentStep === 'payment'}
						<button
							onclick={submitOrder}
							class="btn-primary"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<span class="flex items-center gap-2">
									<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									{t(language.current, 'checkout.payment.processing')}
								</span>
							{:else}
								{t(language.current, 'checkout.buttons.placeOrder')}
							{/if}
						</button>
					{:else}
						<button onclick={nextStep} class="btn-primary">
							{t(language.current, 'checkout.buttons.continue')}
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
