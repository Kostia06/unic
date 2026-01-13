import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$utils/supabase';

// GET /api/products - List all active products with variants
export const GET: RequestHandler = async (event) => {
	const supabase = createSupabaseServerClient(event);

	try {
		const url = new URL(event.request.url);
		const category = url.searchParams.get('category');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		// Build query
		let query = supabase
			.from('products')
			.select(`
				*,
				images:product_images(*),
				variant_types(
					*,
					options:variant_options(*)
				),
				variants:product_variants(*)
			`)
			.eq('is_active', true)
			.order('created_at', { ascending: false })
			.range(offset, offset + limit - 1);

		// Filter by category if provided
		if (category && category !== 'all') {
			query = query.eq('category', category);
		}

		const { data, error: dbError, count } = await query;

		if (dbError) {
			console.error('Database error:', dbError);
			return error(500, { message: 'Failed to fetch products' });
		}

		return json({
			products: data || [],
			total: count || 0,
			hasMore: (data?.length || 0) === limit
		});
	} catch (err) {
		console.error('Products API error:', err);
		return error(500, { message: 'Internal server error' });
	}
};

// POST /api/products - Create new product (admin only)
export const POST: RequestHandler = async (event) => {
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

		const body = await event.request.json();

		// Validate required fields
		if (!body.name_es?.trim()) {
			return error(400, { message: 'Product name (Spanish) is required' });
		}
		if (typeof body.base_price_mxn !== 'number' || body.base_price_mxn <= 0) {
			return error(400, { message: 'Valid price is required' });
		}

		// Insert product
		const { data, error: dbError } = await supabase
			.from('products')
			.insert({
				name_es: body.name_es.trim(),
				name_en: body.name_en?.trim() || null,
				description_es: body.description_es?.trim() || null,
				description_en: body.description_en?.trim() || null,
				category: body.category || null,
				base_price_mxn: body.base_price_mxn,
				has_variants: body.has_variants || false,
				is_active: body.is_active ?? true
			})
			.select()
			.single();

		if (dbError) {
			console.error('Database error:', dbError);
			return error(500, { message: 'Failed to create product' });
		}

		return json({ product: data }, { status: 201 });
	} catch (err) {
		console.error('Products API error:', err);
		return error(500, { message: 'Internal server error' });
	}
};
