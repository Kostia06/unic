import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient, createSupabaseServiceClient } from '$utils/supabase';

// Generate order number like FU-2024-XXXX
function generateOrderNumber(): string {
	const year = new Date().getFullYear();
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `FU-${year}-${random}`;
}

// GET /api/orders - List orders (admin only)
export const GET: RequestHandler = async (event) => {
	const supabase = createSupabaseServerClient(event);

	try {
		// Check authentication
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return error(401, { message: 'Unauthorized' });
		}

		// Check if user is admin
		const { data: adminUser } = await supabase
			.from('admin_users')
			.select('id')
			.eq('id', user.id)
			.single();

		if (!adminUser) {
			return error(403, { message: 'Forbidden' });
		}

		// Query parameters
		const url = new URL(event.request.url);
		const status = url.searchParams.get('status');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Build query
		let query = supabase
			.from('orders')
			.select('*', { count: 'exact' })
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (status) {
			query = query.eq('order_status', status);
		}

		const { data, error: dbError, count } = await query;

		if (dbError) {
			console.error('Database error:', dbError);
			return error(500, { message: 'Failed to fetch orders' });
		}

		return json({
			orders: data || [],
			total: count || 0,
			hasMore: (data?.length || 0) === limit
		});
	} catch (err) {
		console.error('Orders API error:', err);
		return error(500, { message: 'Internal server error' });
	}
};

// POST /api/orders - Create new order (public)
export const POST: RequestHandler = async (event) => {
	// Use service client for creating orders (no auth required)
	const supabase = createSupabaseServiceClient();

	try {
		const body = await event.request.json();

		// Validate required fields
		if (!body.contact?.email?.trim()) {
			return error(400, { message: 'Email is required' });
		}
		if (!body.shipping?.full_name?.trim()) {
			return error(400, { message: 'Shipping name is required' });
		}
		if (!body.items?.length) {
			return error(400, { message: 'Cart cannot be empty' });
		}

		// Calculate totals
		const subtotalMxn = body.items.reduce(
			(sum: number, item: { price_mxn: number; quantity: number }) =>
				sum + item.price_mxn * item.quantity,
			0
		);

		// Determine charge currency and amount
		const currencyCharged = body.currency || 'MXN';
		const exchangeRate = body.exchangeRate || 17.5;
		const amountCharged = currencyCharged === 'USD'
			? subtotalMxn / exchangeRate
			: subtotalMxn;

		// Create order
		const { data, error: dbError } = await supabase
			.from('orders')
			.insert({
				order_number: generateOrderNumber(),
				customer_email: body.contact.email.trim().toLowerCase(),
				customer_phone: body.contact.phone?.trim() || null,
				shipping_address: body.shipping,
				items: body.items,
				subtotal_mxn: subtotalMxn,
				currency_charged: currencyCharged,
				amount_charged: amountCharged,
				payment_status: 'pending',
				order_status: 'new'
			})
			.select()
			.single();

		if (dbError) {
			console.error('Database error:', dbError);
			return error(500, { message: 'Failed to create order' });
		}

		return json({
			order: {
				id: data.id,
				order_number: data.order_number
			}
		}, { status: 201 });
	} catch (err) {
		console.error('Orders API error:', err);
		return error(500, { message: 'Internal server error' });
	}
};
