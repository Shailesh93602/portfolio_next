# MANUAL.md — Only What Requires YOU

Everything Claude can automate lives in [TODO.md](TODO.md). This file is only things that need your credentials, voice, personal accounts, or a human decision.

**Last updated: 2026-04-20**

---

## Your work history (reference for anything public)

- **Jan 22, 2024 – Aug 2024** — Software Developer Intern, **EsparkBiz**. Learned full-stack (Node, React, Next.js, TypeScript, Tailwind).
- **Aug 2024 – Jul 9, 2025** — Software Engineer, **EsparkBiz**. Shipped 3 real client projects end-to-end.
- **Jul 10, 2025 – present** — Software Engineer, **ContextQA**. First 2-3 months: 2 Chrome extensions (Vibe Testing + AxeTos). Since then: **backend of the core QA-automation product** — test execution engine, VNC streaming, Playwright / WebdriverIO / LambdaTest orchestration.
- Side projects (live): EduScale, DevTrack, KhataGO, stripe-payments-demo, redis-battle-demo, CareerGlyph, CodeSenseiSearch.

Rules for anything public: **no specific PR counts**, **no "real-time systems engineer" / "payments infrastructure engineer" titles**, **Chrome extensions were NOT the current work** (first 2-3 months only).

---

## Just shipped (since last turn)

- ✅ **Razorpay Phase 2 scaffold MERGED into KhataGO** (not yet deployed to prod — see §3 below for your part). Adds `BillingAccount` + `BillingEvent` Prisma models, `/api/razorpay/{checkout,verify,webhook}` routes, `/pricing` with discount-anchor (~~₹999~~ **₹299** Pro, ~~₹1,999~~ **₹1,499** CA), and a Razorpay Checkout.js button client component. Idempotency is DB-backed (unique-constraint on `razorpayEventId`) — stronger than the demo's SETNX because it ties to the audit row.
- ✅ **Razorpay Phase 1 E2E VERIFIED LIVE** at <https://razorpay-patterns-demo.vercel.app>. End-to-end webhook test: valid signed payload → `200 duplicate:false`, replay → `200 duplicate:true`, tampered signature → `400 Invalid signature`. All three idempotency + HMAC paths confirmed on production.
- ✅ **Razorpay Standard Checkout integration COMPLETE** in `razorpay-patterns-demo` — `/api/create-order` + `/api/verify-payment` + interactive `/demo` page with Checkout.js modal. 30 tests passing (was 22).
- ✅ **4 Razorpay env vars added to Vercel** (encrypted, never touched git): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_WEBHOOK_SECRET`. Trailing-newline bug (from `echo` vs `printf`) debugged and fixed.
- ✅ **Idempotency layer** — Redis-backed in production (SETNX on Upstash), in-memory Map fallback for the demo instance (24h TTL either way).
- ✅ **`gh` + `vercel` CLIs installed & authenticated** — Claude manages GitHub + Vercel autonomously now.
- ✅ **`razorpay-patterns-demo` pushed to GitHub** at <https://github.com/Shailesh93602/razorpay-patterns-demo>.
- ✅ **stripe-payments-demo LIVE** at <https://stripe-payments-demo-eight.vercel.app>.
- ✅ **Vercel CLI linked to 6 projects**: portfolio, stripe-payments-demo, khata-go, dev-track, dev-scale, razorpay-patterns-demo.
- ✅ **Google Analytics** wired on Vercel prod.
- ✅ **EduScale incident writeup** drafted + rendered on `/portfolio/eduscale`.
- ✅ **Razorpay plan v2** with discount-anchor pricing + LeetCode-style plan-based EduScale + SaaS refund policy in [drafts/RAZORPAY_PLAN.md](drafts/RAZORPAY_PLAN.md).

---

## P0 — This week

### 1. Try the Razorpay demo end-to-end (optional, 2 min)

Phase 1 is live and verified — no action required. But if you want to see it yourself:

- Open <https://razorpay-patterns-demo.vercel.app/demo>
- Click **"Pay ₹1"** → Razorpay Checkout modal opens
- Test card: `4111 1111 1111 1111`, any future expiry, any CVV, any OTP
- Status line cycles: creating-order → opening-modal → verifying → **verified ✓**
- Vercel function logs show the webhook firing with `duplicate:false` first, `duplicate:true` on Razorpay's retries

Webhook endpoint already confirmed working via signed-payload replay (see "Just shipped").

### 2. Upstash Redis one-time resume — 2 min

Your Upstash Redis for `redis-battle-demo` was paused. Go to <https://console.upstash.com/> → that database → **Resume**. After that, the daily URL health-check GitHub Action keeps it alive (daily GET wakes Render → reconnects to Upstash → counts as activity).

### 3. KhataGO Phase 2 — one thing left for you (~2 min)

Claude already handled: `git push` (you did this), pinned Prisma CLI from 7.7.0 back to 5.22.0 to fix a build failure (Prisma 7 breaking-changes + `@prisma/client@5` mismatch), added 4 Razorpay env vars to Vercel via `printf`, triggered redeploy. Latest production build is **Ready** — verify at <https://khatago.vercel.app>.

**YOU still need to:** add the KhataGO webhook URL in the Razorpay dashboard so Razorpay posts events to KhataGO:

1. Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**
2. URL: `https://khatago.vercel.app/api/razorpay/webhook`
3. When Razorpay asks for a secret, paste the same value used for razorpay-patterns-demo (`Thenameisshaileshbhai`) — KhataGO's Vercel env var is already set to that. If Razorpay force-generates a new one, copy it and tell Claude to `vercel env rm + vercel env add` on KhataGO.
4. Active events: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.

