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

| #   | Priority | Task                                                    | Time    | Status   |
| --- | -------- | ------------------------------------------------------- | ------- | -------- |
| 1   | P0       | Redeploy the 3 Vercel projects to pick up `CRON_SECRET` | 5 min   | pending  |
| 2   | P0       | Merge + deploy `stripe-payments-demo` to Vercel         | 30 min  | pending  |
| 3   | P0       | Wire up Resend (`RESEND_API_KEY`) for contact form      | 15 min  | pending  |
| 4   | P0       | Google Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)      | 30 min  | pending  |
| 5   | P0       | Decide: keep small demo repos or fold into flagships    | 15 min  | pending  |
| 6   | P1       | Update resume PDF to match hero positioning             | 1 hr    | pending  |
| 7   | P1       | LinkedIn headline + About rewrite                       | 2 hr    | pending  |
| 8   | P1       | Record 3 Loom videos (eduscale, devtrack, stripe)       | 2 hr    | pending  |
| 9   | P1       | Get one OSS PR merged (Vercel-required signal)          | ongoing | pending  |
| 10  | P1       | Dictate one real-incident writeup for EduScale          | 30 min  | pending  |
| 11  | P2       | Speak once (meetup / lightning talk)                    | 1 talk  | pending  |
| 12  | P2       | Get one LinkedIn recommendation from a senior eng       | ask     | pending  |
| 13  | P2       | Stripe-specific cold outreach (2 engineers)             | 3 hr    | pending  |
| 14  | P2       | Tailored application packets (Stripe/Vercel/Supabase)   | 3 hr    | pending  |

**Recently completed (just for context):**
- ✓ Picked hero positioning Draft B — wired into `app/HomeContent.tsx`
- ✓ `redis-battle-demo` deployed at <https://redis-battle-demo.onrender.com/> (portfolio card + health check updated)
- ✓ `CRON_SECRET` added to Vercel env vars for the 3 projects (you did this — just needs redeploy)
- ✓ All 3 Supabase-backed projects (EduScale / DevTrack / KhataGO) confirmed live
- ✓ `GEMINI_API_KEY` added to KhataGO Vercel
- ✓ EduScale middleware fast-path fix deployed in both repos
- ✓ 6 Supabase GitHub secrets added (now deprecated by Vercel cron approach — can delete)
- ✓ `stripe-payments-demo` ported to Next.js on branch `nextjs-port` — ready to merge + deploy

---

## P0 — Do this week

### 1. Redeploy the 3 Vercel projects to pick up `CRON_SECRET` — 5 min

You added `CRON_SECRET` in Vercel → Settings → Environment Variables → Production. That's the right spot. But **Vercel doesn't auto-redeploy when you add an env var** — the currently-running deployment doesn't know about it. You need one of:

**Option A (zero-effort):** trigger a redeploy from the Vercel UI.

1. Open each project on Vercel (KhataGO, DevTrack, EduScale Frontend)
2. **Deployments tab → click the latest deployment → click the three-dot menu → "Redeploy"**
3. Confirm (no cache-bust needed).

**Option B (git push):** any commit to `main` in each repo triggers a fresh deploy that'll pick up the new env var.

**After redeploy, verify:** Vercel dashboard → Project → **Cron Jobs** tab → should list `/api/cron/keepalive` scheduled at `0 9 * * *`.

**Optional sanity check** (once deployed):

```
curl -H "Authorization: Bearer $CRON_SECRET" https://<project>.vercel.app/api/cron/keepalive
```

Expect `{"ok":true,"db":"postgres","now":...}` or `{"ok":true,"db":"supabase",...}`.

That's it. No additional env vars, no additional config. The cron runs once per day at 09:00 UTC automatically.

### 2. Merge + deploy stripe-payments-demo to Vercel — 30 min

Claude ported the Express routes to Next.js — branch **`nextjs-port`**, commit **`bc18b84`**. All 29 tests pass. PR URL: <https://github.com/Shailesh93602/stripe-payments-demo/pull/new/nextjs-port>

**Steps:**

1. **Review the PR + merge to main.** Nothing surprising — `app/api/{webhook,create-payment-intent,simulate-payment,health}/route.ts` added; legacy Express runnable via `npm run dev:legacy` as fallback.
2. **Vercel → Add New → Project** → import `Shailesh93602/stripe-payments-demo`, branch `main` (after merge).
3. Framework preset: Next.js (auto-detected).
4. **Environment Variables** (Production):
   - `STRIPE_SECRET_KEY` — Stripe Dashboard → Developers → API keys → **Secret key** (test mode is fine).
   - `REDIS_URL` — use Vercel's **Upstash** integration at <https://vercel.com/integrations/upstash> (free 10k commands/day).
   - `STRIPE_WEBHOOK_SECRET` — fill after step 6.
