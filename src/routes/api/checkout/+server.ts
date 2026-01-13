import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';

// Initialize Stripe (will use env var)
const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY || '';
const stripeConnectAccountId = import.meta.env.STRIPE_CONNECT_ACCOUNT_ID || '';

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// POST /api/checkout - Create Stripe PaymentIntent
export const POST: RequestHandler = async ({ request }) => {
	if (!stripe) {
		console.warn('Stripe not configured');
		return error(503, { message: 'Payment service not configured' });
	}

	try {
		const body = await request.json();

		// Validate
		if (!body.amount || body.amount <= 0) {
			return error(400, { message: 'Valid amount is required' });
		}
		if (!body.currency || !['mxn', 'usd'].includes(body.currency.toLowerCase())) {
			return error(400, { message: 'Valid currency (MXN or USD) is required' });
		}
		if (!body.orderId) {
			return error(400, { message: 'Order ID is required' });
		}

		// Convert to cents
		const amountInCents = Math.round(body.amount * 100);

		// Calculate platform fee (30%)
		const platformFee = Math.round(amountInCents * 0.30);

		// Create PaymentIntent with Connect split
		const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
			amount: amountInCents,
			currency: body.currency.toLowerCase(),
			metadata: {
				order_id: body.orderId,
				customer_email: body.customerEmail || ''
			},
			// Enable automatic payment methods for Mexico
			automatic_payment_methods: {
				enabled: true
			}
		};

		// Add Connect destination if configured
		if (stripeConnectAccountId) {
			paymentIntentParams.application_fee_amount = platformFee;
			paymentIntentParams.transfer_data = {
				destination: stripeConnectAccountId
			};
		}

		const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

		return json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id
		});
	} catch (err) {
		console.error('Checkout API error:', err);

		if (err instanceof Stripe.errors.StripeError) {
			return error(400, { message: err.message });
		}

		return error(500, { message: 'Failed to create payment intent' });
	}
};