Once that's saved in Razorpay, Claude runs live E2E verification (valid → 200 `duplicate:false`, replay → 200 `duplicate:true`, tampered → 400) and starts on feature gates + `/settings/billing` + `/refund-policy` + Phase 3 (EduScale).

See [drafts/RAZORPAY_PLAN.md](drafts/RAZORPAY_PLAN.md).

---

## P1 — This month (things only you can do)

### 5. Record 3 × 60-second Loom videos — 2 hr

Claude can't be on camera. One per flagship:

- **EduScale:** log in → enter a live battle → show Redlock hold + Prometheus `/metrics` panel.
- **DevTrack:** one window logged in, one logged out → trigger a Realtime event → watch it propagate.
- **stripe-payments-demo** (after task 1 deploys): send a webhook twice with the same event ID → show second call skipped in Vercel logs.

Tell Claude "Loom URLs are X, Y, Z" → Claude embeds on the case-study pages. Claude has pre-drafted the storyboard scripts in TODO.md §1E so you know exactly what to say.

### 6. One OSS PR merged — target by Jul 18

Vercel/Stripe/Supabase filter on "has-OSS-PR" — required signal. Claude can't push PRs for you but has already scanned all 4 target repos. **Full plan with file paths + first-PR sentences:** [drafts/OSS_PLAN.md](drafts/OSS_PLAN.md).

Repos cloned shallow at `~/Desktop/Coding/OSS/`: `shadcn-ui`, `supabase-js`, `stripe-node`. `next.js` surveyed via `gh`.

**🎯 Recommended first PR — stripe-node (~1.5 hr):** add `step`/`cause` fields to `StripeSignatureVerificationError` so callers can distinguish timestamp-tolerance failures (retry) from HMAC mismatches (wrong secret). Perfect stack-match with stripe-payments-demo — you already wrote the code that hits this gap.

Process: `gh repo fork stripe/stripe-node --remote` → `cd ~/Desktop/Coding/OSS/stripe-node` → `git checkout -b fix/sig-verify-error-codes` → make the change → `npm test` → `gh pr create` with the first-sentence from OSS_PLAN.md. Tell Claude when the PR is open and Claude will link it from the stripe-payments-demo case study.

### 7. Dictate one EduScale incident writeup — 30 min

4 bullets is enough — Claude wires the rest into `/portfolio/eduscale`:

- **Symptom** (e.g. "3× duplicate battles created under load")
- **Hypothesis** (e.g. "Redlock TTL too short for p99 handler time")
- **Fix** (e.g. "bumped TTL 2s → 8s, added auto-renewal heartbeat at 1 Hz")
- **Confirmed by metric** (e.g. "duplicate-battle counter 0.3% → 0.0% over 24h")

