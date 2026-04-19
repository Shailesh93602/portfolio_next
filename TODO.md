# TODO.md — Code-Executable Tasks (Next 3 Months)

All tasks here can be done with code, terminal commands, or file edits.
See MANUAL.md for tasks requiring credentials or writing.

Legend: Done | Pending | Blocked (needs manual step first)

## Recruiter review summary (2026-04-19)

- Grade: **C+** — "promising early-career full-stack engineer; not yet a yes-screen for Stripe/Vercel/Supabase without targeted sharpening."
- One-line verdict: polish and breadth are above-average for 2 YoE, but the hero fails to position, flagship case studies skew marketing-over-engineering, and target-company signals exist but don't stand out in 30 seconds.
- Source: `/tmp/portfolio-recruiter-review.md` (read in full for evidence + red flags + target-company alignment notes).
- Top 3 Claude-side fixes: /blogs listing renders empty, /statistics stuck in loading state, hero copy is generic.
- Top 3 user-side fixes: deploy stripe-payments-demo + redis-battle-demo, write 3-sentence positioning statement, record 3 Looms.

**Current state (as of April 19, 2026):**

- 9 portfolio projects live (eduscale, devtrack, vibe-testing, axetos, codesensei-search, khatago, redis-battle-demo, careerglyph, stripe-payments-demo)
- Portfolio: 242 tests passing, 70.66% coverage
- Shipped today (2026-04-19): `/portfolio/eduscale` build fix (commit 14c79b3); Supabase keep-alive workflow drafted (awaiting secrets — MANUAL §3); KhataGO AI chat fix (KhataGO repo commit 8d96698 — awaiting GEMINI_API_KEY verification on Vercel, MANUAL); EduScale middleware fast-path fix applied in main + Exavel forks
- Blog posts BLOCKED by current employment — portfolio detail pages carry the writing load instead

---

## Month 1 — Apr 19 → May 19, 2026 — Unblock and ship

**Goal: eliminate every build/runtime error. Fix the three red-flag surfaces a recruiter sees first.**

### 1A — Fix portfolio build failure at /portfolio/eduscale

- Done (2026-04-19, commit 14c79b3) — `Element type is invalid: got undefined` resolved
- Why: blocked `npm run build`; every deploy and every PR preview was red
- Done when: `npm run build` completes clean; `/portfolio/eduscale` renders in prod

### 1B — Fix EduScale production AI chat error

- Done (KhataGO repo commit 8d96698) — code fix shipped; awaiting env verification on Vercel (MANUAL §15)
- Why: recruiters test the flagship feature first; broken chat = dead demo
- Done when: chat sends a message and streams a Gemini response in prod

### 1C — Deploy redis-battle-demo (Railway trial exhausted)

- Blocked — deploy target is **Render or Fly** (Vercel serverless cannot hold Socket.io WebSocket connections). See MANUAL §4.
- Why: portfolio card has no live link; distributed-lock demo is invisible
- Done when: live URL returns 200; portfolio card `live:` populated

### 1D — Deploy stripe-payments-demo

- Blocked — two paths under consideration (MANUAL §5): (a) port Express routes to Next.js API routes and deploy on Vercel (preferred — matches target-company signal since everything else ships on Vercel) or (b) keep Express and deploy on Render. HTTP only, no WebSockets, so Vercel serverless works.
- Why: Stripe application needs a live, curl-able artifact
- Done when: webhook endpoint reachable over HTTPS; README updated with live URL

### 1E — Supabase keep-alive GitHub Actions cron

- Done (workflow committed) — waiting on MANUAL §3 secrets to start running
- Why: free-tier Supabase pauses after 7 days; recruiters hit DB errors
- Done when: workflow runs daily; last-run green for eduscale/devtrack/khatago

### 1F — Update `llms.txt` / `llms-full.txt` for 9 projects

- Pending — still reflects 6-project roster
- Why: LLM-assisted recruiters and crawlers read this before hitting pages
- Done when: both files list all 9 projects with short architecture notes

### 1G — stripe-payments-demo README

- Pending — repo committed without README
- Why: 30-second recruiter scan needs problem → solution → idempotency pattern
- Done when: README opens with the idempotency sequence diagram, covers SETNX webhook guard, HMAC verify, exponential backoff + jitter, "don't retry 4xx" rule, run/test steps

### 1H — Fix /blogs listing render (recruiter red flag #7)

- Pending — live `/blogs` returns no article cards despite 21 MDX files + sitemap entries
- Why: recruiters see an empty blog; either a rendering bug or hydration gap
- Done when: curl of `/blogs` shows at least 15 cards with dates in initial SSR HTML; verify `BLOG_SLUGS` export, `loadPost` gray-matter parsing, and page.tsx iteration

### 1I — Fix /statistics loading-forever state (recruiter red flag #3)

- Pending — `/api/statistics` never hydrates the client; visible state is "Loading coding statistics…"
- Why: a blank page is worse than no page; kills credibility
- Done when: add 10 s timeout with fallback UI backed by a static JSON snapshot committed to repo; curl of `/statistics` contains GitHub and LeetCode numbers in initial HTML

