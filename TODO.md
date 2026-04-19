# TODO.md — Code-Executable Tasks (Next 3 Months)

All tasks here can be done with code, terminal commands, or file edits.
See PLAN.md for strategic context. See MANUAL.md for tasks requiring credentials or writing.

Legend: ✅ Done  🔲 Pending  🚫 Blocked (needs manual step first)

**Current test counts (as of April 19, 2026):**
- portfolio_next: 242 tests ✅, 70.66% coverage ✅
- redis-battle-demo: 48 tests ✅
- CareerGlyph backend: 58 unit + 13 E2E = 71 tests ✅
- stripe-payments-demo: 29 tests ✅ (NEW)

---

## Completed (Month 1 — Apr 18–19, 2026)

| Task | Deliverable |
|---|---|
| 1A — Portfolio cards | redis-battle-demo + CareerGlyph + stripe-payments-demo added to `constants/projects.ts` |
| 1B — CareerGlyph frontend | `/[username]` profile viewer, `/login`, `/register`, TanStack Query, optimistic endorsements |
| 1C — EduScale README | Redis adapter, Redlock, circuit breaker, Prometheus all documented with code snippets |
| 1D — stripe-payments-demo | Webhook deduplication (SETNX), payment intent idempotency key, exponential-backoff retry, 29 tests |
| 1E — DevTrack Realtime | `useRealtimeLogs` hook, `RealtimeLogList` component, live indicator dot |
| 2D — Statistics skeleton | `app/statistics/loading.tsx` already existed and is complete |

---

## Month 1 Remaining — by May 18, 2026

### 1F — Update DevTrack portfolio card

DevTrack now has Supabase Realtime. The card doesn't mention it.

- 🔲 **`constants/projects.ts` DevTrack card** — add `Supabase Realtime` to tags array
- 🔲 **Update `detailedDescription`** — mention the realtime activity feed with live indicator

---

### 1G — Update `llms.txt` for new projects

AI crawlers and LLM-assisted recruiters read `llms.txt`. Add the 3 new projects.

- 🔲 **`public/llms.txt`** — add redis-battle-demo, CareerGlyph frontend, stripe-payments-demo
- 🔲 **`public/llms-full.txt`** — same, with architecture detail

---

### 1H — CareerGlyph frontend README

Recruiters who click the frontend GitHub folder see no README.

- 🔲 **`apps/frontend/README.md`** — add: `npm run dev`, env vars (`NEXT_PUBLIC_API_URL`),
  backend dependency (NestJS on :3001), pages (`/`, `/login`, `/register`, `/[username]`)

---

### 1I — stripe-payments-demo README

The repo is committed but the README is missing. Recruiters need to understand the
idempotency pattern within 30 seconds of opening it.

- 🔲 **`README.md`** — document:
  - The problem: Stripe delivers webhooks at-least-once
  - The solution: Redis SETNX idempotency guard
  - Sequence diagram: first delivery → processed; duplicate → skipped
  - Running locally: `npm run dev`, env vars (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, REDIS_URL)
  - Running tests: `npm test`

---

## Month 2 — May 18 to Jun 18, 2026

**Goal: Get every project publicly accessible. Deploy redis-battle-demo and stripe-payments-demo.**

---

### 2A — Deploy redis-battle-demo to Railway

- 🔲 **Add `railway.toml`** to redis-battle-demo repo
  ```toml
  [build]
  builder = "NIXPACKS"

  [deploy]
  startCommand = "node src/server.js"
  healthcheckPath = "/health"
  ```
- 🔲 **Verify `REDIS_URL` env var** is read from environment (already done — confirm)
- 🔲 **Update portfolio card `live:` field** — after MANUAL §6 gives you the Railway URL

---

### 2B — Deploy stripe-payments-demo to Railway

- 🔲 **Add `railway.toml`** — same structure as redis-battle-demo
  ```toml
  [deploy]
  startCommand = "npm run build && npm start"
  healthcheckPath = "/health"
  ```
- 🔲 **Add hosted demo endpoints** (see §3B) — so recruiters can test without Stripe creds
- 🔲 **Update portfolio card `live:` field** once deployed

---

### 2C — CodeSenseiSearch: deploy + real screenshot

- 🔲 **Add `Procfile`**: `web: node dist/main.js`
- 🔲 **Add `start:prod` script**: `nest build && node dist/main.js`
- 🔲 **DATABASE_URL** must point to Supabase PostgreSQL with pgvector enabled
- 🔲 **Update portfolio card** with real Railway URL
- 🔲 **Real screenshot** (MANUAL.md — take screenshot of Swagger search results)

---

### 2D — CareerGlyph: E2E tests for frontend

- 🔲 **`e2e/profile.spec.ts`**
  - Navigate to `/:username` → profile renders (skills, projects)
  - Navigate to `/ghost-user` → 404 state
  - Skills show endorsement counts