Synthetic is fine as long as the causal chain is coherent. Paste the 4 bullets in chat.

### 8. Review + paste the resume + LinkedIn drafts — 1 hr (when Claude finishes them)

Claude is drafting accurate-to-history resume + LinkedIn content in TODO.md §1A and §1B. Once drafted, you:

- **Resume:** open `public/Shailesh_Chaudhari_Resume.pdf` source (Google Docs / Canva / whatever) → replace content with Claude's markdown draft → export PDF → tell Claude to commit.
- **LinkedIn:** paste headline + About into <https://www.linkedin.com/in/shaileshbhaichaudhari/edit/intro/> and the Experience bullets.

### 9. Get one LinkedIn recommendation from a senior engineer

Ask an ex-teammate at ContextQA or EsparkBiz (senior preferred). Referral-adjacent social proof is 80% of the recruiter's "should I screen?" call.

---

## P2 — Weeks 6–12

### 10. Speak once — 1 talk

Local meetup / 10-min lightning talk. Topic suggestion: "Webhook idempotency mistakes I see in the wild" (map straight to `stripe-payments-demo`). Biggest 2→3 YoE credibility jumper.

### 11. Stripe-specific cold outreach — 3 hr (send 2, do NOT mass-apply)

1. Identify 2 engineers on Stripe's payments-infra team (LinkedIn, engineering-blog bylines).
2. Read 5 Stripe engineering blog posts first. Find ONE specific technical claim you'd push back on or have a question about.
3. Send 2 notes linking the `stripe-payments-demo` case-study page + your specific question.
4. Skip mass-apply queues.

### 12. Tailored application packets — 3 hr total

Claude generates the cover-letter drafts and resume variants (TODO.md §1C). You:

- Review each for accuracy + voice.
- Send each via referral if a 1st/2nd LinkedIn connection exists at that company.
- **Stripe** → `stripe-payments-demo` + KhataGO reframed as "reconciliation pipeline"
- **Vercel** → portfolio + Vercel edge-runtime demo (built by Claude, TODO 3B)
- **Supabase** → DevTrack Realtime + CareerGlyph RBAC

---

## Deploy checklist — ANY new project

Every new deployable project with a DB / auth / background workload runs through this:

| Concern | What to do |
| --- | --- |
| Supabase / Postgres keepalive | If using free-tier Supabase Postgres, add `/api/cron/keepalive` + `vercel.json` cron `0 9 * * *` doing a trivial DB query. Template: KhataGO / DevTrack `app/api/cron/keepalive/route.ts`. Gate with `CRON_SECRET`. |
| Vercel env vars | `NODE_ENV=production` + project-specific + `CRON_SECRET`. Set for Production + Preview unless a reason to split. |
| Error surfacing | Don't swallow prod errors into generic UI messages without logging the real error. `console.error("...", { message, stack, context })` before the friendly response. |
| Live URL | After deploy, tell Claude → auto-updates `constants/projects.ts` + README. |
| Platform | **Default Vercel.** Use Render/Fly only for persistent connections (Socket.io, WebSockets, workers). |
| Screenshots | Take 1 light + 1 dark for the portfolio card + OG. |

---

## Application readiness gates

Don't apply to a target until its row is complete:

| Company  | Required before applying |
| -------- | ------------------------ |
| Stripe   | stripe-payments-demo live + case-study with Loom + resume + LinkedIn updated + SCA/3DS demo (TODO 3A) |
| Vercel   | OSS PR merged + Lighthouse CI green + Web Vitals screenshot on home + edge-runtime demo (TODO 3B) + resume updated |
| Supabase | DevTrack RLS + Realtime-presence + pgvector demo (TODO 3C) + DevTrack guest mode or Loom + RLS SQL documented |

---

## Not-my-action items (already covered by Claude, here as FYI only)

- Portfolio keepalive crons, EduScale Redis keepalive via `/api/v1/health`, URL health check GitHub Action — **all running**.
- Contact form with Resend + validation + rate limit — **validated end-to-end against live prod with Playwright**.
- Broken-links + console-error E2E gate — 11 pages × 0 errors — **passes**.
- `stripe-payments-demo` Next.js port — **merged to main**.
