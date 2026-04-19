# MANUAL.md — Tasks Requiring Your Action (Next 3 Months)

All tasks here require your credentials, accounts, external actions, or original writing.
Nothing here can be done by code alone.

See TODO.md for all code-executable tasks.
See `/tmp/portfolio-recruiter-review.md` for the 2026-04-19 recruiter review that seeded this list.

---

## Priority Queue (in order — do these before applying anywhere)

Priority levels mirror the recruiter review (P0 = this week, P1 = this month, P2 = weeks 6–12).

| #   | Priority | Task                                                                                      | Time    | Unlocks                                                                                       |
| --- | -------- | ----------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| 1   | P0       | Write 3-sentence hero positioning statement                                               | 30 min  | TODO 1J (hero rewrite)                                                                        |
| 2   | P0       | Verify 3 live project URLs + screenshot each                                              | 15 min  | OG fallbacks + don't let Supabase pause mid-review                                            |
| 3   | P0       | Add `CRON_SECRET` env var + redeploy 3 Vercel projects (replaces GitHub secrets approach) | 15 min  | Activates per-project Vercel cron keep-alive (private, DB-native, works for KhataGO Postgres) |
| 4   | P0       | Deploy redis-battle-demo (Render or Fly)                                                  | 1 hr    | Makes distributed-lock demo publicly visible                                                  |
| 5   | P0       | Deploy stripe-payments-demo (decide Vercel vs Render)                                     | 1 hr    | Unblocks TODO 2C (Stripe deep case-study page)                                                |
| 6   | P0       | Verify GEMINI_API_KEY on EduScale Vercel project                                          | 5 min   | Validates TODO 1B (AI chat fix already shipped)                                               |
| 7   | P0       | Apply EduScale middleware fix to Exavel copy                                              | 15 min  | Now DONE in both repos — just deploy Exavel                                                   |
| 8   | P0       | Google Analytics setup                                                                    | 30 min  | Shows you instrument your own products                                                        |
| 9   | P1       | Update resume PDF to match portfolio positioning                                          | 1 hr    | Recruiters read resume + portfolio side-by-side                                               |
| 10  | P1       | LinkedIn headline + About rewrite                                                         | 2 hr    | Recruiters always open LinkedIn first                                                         |
| 11  | P1       | Record 3 Loom videos (eduscale, devtrack, stripe)                                         | 2 hr    | Cheapest credibility multiplier when blog is blocked                                          |
| 12  | P1       | One OSS PR merged in a recognizable repo                                                  | ongoing | Required for Vercel; lifts all three applications                                             |
| 13  | P1       | Dictate one real-incident writeup for EduScale                                            | 30 min  | Unblocks TODO 2A (EduScale depth upgrade)                                                     |
| 14  | P1       | Decide on an employment-compatible writing channel                                        | decide  | Tells Claude whether to keep investing in /blogs                                              |
| 15  | P2       | Speak once (meetup / lightning talk)                                                      | 1 talk  | Biggest 2→3 YoE credibility jumper                                                            |
| 16  | P2       | Quantify EduScale real usage (or drop the claim)                                          | 30 min  | Resolves credibility risk of un-anchored numbers                                              |
| 17  | P2       | Get one LinkedIn recommendation from a senior eng                                         | ask     | Referral-adjacent social proof                                                                |
| 18  | P2       | Stripe-specific cold outreach (2 engineers)                                               | 3 hr    | Targeted notes beat mass-apply                                                                |
| 19  | P2       | Tailored application packets (Stripe/Vercel/Supabase)                                     | 3 hr    | Generic applications get filtered                                                             |

---

## P0 — Do this week

### 1. Pick a hero positioning statement — 15 min

Recruiter review red flag #1: "Full Stack Developer" tells a Stripe recruiter nothing in 10 seconds.

