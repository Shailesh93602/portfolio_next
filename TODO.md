# TODO.md — Code-Executable Tasks (Next 3 Months)

All tasks here can be done with code, terminal commands, or file edits.
See MANUAL.md for tasks requiring credentials or writing.

Legend: Done | Pending | Blocked (needs manual step first)

**Current state (as of April 19, 2026):**

- 9 portfolio projects live (eduscale, devtrack, vibe-testing, axetos, codesensei-search, khatago, redis-battle-demo, careerglyph, stripe-payments-demo)
- Portfolio: 242 tests passing, 70.66% coverage
- EduScale middleware fast-path fix applied (public routes skip getUser())
- Blog posts BLOCKED by current employment — use portfolio pages to showcase tech depth instead

---

## Month 1 — Apr 19 → May 19, 2026 — Unblock and ship

**Goal: eliminate every build/runtime error. Get all demos deployable.**

### 1A — Fix portfolio build failure at /portfolio/eduscale

- Pending — build fails with `Element type is invalid: got undefined`
- Why: blocks `npm run build`; every deploy and every PR preview is red
- Done when: `npm run build` completes clean; `/portfolio/eduscale` renders in prod

### 1B — Fix EduScale production AI chat error

- Pending — prod chat returns "Sorry, I encountered an error processing your request."
- Why: recruiters test the flagship feature first; broken chat = dead demo
- Done when: chat sends a message and streams a Gemini response in prod

### 1C — Deploy redis-battle-demo (Railway trial exhausted)

- Pending — needs Render.com or Fly.io (MANUAL §12)
- Why: portfolio card has no live link; distributed-lock demo is invisible
- Done when: live URL returns 200; portfolio card `live:` populated

### 1D — Deploy stripe-payments-demo

- Pending — same Render/Fly alternative path
- Why: Stripe-target signal requires a runnable demo, not only a GitHub link
- Done when: webhook endpoint reachable over HTTPS; README updated with live URL

### 1E — Supabase keep-alive GitHub Actions cron

- Pending — repo workflow being authored in parallel (needs secrets from MANUAL §13)
- Why: free-tier Supabase projects auto-pause after 7 days; recruiters see DB errors
- Done when: workflow runs daily; last-run green for eduscale/devtrack/khatago

### 1F — Update `llms.txt` / `llms-full.txt` for 9 projects

- Pending — still reflects 6-project roster
- Why: LLM-assisted recruiters and crawlers read this before hitting pages
- Done when: both files list all 9 projects with short architecture notes

### 1G — stripe-payments-demo README

- Pending — repo committed without README
- Why: 30-second recruiter scan needs problem → solution → idempotency pattern
- Done when: README covers SETNX webhook guard, idempotency key, retry, run/test steps

---

## Month 2 — May 19 → Jun 19, 2026 — Polish and deepen portfolio content

**Goal: performance pass + expand project case studies as portfolio pages (NOT blog posts).**

### 2A — Expand EduScale case study on `/portfolio/eduscale`

- Pending
- Why: blog post route is blocked; portfolio detail page is the new home for depth
- Done when: page documents Redlock, opossum circuit breaker, Redis adapter, Prometheus,
  with code snippets and one real incident write-up (non-blog tone)

### 2B — Expand KhataGO case study on `/portfolio/khatago`

- Pending
- Why: fintech signal for Skydo/Stripe; blog blocked; page must carry the weight
- Done when: WhatsApp webhook flow, Gemini OCR prompt, Tally XML sample, SETNX dedup
  section all present on the detail page

### 2C — Expand stripe-payments-demo case study on `/portfolio/stripe-payments-demo`

- Pending
- Why: Stripe application requires this as the single highest-signal artifact
- Done when: idempotency diagram, duplicate-event walkthrough, test list on detail page

### 2D — OG images on project detail pages

- Pending
- Why: `/portfolio/:id` currently inherits default OG image; LinkedIn shares look generic
- Done when: `app/portfolio/[id]/metadata.ts` generates per-project OG via `/api/og`

### 2E — Performance pass (LCP, INP, CLS, bundle)

- Pending
- Why: Vercel application needs measurable Web Vitals; current bundle never analyzed
- Done when: `npm run analyze` reviewed; LCP < 2.0s on `/`; INP < 200ms;
  at least one concrete optimization landed (image format, dynamic import, or font subset)

### 2F — CareerGlyph frontend completion

- Pending
- Why: `/[username]` viewer exists but flow gaps remain (edit profile, skill endorsements UI)
- Done when: edit-profile page shipped; endorse button optimistic UX end-to-end;
  E2E tests cover register → edit → endorse path

### 2G — URL health check in CI

- Pending — `scripts/check-live-urls.mjs` exists; wire into a scheduled workflow
- Why: catch silent outages before a recruiter does
- Done when: GitHub Actions runs the script daily; failure opens an issue

---

## Month 3 — Jun 19 → Jul 19, 2026 — Target-company alignment

**Goal: one small demo per target company + tailored applications.**

### 3A — Study Stripe engineering blog + ship small demo

- Pending
- Why: tailored signal beats generic resume; Stripe values idempotency/correctness
- Done when: one demo repo (e.g., dispute-webhook replay tool, or idempotency key
  benchmark) linked from portfolio; notes file summarizing 5 Stripe eng posts

### 3B — Study Vercel engineering blog + ship small demo

- Pending
- Why: Vercel hires for Next.js/edge depth; need edge-runtime specific artifact
- Done when: one demo repo (edge middleware A/B router, or streaming RSC pattern) live
  on Vercel; portfolio card added

### 3C — Study Supabase engineering blog + ship small demo

- Pending
- Why: Supabase values Postgres/RLS/Realtime expertise
- Done when: one demo repo (RLS policy playground, or Realtime presence demo) live;
  portfolio card added

### 3D — Tailored application packets

- Pending
- Why: generic applications get filtered; each target gets its own cover + project list
- Done when: three application folders (stripe/, vercel/, supabase/) each with
  cover letter, resume variant, and 3 top project links ordered by relevance

### 3E — Final review pass before applying

- Pending
- Why: one broken link kills the application; do a hard sweep
- Done when: `scripts/check-live-urls.mjs` green, `npm run build` clean,
  `npm run type-check` clean, `npm run test:coverage` >= 70%,
  Lighthouse >= 95 on home and one project detail page

---

## Quick Reference: Project → Target Company

| Project              | Primary Signal                           | Target Company   |
| -------------------- | ---------------------------------------- | ---------------- |
| EduScale             | Distributed systems (Redlock, Redis, CB) | All              |
| redis-battle-demo    | Distributed lock visualization + metrics | Stripe, Vercel   |
| stripe-payments-demo | Correctness: idempotency, deduplication  | Stripe           |
| KhataGO              | Fintech: WhatsApp API, OCR, Tally XML    | Skydo, Stripe    |
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
| CareerGlyph API               | `~/Desktop/Coding/careerglyph/apps/backend/`  |
| CareerGlyph Frontend          | `~/Desktop/Coding/careerglyph/apps/frontend/` |
| redis-battle-demo             | `~/Desktop/Coding/redis-battle-demo/`         |
| stripe-payments-demo          | `~/Desktop/Coding/stripe-payments-demo/`      |
