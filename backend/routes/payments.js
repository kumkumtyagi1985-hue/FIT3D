const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Stripe is optional: the server must still boot cleanly for everything else
// (exercises, auth, admin stats) even if `stripe` isn't installed yet or no
// keys are set. Payment routes simply respond 501 until configured.
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    // eslint-disable-next-line global-require
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.warn('[payments] `stripe` package not installed yet — run `npm install stripe` to enable payments.');
}

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5500';

function requireStripe(req, res, next){
  if (!stripe) return res.status(501).json({ error: 'Stripe is not configured on this server. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in backend/.env (see .env.example) and run `npm install stripe`.' });
  next();
}

router.get('/status', requireAuth, (req, res) => {
  res.json({ plan: req.user.plan });
});

router.post('/create-checkout-session', requireAuth, requireStripe, async (req, res) => {
  const { planId } = req.body || {};
  if (planId !== 'pro') return res.status(400).json({ error: 'Unknown plan id' });
  if (!process.env.STRIPE_PRICE_ID) return res.status(500).json({ error: 'STRIPE_PRICE_ID is not set' });

  try {
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: req.user.email, name: req.user.name });
      customerId = customer.id;
      db.updateUser(req.user.id, { stripeCustomerId: customerId });
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: CLIENT_URL + '/index.html?checkout=success',
      cancel_url: CLIENT_URL + '/index.html?checkout=cancel',
      metadata: { userId: String(req.user.id) },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/portal', requireAuth, requireStripe, async (req, res) => {
  if (!req.user.stripeCustomerId) return res.status(400).json({ error: 'No billing account yet — subscribe first.' });
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: req.user.stripeCustomerId,
      return_url: CLIENT_URL + '/index.html',
    });
    res.json({ url: portal.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Mounted separately in server.js with express.raw() BEFORE the global JSON
// body parser, because Stripe's signature check needs the exact raw payload.
function webhookHandler(req, res){
  if (!stripe) return res.status(501).end();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata && session.metadata.userId);
    if (userId) db.updateUser(userId, { plan: 'pro', stripeCustomerId: session.customer });
  }
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const user = db.listUsers().find(u => u.stripeCustomerId === sub.customer);
    if (user) db.updateUser(user.id, { plan: 'free' });
  }
  res.json({ received: true });
}

module.exports = { router, webhookHandler };
