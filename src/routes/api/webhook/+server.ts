import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { createSupabaseServiceClient } from '$utils/supabase';

const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY || '';
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const POST: RequestHandler = async ({ request }) => {
	if (!stripe || !webhookSecret) {
		console.warn('Stripe webhook not configured');
		return error(503, { message: 'Webhook not configured' });
	}

	const supabase = createSupabaseServiceClient();

	try {
		const body = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			return error(400, { message: 'Missing signature' });
		}

		// Verify webhook signature
		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
		} catch (err) {
			console.error('Webhook signature verification failed:', err);
			return error(400, { message: 'Invalid signature' });
		}

		console.log(`Received webhook event: ${event.type}`);

		// Handle the event
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				await handlePaymentSuccess(supabase, paymentIntent);
				break;
			}

			case 'payment_intent.payment_failed': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				await handlePaymentFailure(supabase, paymentIntent);
				break;
			}

			case 'payment_intent.canceled': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				await handlePaymentCanceled(supabase, paymentIntent);
				break;
			}

			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session;
				await handleCheckoutComplete(supabase, session);
				break;
			}

			case 'charge.refunded': {
				const charge = event.data.object as Stripe.Charge;
				await handleRefund(supabase, charge);
				break;
			}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook error:', err);
		return error(500, { message: 'Webhook handler failed' });
	}
};

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	paymentIntent: Stripe.PaymentIntent
) {
	const orderId = paymentIntent.metadata.order_id;
	const orderNumber = paymentIntent.metadata.order_number;

	if (!orderId && !orderNumber) {
		console.warn('Payment succeeded but no order ID found in metadata');
		return;
	}

	// Find and update the order
	const query = orderId
		? supabase.from('orders').update({
				payment_status: 'paid',
				stripe_payment_intent_id: paymentIntent.id,
				fulfillment_status: 'processing',
				updated_at: new Date().toISOString()
			}).eq('id', orderId)
		: supabase.from('orders').update({
				payment_status: 'paid',
				stripe_payment_intent_id: paymentIntent.id,
				fulfillment_status: 'processing',
				updated_at: new Date().toISOString()
			}).eq('order_number', orderNumber);

	const { error: updateError, data } = await query.select().single();

	if (updateError) {
		console.error('Failed to update order after payment success:', updateError);
		return;
	}

	console.log(`Order ${orderId || orderNumber} payment succeeded - Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);

	// TODO: Send confirmation email
	// await sendOrderConfirmationEmail(data);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	paymentIntent: Stripe.PaymentIntent
) {
	const orderId = paymentIntent.metadata.order_id;
	const orderNumber = paymentIntent.metadata.order_number;

	if (!orderId && !orderNumber) {
		console.warn('Payment failed but no order ID found in metadata');
		return;
	}

	const failureMessage = paymentIntent.last_payment_error?.message || 'Unknown error';

	const query = orderId
		? supabase.from('orders').update({
				payment_status: 'failed',
				stripe_payment_intent_id: paymentIntent.id,
				notes: `Payment failed: ${failureMessage}`,
				updated_at: new Date().toISOString()
			}).eq('id', orderId)
		: supabase.from('orders').update({
				payment_status: 'failed',
				stripe_payment_intent_id: paymentIntent.id,
				notes: `Payment failed: ${failureMessage}`,
				updated_at: new Date().toISOString()
			}).eq('order_number', orderNumber);

	const { error: updateError } = await query;

	if (updateError) {
		console.error('Failed to update order after payment failure:', updateError);
		return;
	}

	console.log(`Order ${orderId || orderNumber} payment failed: ${failureMessage}`);
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	paymentIntent: Stripe.PaymentIntent
) {
	const orderId = paymentIntent.metadata.order_id;
	const orderNumber = paymentIntent.metadata.order_number;

	if (!orderId && !orderNumber) {
		return;
	}

	const query = orderId
		? supabase.from('orders').update({
				payment_status: 'canceled',
				fulfillment_status: 'cancelled',
				updated_at: new Date().toISOString()
			}).eq('id', orderId)
		: supabase.from('orders').update({
				payment_status: 'canceled',
				fulfillment_status: 'cancelled',
				updated_at: new Date().toISOString()
			}).eq('order_number', orderNumber);

	const { error: updateError } = await query;

	if (updateError) {
		console.error('Failed to update order after payment canceled:', updateError);
		return;
	}

	console.log(`Order ${orderId || orderNumber} payment was canceled`);
}

/**
 * Handle checkout session completion (if using Stripe Checkout)
 */
async function handleCheckoutComplete(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	session: Stripe.Checkout.Session
) {
	const orderId = session.metadata?.order_id;
	const orderNumber = session.metadata?.order_number;

	if (!orderId && !orderNumber) {
		console.warn('Checkout completed but no order ID found in metadata');
		return;
	}

	// Update order with session info
	const query = orderId
		? supabase.from('orders').update({
				stripe_session_id: session.id,
				payment_status: session.payment_status === 'paid' ? 'paid' : 'pending',
				customer_email: session.customer_email || undefined,
				updated_at: new Date().toISOString()
			}).eq('id', orderId)
		: supabase.from('orders').update({
				stripe_session_id: session.id,
				payment_status: session.payment_status === 'paid' ? 'paid' : 'pending',
				customer_email: session.customer_email || undefined,
				updated_at: new Date().toISOString()
			}).eq('order_number', orderNumber);

	const { error: updateError } = await query;

	if (updateError) {
		console.error('Failed to update order after checkout completion:', updateError);
		return;
	}

	console.log(`Checkout session completed for order ${orderId || orderNumber}`);
}

/**
 * Handle refund
 */
async function handleRefund(
	supabase: ReturnType<typeof createSupabaseServiceClient>,
	charge: Stripe.Charge
) {
	const paymentIntentId = charge.payment_intent;

	if (!paymentIntentId || typeof paymentIntentId !== 'string') {
		console.warn('Refund received but no payment intent ID');
		return;
	}

	const isFullRefund = charge.refunded && charge.amount_refunded === charge.amount;
	const newStatus = isFullRefund ? 'refunded' : 'partially_refunded';

	const { error: updateError } = await supabase
		.from('orders')
		.update({
			payment_status: newStatus,
			notes: `Refunded ${charge.amount_refunded / 100} ${charge.currency.toUpperCase()}`,
			updated_at: new Date().toISOString()
		})
		.eq('stripe_payment_intent_id', paymentIntentId);

	if (updateError) {
		console.error('Failed to update order for refund:', updateError);
		return;
	}

	console.log(`Order refund processed: ${charge.amount_refunded / 100} ${charge.currency.toUpperCase()} (${newStatus})`);
}