5. **Deploy**, note the URL.
6. **Stripe webhook config:**
   - Stripe Dashboard → Developers → Webhooks → **Add endpoint**
   - URL: `https://<your-vercel-url>/api/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Save → click into endpoint → copy **Signing secret** (`whsec_...`)
7. Add `STRIPE_WEBHOOK_SECRET` on Vercel → redeploy (same Option A/B from task 1).
8. **The money demo (screenshot this):** Stripe dashboard → Webhooks → your endpoint → **Send test webhook** → pick `payment_intent.succeeded`. Watch Vercel function logs. **Then click "Send test webhook" AGAIN with the same event.** Second delivery should log "duplicate event, skipping" and return 200 without reprocessing.
9. Tell Claude the URL + attach the duplicate-webhook screenshot.

**Why this matters:** deploying on Vercel is an explicit signal to Vercel recruiters that you use their platform idiomatically. Combined with the MANUAL §5 decision below.

### 3. Wire up Resend for the contact form — 15 min

`/api/contact` is live and falls back to `mailto:` when `RESEND_API_KEY` isn't set. To enable direct sends:

1. Sign up at <https://resend.com> (free: 100/day, 3k/month)
2. Dashboard → **API Keys → Create** → name `portfolio-production` → copy `re_...`
3. **Optional but recommended:** verify your domain at **Domains → Add Domain** (add DNS TXT + CNAME). Skip for now — the fallback `onboarding@resend.dev` sender works.
4. Vercel → portfolio_next → **Settings → Environment Variables** (Production):
   - `RESEND_API_KEY` = the `re_...` value
   - `RESEND_FROM` (only if you verified a domain): `"Portfolio Contact <contact@yourdomain>"` — else leave unset
5. Redeploy → test from `/contact` on live site → email arrives at `CONTACT_INFO.EMAIL`.

### 4. Google Analytics — 30 min

Shows you instrument your own products. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Vercel (root layout already reads it). Create a new GA4 property if you don't have one.

### 5. Decide: keep small demos, or fold them into flagships — 15 min (your call)

You asked the right architectural question: "Why do we have `redis-battle-demo` when EduScale already uses Redis? Why `stripe-payments-demo` when KhataGO already does webhook idempotency? Can we integrate Stripe into KhataGO / EduScale directly instead?"

**Both options are defensible. Pick one:**

#### Option A — Keep small demos as "5-minute read" artifacts (current setup)

The small repos (`redis-battle-demo`, `stripe-payments-demo`) exist because:

- A recruiter who wants to *see the pattern* doesn't want to boot up EduScale or KhataGO (big apps, need Supabase + more). They want `git clone && npm start` and 5 lines that demonstrate the pattern.
- Focused test suites specifically for the pattern (e.g. 29 tests on webhook idempotency alone) are easier to read than finding the same patterns buried inside a larger app.
- Different "story" per repo — EduScale is "real-time platform," stripe-payments-demo is "webhook idempotency handbook." A Stripe recruiter doesn't have to re-contextualize when they open it.

**Cost:** ~9 repos to maintain, keepalives to configure, deploys to track. But the flagship projects still demonstrate the patterns **in production**, so demos are purely supplemental.

#### Option B — Fold demos into flagships as "real integrations" (aggressive)

- **Add Stripe subscription billing to KhataGO** (users pay ₹299/month for the accountant portal). The webhook idempotency code moves from `stripe-payments-demo` into KhataGO's real webhook handler. Archive `stripe-payments-demo`.
- **Add Stripe tournament-entry fees to EduScale** (users pay ₹50 to enter a battle tournament). Same pattern — Stripe webhook in EduScale's real backend.
- **Retire `redis-battle-demo`** — EduScale's case-study page already documents Redlock + @socket.io/redis-adapter at production scale. Point recruiters to the real EduScale backend code.

**Pros:** one place per pattern, visible "real" usage (not a demo), fewer repos.
**Cons:** 6-10 hours of integration work per flagship; risk of breaking live apps while wiring up payments.

#### My recommendation

**Hybrid — do Option B for Stripe, Option A for Redis.**

- **Stripe:** integrate into KhataGO as subscription billing. Real Stripe usage beats a demo for a Stripe application. Archive `stripe-payments-demo` README but link to it as "the pattern reference." ~8 hr work, high signal.
- **Redis:** keep `redis-battle-demo` as a simple visual demo. EduScale's Redis usage is deep but not *visually demo-able* in a recruiter's 30-second scan. The battle demo's two-instance Redlock race IS visual and runs in <5 min. Low maintenance cost (one Render free service).

**Tell Claude which option you want.** Claude can then:
- (If Option A) leave as-is, just keep them maintained.
- (If Option B / hybrid) scope the Stripe→KhataGO integration — at minimum: subscription tier model, `/api/stripe/webhook` route, Redis SETNX in KhataGO, billing page UI. ~1 week of code work.

### Upstash Redis keepalive (for redis-battle-demo on Render)

Your Upstash Redis for `redis-battle-demo` got paused. This is the same free-tier-inactivity problem as Supabase, just for Upstash.

The [URL health-check GitHub Action](.github/workflows/url-health-check.yml) already pings `https://redis-battle-demo.onrender.com/` daily at 10:00 UTC. Here's the keepalive chain:

1. GitHub Action does `HEAD /` on the Render URL
2. Render free-tier instance wakes up (if spun down)
3. The app reconnects to Upstash Redis on wake
4. That reconnection counts as Upstash activity → Upstash doesn't pause

**Action:** no Vercel action needed. The GitHub workflow already covers it (shipped 2026-04-19). Just keep Upstash unpaused manually **once** (Upstash Dashboard → your database → "Resume") — the health check takes it from there.

If you want extra safety (Upstash activity from HTTP-independent pings), Claude can add a **tiny cron inside `redis-battle-demo`** that does `redis.ping()` every 6 hours. Let me know.

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
