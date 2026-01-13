import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';

// Type for our database (simplified, would be generated from Supabase)
export type Database = {
	public: {
		Tables: {
			products: {
				Row: {
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
				};
				Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['products']['Insert']>;
			};
			orders: {
				Row: {
					id: string;
					order_number: string;
					customer_email: string;
					customer_phone: string | null;
					shipping_address: Record<string, unknown>;
					items: Record<string, unknown>[];
					subtotal_mxn: number;
					currency_charged: string;
					amount_charged: number;
					stripe_payment_intent_id: string | null;
					payment_status: string;
					order_status: string;
					admin_notes: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Database['public']['Tables']['orders']['Insert']>;
			};
			contact_messages: {
				Row: {
					id: string;
					name: string;
					email: string;
					message: string;
					is_read: boolean;
					is_replied: boolean;
					created_at: string;
				};
				Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
				Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
			};
		};
	};
};

// Environment variables (will be set in .env)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client (singleton)
let browserClient: SupabaseClient<Database> | null = null;

export function createSupabaseBrowserClient() {
	if (browserClient) return browserClient;

	browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
	return browserClient;
}

// Server client (created per request)
export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

// Service role client (for admin operations)
export function createSupabaseServiceClient() {
	const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';
	return createClient<Database>(supabaseUrl, serviceRoleKey);
}

// Helper to get the appropriate client
export function getSupabaseClient(event?: RequestEvent) {
	if (isBrowser()) {
		return createSupabaseBrowserClient();
	}
	if (event) {
		return createSupabaseServerClient(event);
	}
	throw new Error('Server client requires RequestEvent');
}