### 1J — Rewrite hero positioning line (recruiter red flag #1)

- Pending — current hero says "Full Stack Developer"; zero target-role signal
- Why: a Stripe/Vercel/Supabase recruiter infers nothing in 10 seconds
- Done when: `app/(home)/HomeContent.tsx` renders the 3-sentence positioning statement from MANUAL §P0-1; a recruiter can infer target role from hero in <5 seconds

---

## Month 2 — May 19 → Jun 19, 2026 — Depth, proof, and target-company artifacts

**Goal: case studies read like internal design docs, not product pages. Web Vitals proof visible.**

### 2A — Expand EduScale case study on `/portfolio/eduscale` (red flag #2)

- Pending
- Why: current page names the right primitives (Redlock, opossum, Redis adapter, Prometheus) but has no p95/p99, no concurrent-user numbers, no incident writeup, no tradeoff narrative
- Done when: a "real incident" section is present (symptom / hypothesis / fix / confirmed-by-metric — 4 bullets minimum, sourced from MANUAL §P1-9), one real latency histogram from a k6 local run, one Redlock timeout-tuning tradeoff documented inline

### 2B — Expand KhataGO case study on `/portfolio/khatago`

- Pending
- Why: fintech signal for Stripe; reframe as "ledger + reconciliation pipeline" not "WhatsApp AI app" (review target-company alignment note)
- Done when: WhatsApp webhook flow, Gemini OCR prompt, Tally XML sample, SETNX dedup section all present on the detail page

### 2C — Stripe-demo deep case-study page on `/portfolio/stripe-payments-demo` (red flag #4)

- Pending
- Why: this is the single highest-signal artifact for a Stripe application; must read like a Stripe internal design doc
- Done when: (a) SVG sequence diagram of webhook → SETNX → handler → ack, (b) a "duplicate event walkthrough" showing Redis keys before/after, (c) a "what a 4xx retry would break" side-panel, (d) visible GitHub Actions CI badge, (e) the live URL from MANUAL §5

### 2D — OG images on project detail pages

- Done (commit 8754c2d) — `@vercel/og` dynamic OG wired on `/portfolio/[id]`
- Why: LinkedIn shares of project pages no longer use the default OG
- Done when: LinkedIn share of `/portfolio/eduscale` shows project-specific preview

### 2E — Performance pass (LCP, INP, CLS, bundle) — Vercel-proof the site (red flag target #8)

- Pending
- Why: Vercel hires for perf obsession; no Web Vitals number is currently visible anywhere on the site
- Done when: `npm run analyze` reviewed; recharts-heavy `stats-charts.tsx` + `github-contribution-heatmap.tsx` dynamic-imported (ssr:false already on charts — verify coverage); fonts subset; images >100 kB audited; `priority` only on hero; LCP <1.8 s, INP <150 ms, CLS <0.05 on a real device (PageSpeed ≥95 mobile); a Web Vitals screenshot added to the about page

### 2F — CareerGlyph frontend completion

- Pending
- Why: `/[username]` viewer exists but flow gaps remain (edit profile, skill endorsements UI)
- Done when: edit-profile page shipped; endorse button optimistic UX end-to-end; E2E tests cover register → edit → endorse path

### 2G — URL health check in CI

- Done (commit 8754c2d) — `scripts/check-live-urls.mjs` exists; scheduled workflow wiring pending
- Why: catch silent outages before a recruiter does
- Done when: GitHub Actions cron runs the script daily; failure opens an issue (or posts to Slack/email)

### 2H — Guest mode / Loom for DevTrack live demo (red flag #5)

- Pending — DevTrack live URL currently lands on a login wall; Supabase Realtime claims are unprovable by a logged-out visitor
- Why: the Supabase-realtime signal is dead on arrival if a recruiter can't see it
- Done when: either a seeded demo account auto-logs in on `/?demo=1` with pre-populated activity and Realtime updating, OR a 30 s Loom is embedded on `/portfolio/devtrack` (MANUAL §P1-7 delivers the Loom)

### 2I — Replace mailto contact with a real API route (red flag #6)

- Pending — contact form opens a mailto; looks amateur next to Cal.com or an API-backed form; no analytics on inbound interest
- Why: senior-role recruiters expect an API-backed form + scheduling link
- Done when: `/api/contact` ships using Resend or Postmark free tier + Zod validation + rate limit; Cal.com embed added to the contact page; form submits without opening a mail client

### 2J — "What I'm optimizing for" strip on the home page

- Pending
- Why: the three target-company tells (payments / real-time / platform DX) must be visible above the fold — recruiters pattern-match in 10 seconds
- Done when: 3 home-page cards ship — "Payments infra" → `/portfolio/stripe-payments-demo`, "Real-time systems" → `/portfolio/eduscale`, "Platform/DX" → `/portfolio/devtrack`

### 2K — SEO: per-page OpenGraph + JSON-LD audit