**IMPORTANT — honesty bar:** The drafts below describe only what you have actually shipped (ContextQA Chrome extensions + your side projects). No claim that you "build payment infrastructure in production" — that would invite a question you can't answer. The cycling job-title carousel has been updated to plain, truthful roles (Software Engineer / Backend Engineer / TypeScript Engineer / Next.js Developer / Node.js Developer / Full Stack Developer).

**Pick one of the 3 drafts below** (edit freely) and tell Claude which one; Claude wires it into `app/HomeContent.tsx`.

#### Draft A — Day-job + side-project framing (most truthful)

> Software engineer at ContextQA, ~1,900 merged PRs across our Chrome extension suite for QA automation. Outside of work I build side projects that explore specific backend patterns end-to-end — real-time coding battles with Redlock, Stripe webhook idempotency with Redis SETNX, WhatsApp bookkeeping with OCR + Gemini. TypeScript everywhere, strong backend bias.

#### Draft B — Skill-focused, aspirational-but-honest

> TypeScript engineer, ~2 years of production experience at ContextQA building Chrome extensions, and a much deeper stack of side projects I ship on the side — Next.js + Prisma + Redis + Supabase. Interested in backend / distributed systems / developer platforms — the kind of work where the bug report is "this happens 0.1% of the time under load."

#### Draft C — Targeted-role, honest about what's shipped vs what's learned

> Full stack engineer with a backend lean. Day job: Chrome extensions at ContextQA. After-hours: real-time systems (EduScale — Redlock + Socket.io Redis adapter), webhook idempotency patterns (stripe-payments-demo), AI pipelines (KhataGO — OCR + agent tool-calling). Looking for my next step into backend / platform engineering.

**What to avoid in any rewrite:**

- Claiming you "build payments infrastructure" — you've only built a demo
- "Real-time systems engineer" / "Payments infrastructure engineer" as a title — these aren't real industry titles and invite skeptical questions
- Context-free numbers like "1,900 merged PRs" — pair them with scope ("across our QA-automation extension suite")

**Rules of thumb:**

- Pick the one that matches what you've actually done
- If none fit, the structure to keep is: "{current role + real scope} + {2 side-project patterns you've actually implemented} + {next step}"

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

### 4. Deploy redis-battle-demo to Render — 45 min

**Why Render (not Vercel):** Uses Socket.io + Express with persistent WebSocket connections. Vercel serverless cannot hold open WebSocket connections, Render can.

**Before you start — gather:**

- Render account (free tier is enough): <https://dashboard.render.com>
- GitHub access (Render will connect to the repo)

**Steps:**

1. **Provision Redis first** (the web service needs the URL at deploy time)
   - Render dashboard → **New +** → **Redis**
   - Name: `redis-battle-demo-redis`
   - Region: whichever is closest to you (Oregon is the free-tier default)
   - Plan: **Free** (25MB is plenty for this demo)
   - Maxmemory policy: leave default
   - Click **Create Redis**
   - Wait ~30s, then copy the **Internal Redis URL** from the service page (format: `redis://red-xxxxx:6379`). Grab the **External Redis URL** too if you want local-dev access.

