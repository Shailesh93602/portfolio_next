# MANUAL.md — Tasks Requiring Your Action (Next 3 Months)

All tasks here require your credentials, accounts, external actions, or original writing.
Nothing here can be done by code alone.

See TODO.md for all code-executable tasks.
See `/tmp/portfolio-recruiter-review.md` for the 2026-04-19 recruiter review that seeded this list.

---

## Priority Queue (in order — do these before applying anywhere)

Priority levels mirror the recruiter review (P0 = this week, P1 = this month, P2 = weeks 6–12).

| #   | Priority | Task                                              | Time   | Unlocks                                             |
| --- | -------- | ------------------------------------------------- | ------ | --------------------------------------------------- |
| 1   | P0       | Write 3-sentence hero positioning statement       | 30 min | TODO 1J (hero rewrite)                              |
| 2   | P0       | Verify 3 live project URLs + screenshot each      | 15 min | OG fallbacks + don't let Supabase pause mid-review  |
| 3   | P0       | Add `CRON_SECRET` env var + redeploy 3 Vercel projects (replaces GitHub secrets approach) | 15 min | Activates per-project Vercel cron keep-alive (private, DB-native, works for KhataGO Postgres)   |
| 4   | P0       | Deploy redis-battle-demo (Render or Fly)          | 1 hr   | Makes distributed-lock demo publicly visible        |
| 5   | P0       | Deploy stripe-payments-demo (decide Vercel vs Render) | 1 hr   | Unblocks TODO 2C (Stripe deep case-study page)  |
| 6   | P0       | Verify GEMINI_API_KEY on EduScale Vercel project  | 5 min  | Validates TODO 1B (AI chat fix already shipped)     |
| 7   | P0       | Apply EduScale middleware fix to Exavel copy      | 15 min | Now DONE in both repos — just deploy Exavel         |
| 8   | P0       | Google Analytics setup                            | 30 min | Shows you instrument your own products              |
| 9   | P1       | Update resume PDF to match portfolio positioning  | 1 hr   | Recruiters read resume + portfolio side-by-side     |
| 10  | P1       | LinkedIn headline + About rewrite                 | 2 hr   | Recruiters always open LinkedIn first               |
| 11  | P1       | Record 3 Loom videos (eduscale, devtrack, stripe) | 2 hr   | Cheapest credibility multiplier when blog is blocked |
| 12  | P1       | One OSS PR merged in a recognizable repo          | ongoing| Required for Vercel; lifts all three applications   |
| 13  | P1       | Dictate one real-incident writeup for EduScale    | 30 min | Unblocks TODO 2A (EduScale depth upgrade)           |
| 14  | P1       | Decide on an employment-compatible writing channel | decide | Tells Claude whether to keep investing in /blogs    |
| 15  | P2       | Speak once (meetup / lightning talk)              | 1 talk | Biggest 2→3 YoE credibility jumper                  |
| 16  | P2       | Quantify EduScale real usage (or drop the claim)  | 30 min | Resolves credibility risk of un-anchored numbers    |
| 17  | P2       | Get one LinkedIn recommendation from a senior eng | ask    | Referral-adjacent social proof                      |
| 18  | P2       | Stripe-specific cold outreach (2 engineers)       | 3 hr   | Targeted notes beat mass-apply                      |
| 19  | P2       | Tailored application packets (Stripe/Vercel/Supabase) | 3 hr   | Generic applications get filtered               |

---

## P0 — Do this week

### 1. Write a 3-sentence hero positioning statement — 30 min

Recruiter review red flag #1: "Full Stack Developer" tells a Stripe recruiter nothing in 10 seconds.

Write 3 sentences that answer:

- What role in 18 months (e.g. "backend engineer on a payments-infra team")
- Which two technical areas are your specialties (e.g. "webhook idempotency + real-time systems")
- What proof you have (e.g. "shipped Redlock + opossum at EduScale, built stripe-payments-demo")

Hand the result to Claude; Claude wires it into `app/(home)/HomeContent.tsx` (TODO 1J).

### 2. Verify 3 Live Project URLs + screenshot each — 15 min

Free-tier Supabase pauses after 7 days. If a recruiter clicks your project and sees "Error establishing DB connection," they don't investigate — they move on. While you're there, screenshot each in working state to use as OG fallbacks.

