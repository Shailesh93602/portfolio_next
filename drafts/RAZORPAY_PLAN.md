# Razorpay Integration Plan — Keep Demos + Wire Real Integrations

**Decision (2026-04-19):** User picked **both** — keep standalone demos AS demos, AND integrate Razorpay patterns into the real flagships (KhataGO + EduScale). Stripe demo stays as a pattern reference; Razorpay becomes the real-usage signal since it's India-accessible.

## Why Razorpay (not Stripe)

- **India-accessible** — no invite-only gate; you can sign up today at <https://razorpay.com/signup>.
- **Pattern parity with Stripe** — HMAC-SHA256 webhook signing, idempotency via event-id, async settlement, subscription + one-time order models. Everything you learn here transfers 1:1 to Stripe if US markets open up.
- **Active hiring in India** — Razorpay itself hires; Cashfree / Juspay / Setu are in the same cluster. This work directly qualifies you for those applications.

## Targets & deliverables

### 1. `razorpay-patterns-demo` (NEW standalone repo — Phase 1)

Mirror of `stripe-payments-demo`. Runnable in 5 minutes. 29+ passing tests. Deployed on Vercel.

**Contents:**

- `POST /api/webhook` — verifies `X-Razorpay-Signature` (HMAC-SHA256 of raw body with webhook secret), then SETNX on `razorpay:event:{payload.payment.entity.id}` for 24h TTL.
- `POST /api/order` — creates Razorpay order with caller-supplied `receipt` (idempotency key).
- `POST /api/simulate-payment` — replay helper: emits a pre-signed fake webhook, demonstrates idempotency without needing a live Razorpay transaction.
- `scripts/replay-webhook.mjs` — generates a signed fixture event locally, useful for CI + demos.
- Shared helpers (reused from `stripe-payments-demo`):
  - `lib/idempotency.ts` — Redis SETNX
  - `lib/retry.ts` — exp-backoff + jitter, skip 4xx
- Tests: Jest + supertest. Same 5 buckets (idempotency, webhook, orders, retry, app) → ~29 tests.
- Landing page (`app/page.tsx`) — static, renders sequence diagram + pattern explanation (no auth, no real money).

**Why a new repo, not extend stripe-payments-demo?** Focused readme/story per provider. A recruiter reviewing your Razorpay skills wants `razorpay-patterns-demo`, not "the Razorpay routes inside the Stripe demo."

### 2. KhataGO subscription billing (Phase 2)

**Real production usage.** Users pay ₹299/mo for CA Portal tier; ₹999/mo for Business tier. Pattern = Razorpay Subscriptions API.

**Plan:**

- Tiers: `free` (current), `ca_portal` (₹299/mo — multi-user CA dashboard), `business` (₹999/mo — multi-business accounts).
- Prisma model: `BillingAccount { id, userId, tier, razorpaySubscriptionId, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd }`.
- `/pricing` page — 3-tier comparison + "Subscribe" buttons.
- `POST /api/razorpay/checkout` — creates subscription via Razorpay Subscriptions API, returns `subscription_id` to frontend → opens Razorpay Checkout modal.
- `POST /api/razorpay/webhook` — handles:
  - `subscription.activated` → set tier + period dates
  - `subscription.charged` → extend period
  - `subscription.cancelled` → flag cancel_at_period_end
  - `subscription.paused` → pause access
  - `payment.failed` → notify + retry per Razorpay's native retry schedule
- Feature gates: CA Portal is gated by `user.billingAccount?.tier === "ca_portal"` → reject requests with 402 if free-tier user hits CA-only routes.
- Billing history UI at `/settings/billing` — list of charges, download invoices from Razorpay, cancel subscription.
- Tests: webhook idempotency (shared with razorpay-patterns-demo), subscription state machine transitions, feature-gate enforcement.

### 3. EduScale tournament entry fees (Phase 3)

**Real production usage.** Users pay ₹49–199 to enter a battle tournament. Pattern = Razorpay Orders API (one-time, not subscription).

**Plan:**

