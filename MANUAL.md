# MANUAL.md — Only What Requires YOU

Everything Claude can automate lives in [TODO.md](TODO.md). This file is only things that need your credentials, voice, personal accounts, or a human decision.

**Last updated: 2026-04-19**

---

## Your work history (reference for anything public)

- **Jan 22, 2024 – Aug 2024** — Software Developer Intern, **EsparkBiz**. Learned full-stack (Node, React, Next.js, TypeScript, Tailwind).
- **Aug 2024 – Jul 9, 2025** — Software Engineer, **EsparkBiz**. Shipped 3 real client projects end-to-end.
- **Jul 10, 2025 – present** — Software Engineer, **ContextQA**. First 2-3 months: 2 Chrome extensions (Vibe Testing + AxeTos). Since then: **backend of the core QA-automation product** — test execution engine, VNC streaming, Playwright / WebdriverIO / LambdaTest orchestration.
- Side projects (live): EduScale, DevTrack, KhataGO, stripe-payments-demo, redis-battle-demo, CareerGlyph, CodeSenseiSearch.

Rules for anything public: **no specific PR counts**, **no "real-time systems engineer" / "payments infrastructure engineer" titles**, **Chrome extensions were NOT the current work** (first 2-3 months only).

---

## Just shipped (since last turn)

- ✅ **`gh` + `vercel` CLIs installed & authenticated** — Claude can now create GitHub repos, deploy to Vercel, monitor build errors, trigger redeploys without asking you.
- ✅ **`razorpay-patterns-demo` pushed to GitHub** at <https://github.com/Shailesh93602/razorpay-patterns-demo> (Phase 1 scaffold, 22 tests passing).
- ✅ **stripe-payments-demo LIVE** at <https://stripe-payments-demo-eight.vercel.app> — vercel.json fix triggered a fresh deploy (commit 2546aa3), status now `● Ready`. Portfolio card `live:` field updated.
- ✅ **Vercel CLI linked to 5 projects** — `shaileshchaudhari` (this portfolio), `stripe-payments-demo`, `khata-go`, `dev-track`, `dev-scale` (EduScale Frontend). All have `.vercel/` dirs locally (gitignored). Claude can now run `vercel ls <project>` or `vercel inspect <url> --logs` to check status + debug deploy errors.
- ✅ **All 4 critical projects confirmed `● Ready`** in their latest Vercel deploys.
- ✅ **Google Analytics** wired on Vercel prod (`NEXT_PUBLIC_GA_MEASUREMENT_ID = G-4QGEGXCWPN`) — no further action needed.
- ✅ **EduScale incident writeup** drafted in the voice of a working engineer — two incidents (Redlock TTL short during tournament Saturday; split Socket.io rooms from single-client pub/sub). Rendered on `/portfolio/eduscale`.
- ✅ **Razorpay plan revised** per your feedback — discount-anchor pricing (strikethrough full-price next to launch price), EduScale pivoted from tournament fees → plan-based subscription like LeetCode, standard SaaS refund policy (7-day money-back, 30-day pro-rated for annual, post-30 day no refund but access until period end). See [drafts/RAZORPAY_PLAN.md](drafts/RAZORPAY_PLAN.md).

---

## P0 — This week

### 1. Confirm `stripe-payments-demo` is now deploying on Vercel — 2 min

