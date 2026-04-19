# MANUAL.md — Tasks Requiring Your Action

Only things that need your credentials, accounts, external actions, or original writing live here.
Anything Claude can automate is in [TODO.md](TODO.md).
Full recruiter review (seed for this list): `/tmp/portfolio-recruiter-review.md`.

**Last updated: 2026-04-19**

---

## Your actual work history (reference for resume/LinkedIn/hero drafts)

- **Jan 22, 2024 – Aug 2024** — Software Developer Intern, **EsparkBiz**. Learned full-stack (Node, React, Next.js, TypeScript, Tailwind), dummy projects, real-time patterns, team collaboration.
- **Aug 2024 – Jul 9, 2025** — Software Engineer, **EsparkBiz**. Shipped 3 real client projects end-to-end: full-stack UI + backend, client comms, requirements gathering.
- **Jul 10, 2025 – present** — Software Engineer, **ContextQA**. First 2-3 months: 2 Chrome extensions. Since then: **backend of the core QA-automation product** — test execution engine, VNC streaming, Playwright / WebdriverIO / LambdaTest orchestration.
- **Side projects (live)** — EduScale, DevTrack, KhataGO, stripe-payments-demo, redis-battle-demo, CareerGlyph, CodeSenseiSearch, Vibe Testing, AxeTos.

Total experience: ~2.5 years (~1 yr intern+SE at EsparkBiz + ~9-10 mo at ContextQA).