- `Tournament` model: add `entryFee: number`, `currency: string` (default INR), `maxEntrants`.
- `TournamentEntry` model: `{ id, userId, tournamentId, razorpayOrderId, razorpayPaymentId, status: 'pending' | 'paid' | 'refunded', paidAt }`.
- `POST /api/tournaments/:id/enter` — creates Razorpay Order with `notes: { tournamentId, userId }` → returns order_id to frontend.
- Frontend: Razorpay Checkout.js opens; on payment, fires webhook.
- `POST /api/razorpay/webhook` (shared patterns with KhataGO's webhook handler):
  - `order.paid` → find TournamentEntry by order_id → mark paid → grant tournament access
  - `payment.failed` → keep entry pending, surface retry option in UI
  - `refund.processed` → mark entry refunded (for cancelled tournaments)
- Refund flow: `POST /api/admin/tournaments/:id/cancel` creates Razorpay refunds for every paid TournamentEntry.
- Prometheus metrics: `tournament_entry_count_total`, `tournament_revenue_rupees_total`, `payment_failure_rate`.
- Integrates with existing Redlock — tournament start locks prevent mid-payment tournament cancellation.

---

## Prerequisites YOU need to do first

Before Claude can wire Razorpay into any project, you need to set up Razorpay and provide the keys.

### Step 1 — Create Razorpay account (10 min)

1. Sign up at <https://razorpay.com/signup>.
2. Choose "Individual / Freelancer" for fastest approval. Business account can come later.
3. Complete KYC lite (PAN + Aadhaar). Test mode works without full KYC — you only need full KYC when you want to accept real rupees.
4. You're in **Test Mode** by default — great for development.

### Step 2 — Get your API keys (2 min)

1. Dashboard → Settings → API Keys → **Generate Test Key**.
2. You'll see:
   - **Key ID:** `rzp_test_XXXXXXXXXXXXXX` (public — safe to ship to frontend)
   - **Key Secret:** `YYYYYYYYYYYY` (private — server-only, displayed ONCE)
3. **Save the Key Secret securely** — Razorpay doesn't show it again. If you lose it, generate a new key pair (old keys can be revoked later).

### Step 3 — Set up Webhook (per project, ~5 min each)

**Do this only AFTER the project is deployed** (so you have a live URL to point at). For each of the 3 projects:

1. Dashboard → Settings → Webhooks → **Add New Webhook**.
2. Webhook URL: `https://<deployed-url>/api/razorpay/webhook`
3. Secret: click "Generate" (Razorpay generates a random string). **Save this** — it's what you'll put in `RAZORPAY_WEBHOOK_SECRET` env var.
4. Active Events — select:
   - For **razorpay-patterns-demo**: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.
   - For **KhataGO**: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.paused`, `subscription.resumed`, `payment.failed`.
   - For **EduScale**: `order.paid`, `payment.captured`, `payment.failed`, `refund.processed`.
5. Click **Create Webhook**.

### Step 4 — Set env vars on Vercel (per project)

For each project, add these to Vercel → Settings → Environment Variables → Production:

| Variable | Value | Projects |
|---|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_...` from Step 2 | all 3 |
| `RAZORPAY_KEY_SECRET` | the secret from Step 2 | all 3 |
| `RAZORPAY_WEBHOOK_SECRET` | the secret from Step 3 (unique per project) | all 3 |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | same as `RAZORPAY_KEY_ID` (exposed to frontend for Checkout.js) | KhataGO, EduScale |

### Step 5 — For KhataGO + EduScale: create Razorpay Plans (subscription tiers) via API

Razorpay Plans define recurring pricing. Since you're using test mode, create them via the API once:

```bash
# Run this locally once with your test keys. Claude will provide the
# scripts/create-razorpay-plans.mjs script after Phase 2 starts.
RAZORPAY_KEY_ID=rzp_test_... \
RAZORPAY_KEY_SECRET=... \
node scripts/create-razorpay-plans.mjs
```

This creates `plan_xxx` IDs for CA Portal + Business tiers (KhataGO) and stores them in a seed file so subscribe-flows know which plan to use.

### Step 6 — Tell Claude when Phase 1 / 2 / 3 is ready

After your account + keys are set up, tell Claude:

- **"Razorpay account + keys ready, start Phase 1"** → Claude writes `razorpay-patterns-demo` code (no user keys needed for the code itself, but you'll need them to deploy).
- **"Phase 1 deployed at https://...; start Phase 2"** → Claude wires KhataGO. Needs webhook URL for step 3.
- **"KhataGO webhook + subscription tested; start Phase 3"** → Claude wires EduScale.

---

## Claude execution plan — what Claude will do (per phase)

### Phase 1 — razorpay-patterns-demo (2–3 hours of Claude time)

Claude starts this immediately — no user keys needed for code, only for deploy.

1. Create new repo `razorpay-patterns-demo` at `/Users/shaileshchaudhari/Desktop/Coding/razorpay-patterns-demo`. Bootstrap from stripe-payments-demo structure.
2. Swap Stripe SDK for `razorpay` npm package + node crypto HMAC verification (Razorpay doesn't ship a signature-constructor like Stripe's `constructEvent`; we hand-roll it).
3. Implement:
   - `lib/razorpay.ts` — lazy client + webhook signature verifier
   - `app/api/webhook/route.ts` — read raw body, verify `X-Razorpay-Signature`, SETNX idempotency, dispatch by event
   - `app/api/order/route.ts` — create Razorpay order with receipt + notes
   - `app/api/health/route.ts` — Redis ping
   - `scripts/replay-webhook.mjs` — fixture replay for local demo
4. Reuse shared helpers: `lib/idempotency.ts`, `lib/retry.ts` (from stripe-payments-demo).
5. Write 25+ Jest tests: idempotency (signature verify, SETNX success/collision, duplicate drop), webhook handlers per event type, order creation retry, signature rejection.
6. Landing page (`app/page.tsx`) with static sequence diagram + pattern explanation.
7. Add to portfolio: new entry in `constants/projects.ts` (id: `razorpay-patterns-demo`), Showcase component for the case-study page (similar to StripeCaseStudy.tsx but with Razorpay specifics).
8. Update `scripts/check-live-urls.mjs` + `public/llms.txt`.

### Phase 2 — KhataGO subscription billing (1 week of Claude time)

1. Prisma migration for `BillingAccount` model.
2. `/pricing` page (3 tiers, "Subscribe" CTAs).
3. `POST /api/razorpay/checkout` — create Razorpay Subscription, return subscription_id.
4. Frontend: Razorpay Checkout modal integration on `/pricing`, success redirect to `/settings/billing`.
5. `POST /api/razorpay/webhook` — handle 6 subscription event types + payment.failed.
6. `/settings/billing` — current plan, billing history (fetched from Razorpay via API), cancel button.
7. Feature gates middleware — CA-Portal-only routes check `req.user.billingAccount.tier`.
8. `scripts/create-razorpay-plans.mjs` — one-time seed for CA Portal + Business plans.
9. Tests: webhook signature verification, idempotent event processing, state-machine transitions (active → paused → resumed → cancelled), feature-gate enforcement, checkout happy path.
10. E2E: Playwright test that subscribes a test user, validates DB state, cancels, re-subscribes.
11. Portfolio update: reframe KhataGO case study to highlight the "real Razorpay subscription pipeline" section.

### Phase 3 — EduScale tournament entry fees (4–5 days of Claude time)

1. Prisma migrations: `Tournament.entryFee` + new `TournamentEntry` model.
2. Tournament listing page gets "Enter (₹99)" button.
3. `POST /api/tournaments/:id/enter` — creates Razorpay Order + pending `TournamentEntry`.
4. Frontend: Razorpay Checkout.js modal; on dismiss, keep entry pending (user can retry). On success, webhook takes over.
5. `POST /api/razorpay/webhook` — shares handler structure with KhataGO. Handles `order.paid`, `payment.captured`, `payment.failed`, `refund.processed`.
6. Admin: `/admin/tournaments/:id/cancel` → issues Razorpay refunds for all paid entries + marks tournament cancelled.
7. Prometheus metrics: entry count, revenue, failure rate per plan/tournament.
8. Tests: order creation idempotency, payment.captured marking entry paid, refund flow, access-gate (can't join battle without paid entry).
9. Portfolio: add "Tournament billing" to EduScale case study's architecture + incidents section.

---

## Risk register

- **Plan ID mismatch** between test and prod environments — Razorpay separates test vs live keys, so test plans don't work in live mode. Solution: `lib/razorpay-config.ts` reads `RAZORPAY_KEY_ID` prefix (`rzp_test_` vs `rzp_live_`) and picks the matching seeded plan ID.
- **Webhook race** — a webhook can arrive BEFORE the frontend's success redirect. Solution: the webhook is authoritative; frontend polls `/api/billing/status` or listens on Realtime.
- **Duplicate subscriptions** — user double-clicks "Subscribe". Solution: caller-supplied idempotency key on `/api/razorpay/checkout` + SETNX guard on `checkout:{user_id}:{plan_id}:{date}`.
- **Refund failures** — Razorpay refunds can fail (insufficient balance, card expired). Solution: refund.failed webhook → set TournamentEntry.status = "refund_failed" → admin gets email alert.
- **Test-mode payment failure simulation** — Razorpay test mode supports card numbers that force decline, insufficient funds, etc. Use these in Playwright E2E to cover failure paths.
- **GST / invoicing compliance (KhataGO)** — Indian SaaS billing needs GST. Razorpay can generate GST-compliant invoices if you enable it in Settings. Post-Phase-2 polish item.

---

## Summary table — what YOU do, what CLAUDE does

| Phase | What YOU do | What CLAUDE does |
|---|---|---|
| Prereq | Create Razorpay account, grab test keys | — |
| Phase 1: demo | Import repo on Vercel + add 3 env vars + create webhook in Razorpay dashboard + paste webhook secret | Write full repo (code + tests + landing page + portfolio entry) |
| Phase 2: KhataGO | Add 4 env vars on Vercel + run `create-razorpay-plans.mjs` once + add webhook URL in Razorpay dashboard + paste webhook secret | Write Prisma migration, pricing page, checkout+webhook routes, feature gates, /settings/billing page, tests, case-study update |
| Phase 3: EduScale | Same as Phase 2 for EduScale's Vercel project + add webhook in Razorpay dashboard | Write Tournament model, entry flow, admin cancel+refund, Prometheus metrics, tests, case-study update |

Total your effort: ~45 min of setup across all three phases. Rest is Claude executing.

---

## Open questions for you

1. **Launch price for KhataGO tiers?** Draft: ₹299 / ₹999. Adjust before we seed the Razorpay plans.
2. **EduScale tournament fee default?** Draft: ₹49 for regular tournaments, ₹199 for weekend "premier" tournaments. Per-tournament override allowed.
3. **Refund policy for EduScale tournaments** — full refund if tournament cancels? No refund if user no-shows? (Affects cancel flow code.)
4. **Naming** — go with `razorpay-patterns-demo` as the new repo name, or something else?

Tell Claude the answers and "start Phase 1" when ready.
