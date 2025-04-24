import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const createStripeCheckout = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'O usuário precisa estar autenticado.'
    );
  }

  const { userId } = data;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: userId,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Erro ao criar sessão do Stripe:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao criar sessão de pagamento.'
    );
  }
});

export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig!, endpointSecret!);
  } catch (err) {
    console.error('Erro na verificação da assinatura do webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      try {
        await admin.firestore().collection('users').doc(userId).update({
          premium: true,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ received: true });
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
      }
    }
  } else {
    res.json({ received: true });
  }
}); 