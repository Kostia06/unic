import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const handle: Handle = async ({ event, resolve }) => {
	// Skip if Supabase is not configured
	if (!supabaseUrl || !supabaseAnonKey) {
		return resolve(event);
	}

	// Create Supabase client
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

	// Safe session getter
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Protect admin routes
	if (event.url.pathname.startsWith('/admin')) {
		const { session, user } = await event.locals.safeGetSession();

		// Redirect to login if not authenticated
		if (!session || !user) {
			if (event.url.pathname !== '/admin/login') {
				return new Response(null, {
					status: 303,
					headers: { location: '/admin/login' }
				});
			}
		} else {
			// Check if user is admin
			const { data: adminUser } = await event.locals.supabase
				.from('admin_users')
				.select('id')
				.eq('id', user.id)
				.single();

			if (!adminUser && event.url.pathname !== '/admin/login') {
				return new Response(null, {
					status: 303,
					headers: { location: '/admin/login?error=not_admin' }
				});
			}

			event.locals.session = session;
			event.locals.user = user;
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