2. **Provision the Node web service**
   - **New +** → **Web Service**
   - Connect the `Shailesh93602/redis-battle-demo` repo (authorize GitHub if first time)
   - Name: `redis-battle-demo`
   - Region: **same as Redis** (so internal URL works — cross-region costs extra)
   - Branch: `main`
   - Build command: `npm install && npm run build` (use `npm install` only if there's no build script — check `package.json` first)
   - Start command: `npm start`
   - Plan: **Free** (spins down after 15 min of inactivity; spins up in ~30s on next request — fine for a demo)

3. **Environment variables** (Environment section on the service page):

   - `REDIS_URL` = the Internal Redis URL from step 1
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render's convention — their LB expects this port)

4. **Deploy** → wait ~3 min for the first build. Watch logs for errors.

5. **Test the demo works:**

   - Open the assigned URL (`https://redis-battle-demo.onrender.com` or similar)
   - Click "Start Battle" — should connect via Socket.io
   - If 502s, check logs; common issue is a hardcoded `localhost:6379` that should read from `REDIS_URL`

6. **Report back:** tell Claude "redis-battle-demo live at https://..." — Claude updates the portfolio project card's `live:` field and pushes.

**Known free-tier limit:** single instance only. The distributed-lock demo's marquee feature (Redlock across 2+ nodes proving no duplicate locks) can't be shown on Render free. Two options:

- Upgrade to Render Starter ($7/mo, 2 instances) — lets you visually demo the lock
- Switch to **Fly.io** (still free) — supports 2 instances:

  ```bash
  cd /Users/shaileshchaudhary/Desktop/Coding/redis-battle-demo
  fly launch                    # creates fly.toml, detects Dockerfile
  fly redis create               # managed Upstash Redis
  fly secrets set REDIS_URL=<the URL from previous command>
  fly deploy
  fly scale count 2              # 2 instances → Redlock demo is visible
  fly status                     # prints the assigned URL
  ```

### 5. Deploy stripe-payments-demo — 45 min (pick platform first)

**Deployment decision (pick one):**

- **Option A — Port to Next.js API routes on Vercel (preferred for target-company signal).** HTTP only, no WebSockets, so Vercel serverless works. Deploying on Vercel = signal for Vercel recruiters that you use their platform idiomatically. ~Half a day of porting work. Claude can do the port: tell Claude "port stripe-payments-demo to Next.js on Vercel" and it will handle the file moves + express → route-handler conversion.
- **Option B — Keep Express, deploy to Render.** Zero porting work (~45 min). Loses the "I deploy on Vercel" signal. Pick if you need a live URL this week.

**If Option A (Vercel, after Claude ports it):**

1. After Claude's port PR merges, Vercel dashboard → **Add New** → **Project** → import `Shailesh93602/stripe-payments-demo` (on the new Next.js branch).
2. Framework preset: **Next.js** (auto-detected).
3. **Environment Variables** (Production):
   - `STRIPE_SECRET_KEY` — Stripe Dashboard → Developers → API keys → **Secret key** (use test mode or a restricted key).
   - `STRIPE_WEBHOOK_SECRET` — we'll fill after step 5.
   - `REDIS_URL` — use **Upstash** via Vercel integration (<https://vercel.com/integrations/upstash>, free 10k commands/day).
4. **Deploy** → get the URL (e.g. `https://stripe-payments-demo.vercel.app`).
5. **Stripe webhook config:**
   - Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
   - Endpoint URL: `https://<your-vercel-url>/api/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded` (add more later).
   - Click **Add endpoint** → open it → copy **Signing secret** (starts with `whsec_`).
6. Vercel → Settings → Environment Variables → add `STRIPE_WEBHOOK_SECRET` = the copied value → redeploy once.
7. **Test (this is the money demo):**
   - Stripe dashboard → Webhooks → your endpoint → **Send test webhook** → pick `payment_intent.succeeded`.
   - Vercel function logs should show the event being processed.
   - **Click "Send test webhook" AGAIN with the same event.** Second delivery should log "duplicate event, skipping" and return 200 without reprocessing. That's your idempotency demo — screenshot this for your portfolio page.
8. Report URL to Claude → portfolio card `live:` updated + README updated with the duplicate-webhook screenshot.

**If Option B (Render + Express):**

1. **Provision Redis** (same as redis-battle-demo step 1). Name: `stripe-payments-demo-redis`.
2. **Web Service** → connect `Shailesh93602/stripe-payments-demo` repo
   - Name: `stripe-payments-demo`
   - Same region as Redis.
   - Build: `npm install && npm run build` (project is TS, needs build).
   - Start: `npm start`
   - Plan: **Free**.
3. **Environment variables:**
   - `STRIPE_SECRET_KEY` (from Stripe).
   - `REDIS_URL` (Internal Redis URL from step 1).
   - `NODE_ENV` = `production`.
   - `PORT` = `10000`.
4. **Deploy** — get assigned URL.
5. **Stripe webhook config** — same as Option A step 5, but endpoint URL is `https://<render-url>/webhook` (no `/api/` prefix on Express).
6. Copy signing secret back to Render env as `STRIPE_WEBHOOK_SECRET`, save → auto-redeploys.
7. **Test with duplicate webhook** — same as Option A step 7. Screenshot the logs.
8. Report URL to Claude.

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

## Checklist — When Deploying ANY New Project

Every time you deploy a new project (yours or otherwise) that has a DB, auth, or background workloads, run through this list so nothing rots on free tier:

| Concern | What to do |
|---|---|
| Supabase / Postgres keep-alive | If the project uses a free-tier Supabase Postgres, add a `/api/cron/keepalive` route + a `vercel.json` cron entry (`0 9 * * *`) that runs a trivial DB query. See `app/api/cron/keepalive/route.ts` in KhataGO or DevTrack as copy-paste templates. Protect with `CRON_SECRET` env var. |
| Vercel env vars | Minimum: `NODE_ENV=production`, plus whatever the project needs (`DATABASE_URL`, `SUPABASE_*`, `STRIPE_*`, `GEMINI_API_KEY`, `CRON_SECRET`, etc.). Set for **Production** and **Preview** unless there's a reason to split. |
| Error surfacing | Make sure the app doesn't swallow prod errors into generic messages without logging the real error to the Vercel function log. Pattern: `console.error("...", { message, stack, context })` before returning the friendly response. |
| Public URL | Once deployed, add the live URL to the portfolio's `constants/projects.ts` (for the project card) and to the README. Tell Claude the URL to auto-update. |
| Sentry / monitoring (optional) | If the project already imports `@sentry/nextjs`, make sure `NEXT_PUBLIC_SENTRY_DSN` is set on Vercel. Otherwise skip. |
| Deploy-platform choice | Default to Vercel. Go to Render/Fly only if the project needs persistent connections (Socket.io / WebSockets / long-polling / worker queues). See MANUAL task 4/5 for the redis-battle-demo and stripe-payments-demo decisions as templates. |
| Screenshots for portfolio | After deploy, take 1 light-mode + 1 dark-mode screenshot of the main flow. Used as OG images + portfolio card image. |

**Concretely — when you deploy project X:**

1. Land the keepalive cron PR before the first deploy that'll see real users.
2. Set `CRON_SECRET` + whatever other env vars the app needs.
3. Deploy.
4. Verify `/api/cron/keepalive` appears in **Vercel dashboard → Project → Cron Jobs**.
5. Manually test once: `curl -H "Authorization: Bearer $CRON_SECRET" https://<project>.vercel.app/api/cron/keepalive` — expect `{"ok":true}`.
6. Tell Claude the live URL.

---

## Application Readiness Checklist

**Before applying to any company, all items in that row must be done:**

| Company  | Required before applying                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------- |
| Skydo    | KhataGO public, KhataGO case study reframed as ledger pipeline, 3 live URLs green                     |
| Stripe   | stripe-payments-demo live + SCA/3DS layer, case study deep-dive, Loom, resume + LinkedIn updated      |
| Vercel   | OSS PR merged, Lighthouse CI green + Web Vitals screenshot, edge-runtime demo shipped, resume updated |
| Supabase | RLS + Realtime-presence + pgvector demo shipped, DevTrack guest mode OR Loom, RLS SQL documented      |

---

## Add CodeSenseiSearch Screenshot — 15 min (when convenient)

The CodeSenseiSearch portfolio card uses a placeholder image.

1. Navigate to the live Swagger UI (`/api`)
2. Make a sample semantic search query
3. Screenshot the response
4. Save as `public/Images/codesensei-search.png`
5. Tell Claude: "update CodeSenseiSearch card image to /Images/codesensei-search.png"
