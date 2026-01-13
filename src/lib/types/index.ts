// Language types
export type Language = 'es' | 'en';
export type Currency = 'MXN' | 'USD';

// Product types
export interface Product {
	id: string;
	name_es: string;
	name_en: string | null;
	description_es: string | null;
	description_en: string | null;
	category: string | null;
	base_price_mxn: number;
	has_variants: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	// Relations
	images?: ProductImage[];
	variant_types?: VariantType[];
	variants?: ProductVariant[];
}

export interface ProductImage {
	id: string;
	product_id: string;
	url: string;
	is_primary: boolean;
	sort_order: number;
}

export interface VariantType {
	id: string;
	product_id: string;
	name_es: string;
	name_en: string | null;
	sort_order: number;
	options?: VariantOption[];
}

export interface VariantOption {
	id: string;
	variant_type_id: string;
	name_es: string;
	name_en: string | null;
	sort_order: number;
}

export interface ProductVariant {
	id: string;
	product_id: string;
	options: Record<string, string>; // { "material": "gold", "color": "rose" }
	price_mxn: number;
	image_url: string | null;
	is_active: boolean;
}

// Cart types
export interface CartItem {
	product_id: string;
	variant_id: string | null;
	quantity: number;
	price_mxn: number;
	// Snapshot data for display
	name_es: string;
	name_en: string | null;
	image_url: string;
	variant_details: Record<string, string> | null;
}

export interface Cart {
	items: CartItem[];
	subtotal_mxn: number;
}

// Order types
export type OrderStatus = 'new' | 'contacted' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface ShippingAddress {
	full_name: string;
	street_address: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
}

export interface OrderItem {
	product_id: string;
	variant_id: string | null;
	quantity: number;
	price_at_purchase: number;
	name: string;
	variant_details: Record<string, string> | null;
}

export interface Order {
	id: string;
	order_number: string;
	customer_email: string;
	customer_phone: string | null;
	shipping_address: ShippingAddress;
	items: OrderItem[];
	subtotal_mxn: number;
	currency_charged: Currency;
	amount_charged: number;
	stripe_payment_intent_id: string | null;
	payment_status: PaymentStatus;
	order_status: OrderStatus;
	admin_notes: string | null;
	created_at: string;
	updated_at: string;
}

// Contact message types
export interface ContactMessage {
	id: string;
	name: string;
	email: string;
	message: string;
	is_read: boolean;
	is_replied: boolean;
	created_at: string;
}

// FAQ types
export interface FAQ {
	id: string;
	question_es: string;
	question_en: string | null;
	answer_es: string;
	answer_en: string | null;
	sort_order: number;
	is_active: boolean;
}

// Testimonial types
export interface Testimonial {
	id: string;
	quote: string;
	name: string;
	location: string;
	rating: number;
	avatar_url?: string;
	language: Language;
}

// Store settings
export interface StoreSettings {
	id: string;
	store_name: string;
	contact_email: string | null;
	instagram_url: string | null;
	address: string | null;
	usd_exchange_rate: number;
}

// Admin user
export interface AdminUser {
	id: string;
	email: string;
	name: string | null;
	role: 'admin' | 'super_admin' | 'viewer';
	created_at: string;
}

// Checkout form types
export interface CheckoutContactInfo {
	email: string;
	phone: string;
	subscribe_newsletter: boolean;
}

export interface CheckoutFormData {
	contact: CheckoutContactInfo;
	shipping: ShippingAddress;
}

// Component props types
export interface ModalProps {
	open: boolean;
	onClose: () => void;
}

export interface ButtonVariant {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	loading?: boolean;
	disabled?: boolean;
}