Do this check every 2 weeks until Task 3 lands (then it's automated).

| Project              | URL                                  | Fix if down                          |
| -------------------- | ------------------------------------ | ------------------------------------ |
| EduScale             | `https://eduscale.vercel.app`        | Supabase dashboard → Restore project |
| DevTrack             | `https://daily-dev-track.vercel.app` | Supabase dashboard → Restore project |
| KhataGO              | `https://khatago.vercel.app`         | Supabase dashboard → Restore project |
| CareerGlyph          | add URL once deployed                | Render/Fly restart                   |
| redis-battle-demo    | add URL once deployed (Task 4)       | Render/Fly restart                   |
| stripe-payments-demo | add URL once deployed (Task 5)       | Render/Fly or Vercel                 |

### 3. Activate Per-Project Vercel Cron Keep-Alive — 15 min

**Approach change:** GitHub Actions workflow removed. Keep-alive now runs as a Vercel Cron inside each of the 3 projects (KhataGO, DevTrack, EduScale Frontend). Private, DB-native, works for KhataGO's Postgres-only setup.

**Steps:**

1. Generate a shared cron secret: `openssl rand -hex 32`
2. Add `CRON_SECRET` env var to each of these 3 Vercel projects (Settings → Environment Variables → Production):
   - KhataGO
   - DevTrack
   - EduScale Frontend
3. Trigger a redeploy on each (push any commit or "Redeploy" from Vercel UI)
4. Verify on Vercel dashboard → Project → Cron Jobs: `/api/cron/keepalive` should appear, schedule `0 9 * * *`
5. Optional manual test: `curl -H "Authorization: Bearer $CRON_SECRET" https://<project>.vercel.app/api/cron/keepalive` — expect `{"ok":true,...}`

**Then clean up (optional):** delete the 6 now-unused GitHub repo secrets (`EDUSCALE_SUPABASE_URL`, `EDUSCALE_SUPABASE_ANON_KEY`, `DEVTRACK_*`, `KHATAGO_*`) at <https://github.com/Shailesh93602/portfolio_next/settings/secrets/actions>

**Why this replaces GitHub Actions:**
- Private (not visible in public Actions log)
- Actually touches the DB (Prisma `SELECT NOW()` / Supabase `auth.getSession()`) — critical for KhataGO which only has `DATABASE_URL`, no Supabase REST surface
- Each project owns its own keep-alive, no cross-repo secret copying

### 4. Deploy redis-battle-demo — 1 hr (Render or Fly — NOT Vercel)

**Deployment decision:** Uses Socket.io + Express with persistent WebSocket connections. Vercel serverless cannot hold open WebSocket connections, so deploy to **Render or Fly.io** only.

**Render.com path (simplest):**

1. Create Web Service from `Shailesh93602/redis-battle-demo`
2. Add Redis (Render has free managed Redis)
3. Env: `REDIS_URL` = Render Redis URL, `NODE_ENV=production`
4. Copy the assigned URL
5. Tell Claude: "redis-battle-demo live at https://..." — Claude updates the portfolio card

**Fly.io path (needed if you want 2 instances for distributed-lock visualization):**

1. `fly launch` in the repo (Dockerfile already present)
2. `fly redis create` → copy URL into `fly secrets set REDIS_URL=...`
3. `fly scale count 2` for two instances
4. Copy URL, report back

### 5. Deploy stripe-payments-demo — 1 hr (decide platform first)

**Deployment decision (pick one):**

- **Option A — Port to Next.js API routes on Vercel (preferred).** HTTP only, no WebSockets, so Vercel serverless works. Everything else in your stack ships on Vercel — this is the strongest target-company signal for a Stripe/Vercel dual-application. Work: convert Express routes in `Shailesh93602/stripe-payments-demo` to `app/api/*` handlers in a new Next.js app (or add them to this portfolio repo under `/api/stripe-demo/*`). Tests move cleanly.
- **Option B — Keep Express, deploy to Render.** Faster (no port), but loses the "I deploy on Vercel idiomatically" signal. Pick this only if Option A becomes more than half a day of work.

**If Option A (Vercel, Next.js API routes):**

1. Create a new Next.js app (or subfolder) and move `/webhook`, `/payment-intent`, etc. to `app/api/*/route.ts`
2. Swap Express middleware for Next.js middleware where relevant
3. Vercel env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `REDIS_URL` (Upstash free tier — Vercel-native)
4. Stripe Dashboard → Developers → Webhooks → point at `https://<app>.vercel.app/api/webhook`, copy signing secret to `STRIPE_WEBHOOK_SECRET`
5. Report URL to Claude for portfolio + README updates

**If Option B (Render, Express):**

1. Provision Node web service from `Shailesh93602/stripe-payments-demo`
2. Add managed Redis (webhook dedup needs it)
3. Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `REDIS_URL`, `NODE_ENV=production`
4. In Stripe Dashboard → Developers → Webhooks, add deployed `/webhook`, copy signing secret back into `STRIPE_WEBHOOK_SECRET`
5. Report URL to Claude for portfolio + README updates

### 6. Verify GEMINI_API_KEY on EduScale Vercel project — 5 min

KhataGO repo commit `8d96698` shipped the AI-chat fix. Last step is confirming the env var is live on the production Vercel project (or whichever project hosts the chat endpoint).

1. Vercel dashboard → EduScale project → Settings → Environment Variables
2. Confirm `GEMINI_API_KEY` exists for Production
3. Redeploy if value was added/changed
4. Test the chat on `https://eduscale.vercel.app` — send a message, confirm a streamed response

### 7. Apply EduScale Middleware Fast-Path Fix to Exavel Copy — 15 min

Fast-path fix is DONE in both repos. Only the Exavel deploy is pending.

- File (main): `/Users/shaileshchaudhari/Desktop/Coding/EduScale/Frontend/src/utils/supabase/middleware.ts` — done
- File (Exavel): `/Users/shaileshchaudhari/Desktop/Coding/Development/Exavel/EduScale/Frontend/src/utils/supabase/middleware.ts` — done
- Action remaining: deploy Exavel via its deploy flow (Vercel or own infra — you know which)
- Verify: public pages load without the middleware timeout that originally motivated the fix

### 8. Google Analytics setup — 30 min

Shows you instrument your own products. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Vercel; the layout wiring already reads it.

---

## P1 — Do this month

### 9. Update Resume PDF — 1 hr

The portfolio links to `/Shailesh_Chaudhari_Resume.pdf`. Must use the same hero positioning and the same numbered accomplishments as the portfolio. Stripe recruiters read them side-by-side.

**Specific lines to update:**

- Hero line: the 3-sentence positioning statement from P0-1 (condensed)
- ContextQA: "~1,900 merged PRs (Vibe Testing extension), ~1,600 merged PRs (AxeTos)"
- EduScale: "@socket.io/redis-adapter, redlock, opossum (circuit breaker), prom-client"
- KhataGO: "WhatsApp Business API, Gemini AI OCR, Tally ERP XML, Redis webhook deduplication"
- Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
- Skills: add "Redis Cluster/Pub-Sub", "Socket.io", "Prometheus", "Circuit Breaker Pattern"

**After updating:**

1. Export as PDF — filename stays `Shailesh_Chaudhari_Resume.pdf`
2. Replace `public/Shailesh_Chaudhari_Resume.pdf`
3. Commit: `docs: update resume PDF`

### 10. LinkedIn headline + About rewrite — 2 hrs

LinkedIn is the first thing recruiters check. Match portfolio positioning exactly.

1. Headline: echo the 3-sentence hero positioning (one-line form)
2. ContextQA: "~1,900 merged PRs Vibe Testing; ~1,600 merged PRs AxeTos"
3. EduScale: "@socket.io/redis-adapter, redlock (distributed locks), opossum (circuit breaker), prom-client (Prometheus /metrics)"
4. KhataGO: "WhatsApp Business API, Google Gemini AI OCR, Tally ERP XML export, Redis-backed webhook deduplication"
5. Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
6. Featured: pin the stripe-payments-demo case-study page AND the EduScale case-study page
7. Skills: add "Redis (Cluster, Pub/Sub)", "Socket.io", "Prometheus", "Stripe Webhooks"

### 11. Record 3 × 60-second Loom videos — 2 hrs

One per flagship (eduscale, devtrack, stripe-payments-demo), each doing one real user flow end-to-end. Embed on each portfolio detail page. Single cheapest credibility multiplier for someone who can't blog.

- **EduScale Loom**: log in → enter a live battle → show Redis lock holding → show Prometheus `/metrics`
- **DevTrack Loom**: open one window logged in, one window logged out → show a Realtime activity event propagating
- **stripe-payments-demo Loom**: send one webhook with a repeated event ID → show `setnx` returning 0 the second time → show handler skipped

Tell Claude: "Loom URLs are X, Y, Z" — Claude embeds them on the case-study pages. Also unblocks TODO 2H (DevTrack guest-mode alternative).

### 12. Get One OSS Contribution Merged — ongoing (target: by Jul 18)

"0 OSS merged PRs" is visible on your GitHub profile. One merged PR changes the conversation. Vercel in particular filters on this.

**Best targets for your stack:**

1. **shadcn/ui** (`shadcn-ui/ui`) — missing ARIA, type improvements, docs gaps
2. **Supabase JS** (`supabase/supabase-js`) — high signal for Supabase applications
3. **Next.js examples** (`vercel/next.js`) — a typed Playwright recipe is an easy accepted PR
4. **Stripe node SDK** (`stripe/stripe-node`) — idempotency-key helper gaps

**Process:**

1. Clone, run tests locally (this alone eliminates 80% of contributors)
2. Find one specific bug — not cosmetic
3. Smallest possible fix, well-tested
4. PR description: what was broken, why the fix is correct, link to the relevant code

### 13. Dictate one real-incident writeup for EduScale — 30 min

Unblocks TODO 2A. Even a 4-bullet dictation is enough for Claude to wire into the page:

- **Symptom** (e.g. "3× duplicate battles created under load")
- **Hypothesis** (e.g. "Redlock TTL too short for our handler's p99")
- **Fix** (e.g. "bumped TTL from 2s → 8s, added an auto-renewal heartbeat at 1 Hz")
- **Confirmed by metric** (e.g. "duplicate-battle counter dropped from 0.3% to 0.0% over 24 h")

Synthetic is fine as long as the causal chain is coherent. Send the 4 bullets to Claude.

### 14. Decide on an employment-compatible writing channel — decision only

Short LinkedIn posts (1×/week, ~150 words, no employer IP) are lower-risk than a blog and keep the "can they write?" signal alive. Agree yes/no so Claude knows whether to keep investing in `/blogs` polish.

- If **yes**: commit to 1 LinkedIn post / week for 12 weeks; Claude continues /blogs polish
- If **no**: Claude stops investing in /blogs beyond bug-fix, doubles down on portfolio-page depth

---

## P2 — Weeks 6–12

### 15. Speak once — 1 talk

Local meetup or 10-min conference lightning talk. Topic suggestion from the review: "webhook idempotency mistakes I see in the wild." Single biggest 2→3 YoE credibility jumper.

### 16. Quantify EduScale real usage — 30 min

EduScale landing claims "10,000+ active users" but the portfolio case-study page shows zero quantified outcomes. Pull the real number from analytics and put it on the portfolio page with a date. If the real number is lower, replace it with an honest one — inconsistency between surfaces is the bigger risk than a smaller number.

### 17. Get one LinkedIn recommendation from a senior engineer — ask

Target a senior engineer at ContextQA or eSparkBiz. Referral-adjacent social proof is 80% of the recruiter's "should I screen?" call.

### 18. Stripe-specific cold outreach — 3 hrs

1. Identify 2 engineers on Stripe's payments-infra team (LinkedIn / engineering blog bylines)
2. Read 5 Stripe engineering blog posts first; find one specific technical claim you disagree with or have a question about
3. Send 2 cold notes linking `stripe-payments-demo` case study with the specific question
4. Do not mass-apply — generic "I love Stripe" notes get deleted

### 19. Tailored Application Packets — 3 hrs total

For each of Stripe, Vercel, Supabase:

- One-page cover letter referencing their engineering blog (read 5 posts first)
- Resume variant emphasizing relevant projects (Stripe → stripe-payments-demo + KhataGO reframed as ledger; Vercel → portfolio itself + edge demo; Supabase → DevTrack with RLS + CareerGlyph RBAC)
- Send via referral if possible (check LinkedIn for 1st/2nd connections)

---

## Application Readiness Checklist

**Before applying to any company, all items in that row must be done:**

| Company  | Required before applying                                                                            |
| -------- | --------------------------------------------------------------------------------------------------- |
| Skydo    | KhataGO public, KhataGO case study reframed as ledger pipeline, 3 live URLs green                   |
| Stripe   | stripe-payments-demo live + SCA/3DS layer, case study deep-dive, Loom, resume + LinkedIn updated    |
| Vercel   | OSS PR merged, Lighthouse CI green + Web Vitals screenshot, edge-runtime demo shipped, resume updated |
| Supabase | RLS + Realtime-presence + pgvector demo shipped, DevTrack guest mode OR Loom, RLS SQL documented    |

---

## Add CodeSenseiSearch Screenshot — 15 min (when convenient)

The CodeSenseiSearch portfolio card uses a placeholder image.

1. Navigate to the live Swagger UI (`/api`)
2. Make a sample semantic search query
3. Screenshot the response
4. Save as `public/Images/codesensei-search.png`
5. Tell Claude: "update CodeSenseiSearch card image to /Images/codesensei-search.png"
