# FIT3D — 3D Exercise Guide & Workout Coach

A mobile-first fitness web app: pick a goal, browse exercises on a live
3D anatomical model with muscle highlighting, get an auto-generated
workout, and track progress — plus boxing mode, an AI workout generator,
Stripe subscriptions, and an admin analytics dashboard.

Built from a product PRD; see **Architecture** below for how the pieces map
to it.

---

## ✨ Features

- **Onboarding** → goal / level / location / equipment / time / target / bio
- **3D Exercise Viewer** — a procedural anatomical figure (Three.js) with
  per-muscle meshes; drag to rotate, front/side/back views, live
  primary/secondary muscle highlighting per exercise
- **Exercise Library** — search + filter by goal, body part, equipment
- **Workout Generator** — goal + level + equipment + time → warm-up / main /
  cooldown plan, picked only from the validated exercise database
- **Workout Player** — timers, rest screens, progress bar, pause/skip
- **Boxing Mode** — live punch combos animated on the 3D model, rounds, rest
- **AI Workout Generator** — natural-language input ("20 min arms, no
  equipment") parsed by a deterministic keyword parser — **never invents
  exercises**, only selects from the database
- **Gamification** — XP, levels, badges
- **Favorites**, **custom workouts**, **in-app admin panel** for exercise
  content (add/edit/delete, instantly live in the 3D viewer)
- **Accounts & Payments** — email/password auth (JWT), Stripe Checkout for a
  Pro subscription, billing portal
- **Admin Analytics Dashboard** (`admin.html`) — users, MRR, workout trends,
  goal popularity, plan split, top exercises

## 🧱 Architecture

```
fit3d/
├── frontend/         Static site — HTML/CSS/vanilla JS, no build step
│   ├── index.html    Main app (SPA, phone-frame layout)
│   ├── admin.html    Analytics dashboard (separate page)
│   ├── css/
│   └── js/
│       ├── data.js       Exercise dataset + workout generator (offline fallback)
│       ├── state.js      Runtime state + onboarding config
│       ├── api.js        Bridge to backend — degrades gracefully with no backend
│       ├── viewer.js     3D humanoid + muscle highlight + boxing punches
│       ├── ui.js          All screens
│       └── admin-dashboard.js
├── backend/          Node/Express API (optional, but required for
│   │                 accounts, payments, and live analytics)
│   ├── server.js
│   ├── db.js          Zero-config JSON file "database"
│   ├── routes/        auth, exercises, workouts, payments, admin
│   ├── middleware/    JWT auth, admin gate
│   └── seed/          Exercise dataset (kept in sync with frontend/js/data.js)
├── database/
│   └── schema.sql     PostgreSQL schema — production migration target
└── .github/workflows/deploy-pages.yml   Auto-deploys frontend/ to GitHub Pages
```

**Key design choice — the frontend works with *no* backend at all.**
`frontend/js/api.js` tries the backend if `window.FIT3D_API_BASE` is set and
reachable; if not, every screen (including the 3D viewer, workout generator,
and boxing mode) runs entirely off the bundled dataset in `data.js`. Deploy
`frontend/` alone to GitHub Pages and you have a fully working demo. Add
`backend/` when you want real accounts, payments, and live analytics — no
frontend code changes required, just set the API URL.

---

## 🚀 Quick start

### Option A — Frontend only (no backend, 60 seconds)

No install, no build. Any static file server works:

```bash
cd frontend
python3 -m http.server 5500
# open http://localhost:5500
```

Or just open `frontend/index.html` directly in a browser (some browsers
restrict `fetch` on `file://` URLs — a local server is safer).

Everything works except accounts, payments, and live analytics (admin.html
shows clearly-labeled demo data in this mode).

### Option B — Full stack (backend + frontend)

```bash
cd backend
cp .env.example .env        # edit if you want real Stripe keys
npm install
npm start                   # http://localhost:4000 — serves the frontend too
```

Then open `frontend/index.html` and set, near the top of the file:

```html
<script>
  window.FIT3D_API_BASE = 'http://localhost:4000/api';
</script>
```

(Do the same edit in `frontend/admin.html`.) Reload — the app now talks to
the real API. **The first account you register becomes an admin**, so sign
up once, then open `frontend/admin.html` (or the "Analytics Dashboard" link
on the Me tab) to see it.

---

## 🔑 Environment variables (`backend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | no (default 4000) | API port |
| `JWT_SECRET` | **yes**, in production | Signs login sessions |
| `CLIENT_URL` | yes | CORS + Stripe redirect URLs |
| `STRIPE_SECRET_KEY` | only for payments | Stripe API secret key |
| `STRIPE_PRICE_ID` | only for payments | Recurring price ID for the Pro plan |
| `STRIPE_WEBHOOK_SECRET` | only for payments | Verifies webhook signatures |

Without the Stripe variables, the app runs fine — the payment routes just
return `501 Not configured` instead of crashing the server, and the Pricing
screen tells the user payments aren't set up yet.

## 💳 Setting up Stripe (optional)

1. Create a [Stripe](https://dashboard.stripe.com) account, switch to **test mode**.
2. Create a recurring Product/Price (e.g. "FIT3D Pro", $7.99/month) → copy its `price_...` ID into `STRIPE_PRICE_ID`.
3. Copy your test **secret key** into `STRIPE_SECRET_KEY`.
4. For local testing, run the [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   stripe listen --forward-to localhost:4000/api/payments/webhook
   ```
   Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
5. In the app: Me → Upgrade to Pro → Stripe Checkout (test card `4242 4242 4242 4242`, any future date/CVC).

## 🌐 Deployment

**Frontend → GitHub Pages** (already automated, see below)
Push to `main` and GitHub Actions publishes `frontend/` to Pages automatically
(workflow at `.github/workflows/deploy-pages.yml`). Enable it once in your repo:
**Settings → Pages → Source: GitHub Actions**.

**Backend → Render / Railway / Fly.io** (any Node host works)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add the environment variables from the table above
- After deploying, set `window.FIT3D_API_BASE` in `frontend/index.html` and
  `frontend/admin.html` to your backend's URL (e.g.
  `https://fit3d-api.onrender.com/api`), commit, and Pages redeploys.

⚠️ The bundled JSON file database (`backend/data/db.json`) is **not
persistent** on most hosts with an ephemeral filesystem (e.g. Render's free
tier resets it on redeploy). That's fine for a demo; see below for real
persistence.

## 🐘 Going to production (Postgres)

`database/schema.sql` mirrors `backend/db.js`'s shape plus the full table
set from the product spec (goals, muscles, exercise_muscles, workouts,
favorites, subscriptions, etc.) so migrating is mostly mechanical:

1. Provision Postgres (Render/Railway/Supabase/RDS all work).
2. Run `database/schema.sql` against it.
3. Replace the functions in `backend/db.js` with equivalent queries using
   [`pg`](https://www.npmjs.com/package/pg) — every route only calls
   `db.getUserByEmail()`, `db.listExercises()`, etc., so routes don't change.
4. Seed `exercises` from `backend/seed/exercises.json`.

## 🔒 Notes on this demo build

- Passwords are hashed with bcrypt; sessions are JWTs — reasonable for a
  demo, but put this behind HTTPS in production and rotate `JWT_SECRET`.
- The JSON file DB has no concurrency control — fine for a single small
  instance, not for scale. Migrate to Postgres before real traffic.
- Admin analytics approximate exercise-level popularity via the `goal` tag
  logged with each workout (see `backend/routes/admin.js`), since per-set
  exercise logging isn't tracked at this MVP's data granularity.

## 📄 License

MIT — see [LICENSE](LICENSE).