- 🔲 **`e2e/auth.spec.ts`**
  - Register → JWT stored → redirected to profile
  - Login with wrong password → error message shown
  - Login → endorse button visible; no login → endorse button hidden

---

### 2E — Portfolio: OG images on project detail pages

Project detail pages at `/portfolio/:id` have no OpenGraph image — they inherit the default.

- 🔲 **`app/portfolio/[id]/metadata.ts`** — add `openGraph.images` pointing to
  `/api/og?title=<project title>&description=<first 80 chars>`
- 🔲 **Test with** `https://opengraph.xyz/` — verify the image generates

---

## Month 3 — Jun 18 to Jul 18, 2026

**Goal: Ship blog posts, apply to companies, final polish pass.**

---

### 3A — Blog post publication (after MANUAL work is done)

- 🔲 Uncomment `"eduscale-redis-distributed-locks-real-time"` in `lib/blog-data.ts` BLOG_SLUGS, run `npm run generate-blog-manifest`
- 🔲 Uncomment `"postgres-rbac-eduscale-permissions"` — same
- 🔲 Uncomment `"khatago-webhook-deduplication-receipt-pipeline"` — same (🚫 blocked until KhataGO public)
- 🔲 Uncomment `"nextjs-isr-edge-caching-performance"` — same

---

### 3B — stripe-payments-demo: duplicate simulation endpoint

- 🔲 **`GET /demo/simulate-duplicate`** — fires the same event ID twice
  - Response: `{ eventId, firstCall: { processed: true }, secondCall: { skipped: true, ttlRemaining: N } }`
  - This is the demo you run in a Stripe technical interview

---

### 3C — KhataGO README (blocked until MANUAL §1)

- 🚫 WhatsApp webhook flow diagram
- 🚫 Gemini OCR pipeline doc (prompt + XML example)
- 🚫 Running locally (ngrok + webhook setup)

---

### 3D — URL health check script

- 🔲 **`scripts/check-live-urls.mjs`** — curl each live URL, report 200 vs error
  ```js
  const URLS = [
    'https://eduscale.vercel.app',
    'https://daily-dev-track.vercel.app',
    'https://khatago.vercel.app',
  ];
  // fetch each, log status + response time
  // exit 1 if any fails — usable as a cron or pre-deploy check
  ```

---

### 3E — Portfolio: final review pass before applications

- 🔲 Run `scripts/check-live-urls.mjs` — verify all projects return 200
- 🔲 Add `og:image` to project detail pages (§2E)
- 🔲 Run `npm run test:coverage` — confirm still 70%+ after any changes
- 🔲 Run `npm run type-check` — must be clean
- 🔲 Run `npm run build` — zero warnings

---

## Quick Reference: Project → Target Company

| Project               | Primary Signal                             | Target Company    |
| --------------------- | ------------------------------------------ | ----------------- |
| EduScale              | Distributed systems (Redlock, Redis, CB)   | All               |
| redis-battle-demo     | Distributed lock visualization + metrics   | Stripe, Vercel    |
| stripe-payments-demo  | Correctness: idempotency, deduplication    | Stripe            |
| KhataGO               | Fintech: WhatsApp API, OCR, Tally XML      | Skydo, Stripe     |
| CareerGlyph           | NestJS API + auth + RBAC + test suite      | Supabase, Vercel  |
| CodeSenseiSearch      | pgvector semantic search, AI pipelines     | Supabase          |
| DevTrack              | Next.js + Supabase Realtime + analytics    | Supabase, Vercel  |
| portfolio itself      | Next.js depth: SEO, ISR, Edge, 242 tests   | Vercel            |

---

## Quick Reference: File Locations

| What to change                | File                                           |
| ----------------------------- | ---------------------------------------------- |
| Project card content          | `constants/projects.ts`                        |
| Experience / Education        | `constants/index.ts`                           |
| Blog post list                | `lib/blog-data.ts` BLOG_SLUGS array            |
| Blog post content             | `content/blog/<slug>.mdx`                      |
| Social links, email, site URL | `lib/constants.ts`                             |
| About page bio text           | `app/about/AboutContent.tsx`                   |
| Navigation links              | `components/navbar/index.tsx`                  |
| AI crawler context            | `public/llms.txt`, `public/llms-full.txt`      |
| Resume PDF                    | `public/Shailesh_Chaudhari_Resume.pdf`         |
| Page metadata                 | `app/<page>/metadata.ts`                       |
| OG image design               | `app/api/og/route.tsx`                         |
| RSS feed                      | `app/feed.xml/route.ts`                        |
| CareerGlyph API               | `~/Desktop/Coding/careerglyph/apps/backend/`   |
| CareerGlyph Frontend          | `~/Desktop/Coding/careerglyph/apps/frontend/`  |
| redis-battle-demo             | `~/Desktop/Coding/redis-battle-demo/`          |
| stripe-payments-demo          | `~/Desktop/Coding/stripe-payments-demo/`       |