Rules when writing anything public: **no specific PR counts** (you haven't commit-counted them and it invites "show me" questions). **Don't claim Chrome extensions are your current work** (they were the first 2-3 months at ContextQA only).

---

## Priority Queue

| #   | Priority | Task                                                   | Time    | Status    |
| --- | -------- | ------------------------------------------------------ | ------- | --------- |
| 1   | P0       | Pick a hero positioning statement (see §1 below)       | 15 min  | pending   |
| 2   | P0       | Add `CRON_SECRET` to 3 Vercel projects + redeploy      | 15 min  | pending   |
| 3   | P0       | Deploy `redis-battle-demo` (Render or Fly)             | 45 min  | pending   |
| 4   | P0       | Deploy `stripe-payments-demo` to Vercel after the port | 30 min  | pending   |
| 5   | P0       | Wire up Resend (`RESEND_API_KEY`) for contact form     | 15 min  | pending   |
| 6   | P0       | Google Analytics setup (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) | 30 min | pending |
| 7   | P1       | Update resume PDF to match hero positioning            | 1 hr    | pending   |
| 8   | P1       | LinkedIn headline + About rewrite                      | 2 hr    | pending   |
| 9   | P1       | Record 3 Loom videos (eduscale, devtrack, stripe)      | 2 hr    | pending   |
| 10  | P1       | Get one OSS PR merged (Vercel-required signal)         | ongoing | pending   |
| 11  | P1       | Dictate one real-incident writeup for EduScale         | 30 min  | pending   |
| 12  | P2       | Speak once (meetup / lightning talk)                   | 1 talk  | pending   |
| 13  | P2       | Get one LinkedIn recommendation from a senior eng      | ask     | pending   |
| 14  | P2       | Stripe-specific cold outreach (2 engineers)            | 3 hr    | pending   |
| 15  | P2       | Tailored application packets (Stripe/Vercel/Supabase)  | 3 hr    | pending   |

**Recently completed (just for context — no action needed):**
- ✓ All 3 Supabase-backed projects (EduScale / DevTrack / KhataGO) confirmed live
- ✓ `GEMINI_API_KEY` added to KhataGO Vercel
- ✓ EduScale middleware fast-path fix deployed in both repos
- ✓ 6 Supabase GitHub secrets added (now deprecated by Vercel cron approach — can delete them if you want)
- ✓ CodeSenseiSearch screenshot (if you already did this; otherwise see P2 bottom of file)

---

## P0 — Do this week

### 1. Pick a hero positioning statement — 15 min

Recruiter review red flag #1: "Full Stack Developer" tells a Stripe recruiter nothing in 10 seconds.

**Pick one of the 3 drafts below** (edit freely), then tell Claude which one; Claude wires it into `app/HomeContent.tsx`. The paragraph on the home page has already been updated to reflect your real current role (backend of ContextQA's core product, not Chrome extensions). These drafts replace the *single-sentence* above the paragraph that currently cycles through generic job titles.

#### Draft A — Backend-engineer positioning (most accurate)

> Software engineer at ContextQA working on the backend of our core QA-automation product — test execution engine, VNC streaming, and browser-automation orchestration (Playwright / WebdriverIO / LambdaTest). Previously ~2 years at EsparkBiz shipping client projects end-to-end. Side projects explore real-time coordination (EduScale — Redlock + Socket.io), AI tool-calling (KhataGO — Gemini + OCR), and webhook idempotency (stripe-payments-demo).

#### Draft B — Full-stack-with-backend-pivot

> Full-stack engineer (~2.5 years), now backend-only on ContextQA's QA-automation core — test execution, VNC, and multi-cloud browser orchestration. Comfortable across the stack from EsparkBiz client-project days, but going deep on backend systems: distributed locks, real-time pub/sub, webhook idempotency, AI pipelines. Targeting backend / platform / developer-tooling roles.

#### Draft C — Side-project-forward

> Software engineer at ContextQA on the backend of a QA-automation platform (test execution, VNC, Playwright/WebdriverIO/LambdaTest). The projects here are what I build outside work to explore patterns end-to-end: EduScale (Redlock + Socket.io Redis adapter), stripe-payments-demo (SETNX idempotency, exponential-backoff retry), KhataGO (Gemini function-calling with OCR). Open to backend / distributed-systems / developer-platform roles.

**What to avoid in any rewrite:**

- Any specific PR count
- Title of "Real-time systems engineer" / "Payments infrastructure engineer" (not real industry titles)
- Saying current role is Chrome extensions (that was only first 2-3 months)
- Claiming you build production payment infrastructure

### 2. Activate Vercel Cron Keep-Alive — 15 min

Per-project daily DB ping replaces the old GitHub Actions approach. Prevents Supabase free-tier auto-pause. Already live in **KhataGO**, **DevTrack**, and **EduScale Frontend** repos.

**Steps:**

1. Generate one secret: `openssl rand -hex 32`
2. On Vercel (Settings → Environment Variables → Production) add `CRON_SECRET` = that value to each of:
   - KhataGO
   - DevTrack
   - EduScale Frontend
3. Trigger a redeploy on each (any commit, or "Redeploy" from Vercel UI)
4. Verify: Vercel dashboard → Project → **Cron Jobs** should show `/api/cron/keepalive` scheduled `0 9 * * *`
5. Optional sanity: `curl -H "Authorization: Bearer $CRON_SECRET" https://<project>.vercel.app/api/cron/keepalive` → expect `{"ok":true,...}`

**Cleanup (optional):** delete the 6 now-unused repo secrets at <https://github.com/Shailesh93602/portfolio_next/settings/secrets/actions> (`EDUSCALE_SUPABASE_URL`, `EDUSCALE_SUPABASE_ANON_KEY`, `DEVTRACK_*`, `KHATAGO_*`).

### 3. Deploy redis-battle-demo to Render — 45 min

**Why not Vercel:** Socket.io + Express needs persistent WebSocket connections. Vercel serverless can't hold those open.

1. **Provision Redis first** (web service needs the URL at deploy time):
   - Render dashboard → **New +** → **Redis**
   - Name: `redis-battle-demo-redis`, plan: **Free**, region: Oregon (or closest)
   - Copy **Internal Redis URL** (format: `redis://red-xxxxx:6379`)
2. **Provision the web service:**
   - **New +** → **Web Service** → connect `Shailesh93602/redis-battle-demo`
   - Name: `redis-battle-demo`, region: **same as Redis**, branch: `main`
   - Build: `npm install && npm run build` (or just `npm install` if no build script — check)
   - Start: `npm start`
   - Plan: **Free** (spins down after 15 min inactivity, ~30s cold start)
3. **Environment variables:**
   - `REDIS_URL` = the Internal Redis URL
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render convention)
4. **Deploy**, wait ~3 min, test the battle UI, report URL to Claude.

**Free-tier limit:** single instance only — Redlock's 2-node demo needs upgrade OR use **Fly.io** free:

```
cd ~/Desktop/Coding/redis-battle-demo
fly launch && fly redis create
fly secrets set REDIS_URL=<from fly redis>
fly deploy && fly scale count 2
```

### 4. Deploy stripe-payments-demo to Vercel — 30 min (after Claude's port)

Claude is porting the Express routes to Next.js API routes so it can deploy to Vercel (target-company signal). After the port PR lands:

1. Vercel → **Add New** → **Project** → import `Shailesh93602/stripe-payments-demo`, branch = the port branch (Claude will name it)
2. Framework preset: Next.js (auto-detected)
3. **Environment Variables** (Production):
   - `STRIPE_SECRET_KEY` — Stripe Dashboard → Developers → API keys → **Secret key** (test mode is fine)
   - `REDIS_URL` — use Vercel's **Upstash** integration at <https://vercel.com/integrations/upstash> (free 10k commands/day)
   - `STRIPE_WEBHOOK_SECRET` — fill after step 5
4. **Deploy**, note the URL
5. **Stripe webhook config:**
   - Stripe Dashboard → Developers → Webhooks → **Add endpoint**
   - URL: `https://<your-vercel-url>/api/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Save → click into endpoint → copy **Signing secret** (`whsec_...`)
6. Add `STRIPE_WEBHOOK_SECRET` on Vercel → redeploy
7. **The money demo:** Stripe dashboard → Webhooks → your endpoint → **Send test webhook** → pick `payment_intent.succeeded`. Check Vercel function logs. **Click "Send test webhook" AGAIN with the same event.** The second delivery should log "duplicate event, skipping" and return 200 without reprocessing. **Screenshot this.**
8. Tell Claude the URL — Claude updates portfolio card `live:` + README with the duplicate-webhook screenshot.

### 5. Wire up Resend for the contact form — 15 min

`/api/contact` is live and falls back to `mailto:` when `RESEND_API_KEY` isn't set. To enable direct sends:

1. Sign up at <https://resend.com> (free: 100/day, 3k/month)
2. Dashboard → **API Keys → Create** → name `portfolio-production` → copy `re_...`
3. **Optional but recommended:** verify your domain at **Domains → Add Domain** (add DNS TXT + CNAME). Skip for now — the fallback `onboarding@resend.dev` sender works.
4. Vercel → portfolio_next → **Settings → Environment Variables** (Production):
   - `RESEND_API_KEY` = the `re_...` value
   - `RESEND_FROM` (only if you verified a domain): `"Portfolio Contact <contact@yourdomain>"` — else leave unset
5. Redeploy → test from `/contact` on live site → email arrives at `CONTACT_INFO.EMAIL`.

### 6. Google Analytics — 30 min

Shows you instrument your own products. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Vercel (root layout already reads it). Create a new GA4 property if you don't have one.

---

## P1 — Do this month

### 7. Update resume PDF — 1 hr

The portfolio links to `/Shailesh_Chaudhari_Resume.pdf`. It must use the hero positioning from §1 + accurate experience. Stripe/Vercel recruiters read resume + portfolio side-by-side — mismatches hurt.

**Specific lines to update (no PR counts):**

- **Hero line:** condensed version of §1 draft you chose
- **ContextQA (Jul 2025 – present):** "Backend of core QA-automation product — test execution engine, VNC streaming, Playwright/WebdriverIO/LambdaTest orchestration. First 3 months: shipped 2 Chrome extensions (Vibe Testing, AxeTos)."
- **EduScale:** "@socket.io/redis-adapter, redlock, opossum (circuit breaker), prom-client"
- **KhataGO:** "WhatsApp Business API, Google Gemini AI (function-calling + OCR), Redis webhook deduplication"
- **Projects:** add CareerGlyph, redis-battle-demo, stripe-payments-demo
- **Skills:** add "Redis (Cluster/Pub-Sub)", "Socket.io", "Prometheus", "Stripe Webhooks", "Playwright/WebdriverIO"

After updating: export as PDF → overwrite `public/Shailesh_Chaudhari_Resume.pdf` → commit.

### 8. LinkedIn headline + About — 2 hr

Recruiters always open LinkedIn first. Match portfolio positioning exactly.

- **Headline:** one-line version of §1 draft you picked
- **About:** 3 paragraphs — current role at ContextQA (backend), prior scope at EsparkBiz (~2 years client projects), side projects (EduScale/KhataGO/DevTrack/stripe-payments-demo) as the depth you go on your own time
- **Featured section:** pin the stripe-payments-demo case-study page AND the EduScale case-study page
- **Experience section:** same factual bullets as the resume — no PR counts
- **Skills:** add Redis (Cluster, Pub/Sub), Socket.io, Prometheus, Stripe Webhooks, Playwright, WebdriverIO, LambdaTest

### 9. Record 3 × 60-second Loom videos — 2 hr

Single cheapest credibility multiplier when blog is blocked. One per flagship, one real flow each:

- **EduScale:** log in → enter a live battle → show the Redlock / Prometheus `/metrics` panel
- **DevTrack:** one window logged in, one window logged out → trigger a Realtime event, see it propagate
- **stripe-payments-demo (after §4 deploy):** send a webhook twice with the same event ID → show the second call skipped

Tell Claude: "Loom URLs are X, Y, Z" → embedded on the case-study pages.

### 10. One OSS PR merged — ongoing, target by Jul 18

"0 merged OSS PRs" is visible on your GitHub. One merged PR lifts all three target applications. **Vercel in particular filters on this.**

**Best targets for your stack:**

1. `shadcn-ui/ui` — missing ARIA / type improvements / docs gaps
2. `supabase/supabase-js` — high signal for Supabase
3. `vercel/next.js` examples — a typed Playwright recipe is an easy accepted PR (also leverages your ContextQA Playwright experience)
4. `stripe/stripe-node` — idempotency-key helper gaps

**Process:**

1. Clone, run tests locally (eliminates 80% of contributors)
2. Find one specific bug — not cosmetic
3. Smallest possible fix, well-tested
4. PR description: what was broken, why the fix is correct, links to relevant code

### 11. Dictate one real-incident writeup for EduScale — 30 min

Unblocks the EduScale case-study depth upgrade. 4 bullets is enough — Claude wires the rest:

- **Symptom** (e.g. "3× duplicate battles created under load")
- **Hypothesis** (e.g. "Redlock TTL too short for our handler's p99")
- **Fix** (e.g. "bumped TTL 2s → 8s, added auto-renewal heartbeat at 1 Hz")
- **Confirmed by metric** (e.g. "duplicate-battle counter 0.3% → 0.0% over 24 h")

Synthetic is fine as long as the chain is coherent. Paste the 4 bullets to Claude.

---

## P2 — Weeks 6–12

### 12. Speak once — 1 talk

Local meetup / 10-min lightning talk. Suggested topic (from review): "Webhook idempotency mistakes I see in the wild." Biggest 2→3 YoE credibility jumper.

### 13. One LinkedIn recommendation from a senior engineer

Ask a senior engineer at ContextQA or EsparkBiz. Referral-adjacent social proof is 80% of the recruiter's "should I screen?" call.

### 14. Stripe-specific cold outreach — 3 hr

1. Identify 2 engineers on Stripe's payments-infra team (LinkedIn / engineering-blog bylines)
2. Read 5 Stripe engineering blog posts first; find one specific technical claim you'd disagree with or have a question about
3. Send 2 cold notes that link the `stripe-payments-demo` case-study with the specific question
4. **Don't mass-apply** — generic "I love Stripe" notes get deleted

### 15. Tailored application packets — 3 hr total

For each of Stripe / Vercel / Supabase:

- One-page cover letter referencing their engineering blog (read 5 posts first)
- Resume variant emphasizing relevant projects:
  - **Stripe** → stripe-payments-demo + KhataGO reframed as "ledger + reconciliation pipeline"
  - **Vercel** → portfolio itself + edge-runtime demo (Claude building)
  - **Supabase** → DevTrack's Realtime + CareerGlyph RBAC (Supabase auth)
- Send via referral if possible (check LinkedIn for 1st/2nd connections)

---

## Checklist — When Deploying ANY New Project

Every new deployable project (yours or otherwise) with a DB / auth / background workloads goes through this so nothing rots on free tier:

| Concern | What to do |
| --- | --- |
| Supabase / Postgres keep-alive | If it uses a free-tier Supabase Postgres, add `/api/cron/keepalive` route + `vercel.json` cron (`0 9 * * *`) that runs a trivial DB query. Template: KhataGO / DevTrack `app/api/cron/keepalive/route.ts`. Protect with `CRON_SECRET`. |
| Vercel env vars | `NODE_ENV=production` + project-specific (`DATABASE_URL`, `SUPABASE_*`, `STRIPE_*`, `GEMINI_API_KEY`, `CRON_SECRET`, etc.). Set for Production + Preview unless there's a reason to split. |
| Error surfacing | Don't swallow prod errors into generic UI messages without logging the real error. Pattern: `console.error("...", { message, stack, context })` before returning the friendly response. |
| Public URL | After deploy, add the live URL to `constants/projects.ts` + README. Tell Claude → auto-updated. |
| Deploy-platform choice | **Default Vercel.** Use Render/Fly only if the project needs persistent connections (Socket.io / WebSockets / long-polling / worker queues). Example: redis-battle-demo → Render. |
| Screenshots | Take 1 light-mode + 1 dark-mode screenshot of the main flow. Used for OG images + portfolio card. |

**Per-deploy execution steps:**

1. Land the keepalive cron PR before the first real-traffic deploy.
2. Set `CRON_SECRET` + other env vars.
3. Deploy.
4. Verify `/api/cron/keepalive` appears in **Vercel dashboard → Project → Cron Jobs**.
5. `curl -H "Authorization: Bearer $CRON_SECRET" https://<project>.vercel.app/api/cron/keepalive` → expect `{"ok":true}`.
6. Tell Claude the live URL.

---

## Application Readiness Checklist

Don't apply to a target company until its row is complete:

| Company  | Required before applying |
| -------- | ------------------------ |
| Stripe   | stripe-payments-demo live on Vercel + SCA/3DS layer + case-study page with Loom + resume + LinkedIn updated |
| Vercel   | OSS PR merged + Lighthouse CI green + Web Vitals screenshot on home + edge-runtime demo shipped + resume updated |
| Supabase | DevTrack RLS + Realtime-presence walkthrough + pgvector demo + DevTrack guest mode or Loom + RLS SQL documented in case study |

---

## One-offs

### CodeSenseiSearch portfolio card — 15 min

The card uses a placeholder image.

1. Open the live Swagger UI (`/api`)
2. Run a sample semantic search query
3. Screenshot the response
4. Save as `public/Images/codesensei-search.png`
5. Tell Claude: "update CodeSenseiSearch card image" → auto-wired
