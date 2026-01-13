import type { CartItem, Product, ProductVariant } from '$types';

const STORAGE_KEY = 'fam-unic-cart';

// Create reactive state
let items = $state<CartItem[]>([]);
let isOpen = $state(false);

// Initialize from localStorage (browser only)
if (typeof window !== 'undefined') {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			items = JSON.parse(stored);
		}
	} catch {
		console.warn('Failed to load cart from localStorage');
	}
}

// Persist to localStorage
function persist() {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}
}

export const cart = {
	get items() {
		return items;
	},

	get isOpen() {
		return isOpen;
	},

	get count() {
		return items.reduce((sum, item) => sum + item.quantity, 0);
	},

	get subtotalMxn() {
		return items.reduce((sum, item) => sum + item.price_mxn * item.quantity, 0);
	},

	get isEmpty() {
		return items.length === 0;
	},

	open() {
		isOpen = true;
	},

	close() {
		isOpen = false;
	},

	toggle() {
		isOpen = !isOpen;
	},

	add(
		product: Product,
		variant: ProductVariant | null,
		quantity: number = 1
	) {
		const variantId = variant?.id ?? null;
		const existingIndex = items.findIndex(
			(item) => item.product_id === product.id && item.variant_id === variantId
		);

		if (existingIndex >= 0) {
			// Update quantity of existing item
			items[existingIndex].quantity += quantity;
		} else {
			// Add new item
			const primaryImage = product.images?.find((img) => img.is_primary)?.url ??
				product.images?.[0]?.url ?? '';

			const newItem: CartItem = {
				product_id: product.id,
				variant_id: variantId,
				quantity,
				price_mxn: variant?.price_mxn ?? product.base_price_mxn,
				name_es: product.name_es,
				name_en: product.name_en,
				image_url: variant?.image_url ?? primaryImage,
				variant_details: variant?.options ?? null
			};

			items = [...items, newItem];
		}

		persist();
		// Auto-open cart when adding
		isOpen = true;
	},

	remove(productId: string, variantId: string | null) {
		items = items.filter(
			(item) => !(item.product_id === productId && item.variant_id === variantId)
		);
		persist();
	},

	updateQuantity(productId: string, variantId: string | null, quantity: number) {
		if (quantity <= 0) {
			this.remove(productId, variantId);
			return;
		}

		const index = items.findIndex(
			(item) => item.product_id === productId && item.variant_id === variantId
		);

		if (index >= 0) {
			items[index].quantity = quantity;
			persist();
		}
	},

	clear() {
		items = [];
		persist();
	},

	// Generate unique key for cart items
	getItemKey(item: CartItem): string {
		return `${item.product_id}-${item.variant_id ?? 'base'}`;
	}
};

// Derived state for formatted variant details
export function formatVariantDetails(
	details: Record<string, string> | null,
	lang: 'es' | 'en' = 'es'
): string {
	if (!details) return '';

	return Object.entries(details)
		.map(([, value]) => {
			// Capitalize first letter and replace dashes with spaces
			const formatted = value.replace(/-/g, ' ');
			return formatted.charAt(0).toUpperCase() + formatted.slice(1);
		})
		.join(' / ');
}