- Pending — partially in place; audit for completeness
- Why: Person, BlogPosting, and SoftwareSourceCode schema surface on AI-assisted recruiter tooling
- Done when: `https://search.google.com/test/rich-results` passes on 5 pages (home, about, portfolio, one project detail, one blog post)

### 2L — Broken-links & console-error E2E gate

- Pending
- Why: CI must fail on any page that emits a console error or has a broken link
- Done when: `e2e/` test iterates all routes, asserts zero console errors, asserts zero 4xx/5xx on internal links; CI green gate present

---

## Month 3 — Jun 19 → Jul 19, 2026 — Target-company alignment

**Goal: one polished demo per target company + Lighthouse CI enforced + tailored applications.**

### 3A — Stripe SCA/3DS happy-path + failure-path demo (review P2-17)

- Pending
- Why: Stripe will filter on money-movement primitives; basic webhook idempotency is not enough
- Done when: `stripe-payments-demo` (or a linked sibling repo) demonstrates `requires_action` → `confirmCardPayment` → webhook reconciliation; state machine documented in the case-study page; bonus: dispute/refund flow + metered-billing toy

### 3B — Vercel edge-runtime demo (review P2-15)

- Pending
- Why: Vercel wants engineers who already ship on the platform idiomatically
- Done when: a tiny `/api/geolocate` on the edge runtime with a KV-backed rate limiter lives on Vercel; a short "portfolio note" page documents cold-start numbers vs node lambda; portfolio card added

### 3C — Supabase-native demo: RLS + Realtime presence + pgvector (review P2-16)

- Pending
- Why: RLS expertise is Supabase's top filter
- Done when: DevTrack (or a new small app) extended with RLS policies + Realtime presence (live cursors or "who's viewing this dashboard") + `pgvector` semantic search of commits; RLS policy documented with actual SQL on the devtrack case-study page; portfolio card updated

### 3D — Lighthouse CI in GitHub Actions (review P2-18)

- Pending
- Why: enforce LCP/INP/CLS budgets per PR; makes the perf claim auditable
- Done when: `lhci` runs on every PR against home + one project detail page; budget file commits LCP <1.8 s, INP <150 ms, CLS <0.05; failures block merge

### 3E — Tailored application packets

- Pending
- Why: generic applications get filtered; each target gets its own cover + project list
- Done when: three application folders (stripe/, vercel/, supabase/) each with cover letter, resume variant, and 3 top project links ordered by relevance

### 3F — Final review pass before applying

- Pending
- Why: one broken link kills the application; hard sweep before send
- Done when: `scripts/check-live-urls.mjs` green, `npm run build` clean, `npm run type-check` clean, `npm run test:coverage` >= 70%, Lighthouse CI green on home and one project detail page

---

## Quick Reference: Project → Target Company

| Project              | Primary Signal                           | Target Company   |
| -------------------- | ---------------------------------------- | ---------------- |
| EduScale             | Distributed systems (Redlock, Redis, CB) | All              |
| redis-battle-demo    | Distributed lock visualization + metrics | Stripe, Vercel   |
| stripe-payments-demo | Correctness: idempotency, deduplication  | Stripe           |
| KhataGO              | Ledger + reconciliation pipeline         | Stripe           |
| CareerGlyph          | NestJS API + auth + RBAC + test suite    | Supabase, Vercel |
| CodeSenseiSearch     | pgvector semantic search, AI pipelines   | Supabase         |
| DevTrack             | Next.js + Supabase Realtime + analytics  | Supabase, Vercel |
| portfolio itself     | Next.js depth: SEO, ISR, Edge, 242 tests | Vercel           |

---

## Quick Reference: File Locations

| What to change                | File                                          |
| ----------------------------- | --------------------------------------------- |
| Project card content          | `constants/projects.ts`                       |
| Experience / Education        | `constants/index.ts`                          |
| Blog post list                | `lib/blog-data.ts` BLOG_SLUGS array           |
| Blog post content             | `content/blog/<slug>.mdx`                     |
| Social links, email, site URL | `lib/constants.ts`                            |
| About page bio text           | `app/about/AboutContent.tsx`                  |
| Navigation links              | `components/navbar/index.tsx`                 |
| AI crawler context            | `public/llms.txt`, `public/llms-full.txt`     |
| Resume PDF                    | `public/Shailesh_Chaudhari_Resume.pdf`        |
| Page metadata                 | `app/<page>/metadata.ts`                      |
| OG image design               | `app/api/og/route.tsx`                        |
| RSS feed                      | `app/feed.xml/route.ts`                       |
| Hero copy                     | `app/(home)/HomeContent.tsx`                  |
| CareerGlyph API               | `~/Desktop/Coding/careerglyph/apps/backend/`  |
| CareerGlyph Frontend          | `~/Desktop/Coding/careerglyph/apps/frontend/` |
| redis-battle-demo             | `~/Desktop/Coding/redis-battle-demo/`         |
| stripe-payments-demo          | `~/Desktop/Coding/stripe-payments-demo/`      |
