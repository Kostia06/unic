<script lang="ts">
	import { cart, formatVariantDetails } from '$stores/cart.svelte';
	import { language, getLocalizedName } from '$stores/language.svelte';
	import { currency } from '$stores/currency.svelte';
	import { t } from '$utils/i18n';

	function handleQuantityChange(productId: string, variantId: string | null, delta: number) {
		const item = cart.items.find(
			(i) => i.product_id === productId && i.variant_id === variantId
		);
		if (item) {
			cart.updateQuantity(productId, variantId, item.quantity + delta);
		}
	}

	function handleRemove(productId: string, variantId: string | null) {
		cart.remove(productId, variantId);
	}

	function handleCheckout() {
		cart.close();
		// Navigate to checkout
		window.location.href = '/checkout';
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			cart.close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			cart.close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if cart.isOpen}
	<!-- Backdrop with nebula glow -->
	<button
		class="cart-backdrop fixed inset-0 z-50 bg-void-deepest/90 backdrop-blur-sm animate-fade-in"
		onclick={() => cart.close()}
		aria-label="Close cart"
	></button>

	<!-- Drawer -->
	<div
		class="fixed right-0 top-0 h-full w-full max-w-md border-l border-star-faint/10 flex flex-col animate-slide-in-right z-50 glass-strong"
		role="dialog"
		aria-modal="true"
		aria-label={t(language.current, 'cart.title')}
		tabindex="-1"
	>
		<!-- Decorative corner accents -->
		<div class="absolute top-0 left-0 w-16 h-16 border-t border-l border-nebula-purple-glow/20 pointer-events-none"></div>
		<div class="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-nebula-pink-glow/20 pointer-events-none"></div>

		<!-- Header -->
		<div class="flex items-center justify-between p-5 border-b border-star-faint/10">
			<h2 class="font-display text-xl text-star-white">
				{t(language.current, 'cart.title')}
			</h2>
			<button
				onclick={() => cart.close()}
				class="p-2 rounded-full border border-transparent hover:border-nebula-purple-glow/30 text-star-dim hover:text-star-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
				aria-label={t(language.current, 'common.close')}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Cart items -->
		<div class="flex-1 overflow-y-auto p-5">
			{#if cart.isEmpty}
				<div class="flex flex-col items-center justify-center h-full text-center">
					<div class="relative mb-6">
						<svg class="w-20 h-20 text-star-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
						<!-- Subtle glow behind icon -->
						<div class="absolute inset-0 bg-nebula-purple/10 blur-2xl rounded-full"></div>
					</div>
					<p class="text-star-dim mb-2">
						{t(language.current, 'cart.empty')}
					</p>
					<p class="text-sm text-star-faint">
						{t(language.current, 'cart.emptyMessage')}
					</p>
				</div>
			{:else}
				<ul class="flex flex-col gap-4">
					{#each cart.items as item (cart.getItemKey(item))}
						<li class="flex gap-4 p-4 rounded-xl bg-void-medium/50 border border-star-faint/10 hover:border-nebula-purple-glow/20 transition-all duration-300">
							<!-- Product image -->
							<div class="w-20 h-20 rounded-lg overflow-hidden bg-void-light flex-shrink-0 border border-star-faint/10">
								{#if item.image_url}
									<img
										src={item.image_url}
										alt={getLocalizedName(item)}
										class="w-full h-full object-cover"
									/>
								{/if}
							</div>

							<!-- Product info -->
							<div class="flex-1 min-w-0">
								<h3 class="font-medium text-sm text-star-white truncate">
									{getLocalizedName(item)}
								</h3>
								{#if item.variant_details}
									<p class="text-xs text-star-faint mt-0.5">
										{formatVariantDetails(item.variant_details, language.current)}
									</p>
								{/if}
								<p class="text-nebula-purple-glow text-sm mt-1">
									{currency.format(item.price_mxn)}
								</p>

								<!-- Quantity controls -->
								<div class="flex items-center gap-3 mt-3">
									<button
										onclick={() => handleQuantityChange(item.product_id, item.variant_id, -1)}
										class="w-7 h-7 rounded-full bg-void-light border border-star-faint/20 hover:border-nebula-purple-glow/50 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
										aria-label="Decrease quantity"
									>
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
										</svg>
									</button>
									<span class="text-sm w-6 text-center text-star-white">{item.quantity}</span>
									<button
										onclick={() => handleQuantityChange(item.product_id, item.variant_id, 1)}
										class="w-7 h-7 rounded-full bg-void-light border border-star-faint/20 hover:border-nebula-purple-glow/50 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]"
										aria-label="Increase quantity"
									>
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
										</svg>
									</button>

									<!-- Remove button -->
									<button
										onclick={() => handleRemove(item.product_id, item.variant_id)}
										class="ml-auto text-star-faint hover:text-nebula-pink-glow transition-colors duration-300"
										aria-label={t(language.current, 'cart.remove')}
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Footer -->
		{#if !cart.isEmpty}
			<div class="border-t border-star-faint/10 p-5 space-y-5">
				<!-- Subtotal -->
				<div class="flex items-center justify-between">
					<span class="text-star-dim">
						{t(language.current, 'cart.subtotal')}
					</span>
					<div class="text-right">
						<span class="font-display text-xl text-nebula-purple-glow text-glow-purple">
							{currency.format(cart.subtotalMxn)}
						</span>
						{#if currency.current === 'MXN'}
							<p class="text-xs text-star-faint">
								{currency.formatWithAlternate(cart.subtotalMxn).secondary}
							</p>
						{/if}
					</div>
				</div>

				<!-- Checkout button -->
				<button
					onclick={handleCheckout}
					class="group relative w-full px-8 py-4 text-lg font-medium text-star-white border border-star-faint/30 rounded-full overflow-hidden transition-all duration-500 hover:border-nebula-purple-glow hover:shadow-[0_0_40px_rgba(168,85,247,0.3),inset_0_0_40px_rgba(168,85,247,0.1)]"
				>
					<!-- Shimmer effect -->
					<span class="absolute inset-0 bg-gradient-to-r from-transparent via-nebula-purple-glow/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
					<span class="relative">
						{t(language.current, 'cart.checkout')}
					</span>
				</button>

				<!-- Continue shopping -->
				<button
					onclick={() => cart.close()}
					class="w-full text-sm text-star-dim hover:text-star-white transition-colors duration-300 py-2"
				>
					{t(language.current, 'cart.continueShopping')}
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.cart-backdrop {
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
		margin: 0;
		appearance: none;
		-webkit-appearance: none;
	}
</style>
