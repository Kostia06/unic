import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$utils/supabase';

export const POST: RequestHandler = async (event) => {
	const supabase = createSupabaseServerClient(event);

	try {
		const body = await event.request.json();
		const { name, email, message } = body;

		// Validation
		if (!name?.trim()) {
			return error(400, { message: 'Name is required' });
		}
		if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return error(400, { message: 'Valid email is required' });
		}
		if (!message?.trim()) {
			return error(400, { message: 'Message is required' });
		}

		// Insert message
		const { data, error: dbError } = await supabase
			.from('contact_messages')
			.insert({
				name: name.trim(),
				email: email.trim().toLowerCase(),
				message: message.trim(),
				is_read: false,
				is_replied: false
			})
			.select()
			.single();

		if (dbError) {
			console.error('Database error:', dbError);
			return error(500, { message: 'Failed to save message' });
		}

		return json({ success: true, id: data.id });
	} catch (err) {
		console.error('Contact API error:', err);
		return error(500, { message: 'Internal server error' });
	}
};