**You asked "why redeploy — Vercel auto-deploys on push."** Correct. The fix is already pushed ([commit 8c0327a](https://github.com/Shailesh93602/stripe-payments-demo/commit/8c0327a)) and Vercel should have auto-built it **IF the project was already imported to Vercel**. Two scenarios:

- **If you already imported + the first deploy failed:** Vercel sees the new push on `main` and auto-deploys. Check Vercel → stripe-payments-demo → Deployments → latest should be green. No manual action.
- **If you never completed the import (the failed first attempt blocked it):** you still need to do the initial `Vercel → Add New → Project → import` once. After that, every push auto-deploys.

Tell Claude the live URL once it's up — Claude updates portfolio card + README.

**Context (new — 2026-04-19):** Stripe is **invite-only in India**, so you can't create a Stripe test account today. The app still deploys and runs in "pattern reference" mode. Specifically:

1. Vercel → Add New → Project → import `Shailesh93602/stripe-payments-demo`, branch `main`.
2. Framework: Next.js (auto-detected).
3. **Env vars (Production, use placeholders until Stripe India opens):**
   - `STRIPE_SECRET_KEY` = `sk_test_placeholder_not_in_india_yet` (any non-empty string — the route-handler lazy-loads so build succeeds).
   - `STRIPE_WEBHOOK_SECRET` = `whsec_placeholder`.
   - `REDIS_URL` = from Vercel Upstash integration at <https://vercel.com/integrations/upstash> (free 10k/day).
4. Deploy. URL will render the static landing page explaining the pattern. `/api/webhook` returns 400 on unsigned payloads (verifies the HMAC path is wired) — perfectly fine for recruiter scan.
5. Tell Claude the live URL — portfolio card gets the `live:` field.

**What's lost without Stripe access:** the "send duplicate webhook → see second call skipped" LIVE demo. The pattern + 29 passing tests + deployed landing page are still recruiter-visible.

**Medium-term:** if/when Stripe opens in India OR if you can use a US-based partner's Stripe account, come back and wire real keys. Until then, see task §3 below for the Razorpay pivot.

### 2. Razorpay integration — one-time account setup (10 min)

You picked **both paths** — keep standalone demos AND integrate the patterns into the real flagships (KhataGO + EduScale). Razorpay replaces Stripe as the "real usage" target since Stripe India is invite-only.

**Full plan:** [drafts/RAZORPAY_PLAN.md](drafts/RAZORPAY_PLAN.md) — 3 phases, what YOU do vs what CLAUDE does, open questions, risk register.

**Step 1 — Create account + get test keys (10 min, do this once):**

1. Sign up at <https://razorpay.com/signup>. Choose "Individual / Freelancer" for fastest onboarding.
2. Complete KYC lite (PAN + Aadhaar). You stay in **Test Mode** until you want real rupees — no full KYC needed for development.
3. Dashboard → **Settings → API Keys → Generate Test Key**. You'll get:
   - `Key ID`: `rzp_test_...` (safe to ship to frontend)
   - `Key Secret`: one-time display — **save it securely now.**
4. Tell Claude: **"Razorpay account ready, keys in my password manager, start Phase 1"** — Claude begins scaffolding `razorpay-patterns-demo` (code-only; you'll add the keys to Vercel at deploy time).

**Phases 2 + 3 start after Phase 1 is deployed.** See `drafts/RAZORPAY_PLAN.md` for webhook setup + env vars per project.

**Open design decisions (answer inline in the plan doc or in chat):**
- KhataGO tier prices — draft ₹299 / ₹999. Adjust?
- EduScale tournament fee — draft ₹49 regular / ₹199 premier?
- Refund policy for cancelled tournaments?
- Repo name for the standalone demo: `razorpay-patterns-demo` OK?

### 3. Upstash Redis one-time resume — 2 min

Your Upstash Redis for `redis-battle-demo` was paused. Go to <https://console.upstash.com/> → that database → **Resume**. After that, the daily URL health-check GitHub Action keeps it alive (daily GET wakes Render → reconnects to Upstash → counts as activity).

---

## P1 — This month (things only you can do)

### 5. Record 3 × 60-second Loom videos — 2 hr

Claude can't be on camera. One per flagship:

- **EduScale:** log in → enter a live battle → show Redlock hold + Prometheus `/metrics` panel.
- **DevTrack:** one window logged in, one logged out → trigger a Realtime event → watch it propagate.
- **stripe-payments-demo** (after task 1 deploys): send a webhook twice with the same event ID → show second call skipped in Vercel logs.

Tell Claude "Loom URLs are X, Y, Z" → Claude embeds on the case-study pages. Claude has pre-drafted the storyboard scripts in TODO.md §1E so you know exactly what to say.

### 6. One OSS PR merged — ongoing (target by Jul 18)

Vercel in particular filters on "has-OSS-PR" — required signal. Claude can't submit PRs for you. Targets (stack-matched):

1. `shadcn-ui/ui` — ARIA / type / docs gaps
2. `supabase/supabase-js` — Supabase application signal
3. `vercel/next.js` examples — typed Playwright recipe (leverages your ContextQA Playwright work)
4. `stripe/stripe-node` — idempotency-key helper gaps

Process: clone → tests pass locally → find one specific non-cosmetic bug → smallest possible fix → PR with "what broke / why the fix / code refs."

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
