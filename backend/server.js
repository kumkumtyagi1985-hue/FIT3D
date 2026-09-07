require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercises');
const workoutRoutes = require('./routes/workouts');
const { router: paymentsRoutes, webhookHandler } = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// IMPORTANT: the Stripe webhook must be registered BEFORE express.json() below,
// using express.raw(), because Stripe's signature verification needs the exact
// unparsed request body. Once express.json() has consumed the stream for a
// request, raw bytes are gone — so ordering here is not arbitrary.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'fit3d-backend', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

// Optional convenience: serve the static frontend from this same server so
// `npm start` alone gives you the whole app at http://localhost:4000 during
// local development. Not required for deployment — frontend/ can equally be
// hosted separately on GitHub Pages/Netlify/Vercel (see README).
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get(/^(?!\/api\/).*/, (req, res, next) => {
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => { if (err) next(); });
});

// Central error handler — keeps stack traces out of API responses.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`FIT3D backend listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
