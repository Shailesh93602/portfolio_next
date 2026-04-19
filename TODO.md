# TODO.md — Code-Executable Tasks

Tasks Claude can do with code, terminal commands, or file edits.
See [MANUAL.md](MANUAL.md) for tasks that require your credentials, accounts, or original writing.

**Last updated: 2026-04-19**

## Recruiter review summary (2026-04-19)

- Grade: **C+** — "promising early-career full-stack engineer; not yet a yes-screen for Stripe/Vercel/Supabase without targeted sharpening."
- Top 3 recruiter red flags (all in progress or fixed): empty `/blogs` (fixed), `/statistics` stuck loading (fixed), generic hero (updated with real work history, needs a draft pick from user).
- Source: `/tmp/portfolio-recruiter-review.md`.

## Current state (2026-04-19)

- 9 portfolio projects (EduScale, DevTrack, KhataGO, Vibe Testing, AxeTos, CodeSensei Search, CareerGlyph, redis-battle-demo, stripe-payments-demo). EduScale / DevTrack / KhataGO confirmed live; the rest need deploy.
- Portfolio: 247 tests passing, `npm run build` clean.
- Lint/build/format/type-check green across **all** of portfolio_next, KhataGO, DevTrack, EduScale/Frontend, EduScale/Backend, redis-battle-demo, stripe-payments-demo, CareerGlyph/FE+BE, CodeSensei/api.
- Hero copy on home page now reflects real work: backend at ContextQA (core product, not Chrome extensions anymore), prior ~2 yrs at EsparkBiz, side-project breadth. **User still needs to pick one of the 3 single-line positioning drafts in MANUAL.md §1.**

---

## Month 1 — Apr 19 → May 19, 2026 — Unblock + ship

### Done

- 1A — Portfolio build failure at `/portfolio/eduscale` fixed (commit 14c79b3: missing `"use client"` on PortfolioSkeleton.tsx caused framer-motion to be undefined in SSG)
- 1B — KhataGO AI chat error fix shipped (commit 8d96698 in KhataGO: failing-loud on missing key + switched model to `gemini-2.0-flash`; user verified `GEMINI_API_KEY` on Vercel)
- 1E — Supabase keep-alive (rewritten): replaced GitHub Actions with per-project Vercel crons in KhataGO, DevTrack, EduScale/Frontend — awaiting `CRON_SECRET` on Vercel (MANUAL §2)
- 1H — `/blogs` SSR fix (commit 2bcac90: Suspense fallback was swallowing the list in initial HTML; now renders 27 post links server-side)
- 1I — `/statistics` SSR fix (commit 38eaef0: added 10s upstream timeout + snapshot fallback; initial HTML now contains real numbers)
- 1K — Honesty-pass on hero + home "What I'm building" strip (replaced fake PR counts + aspirational role titles with honest side-project framing)
- 1L — Stripe case-study page on `/portfolio/stripe-payments-demo` (commit cec5f4a): SVG sequence diagram, Redis before/after walkthrough, naive-retry vs production-retry comparison panel
- 1M — Contact form `/api/contact` route with Resend + Zod + rate limit + 5 new tests (commit 81650a1) — awaiting `RESEND_API_KEY` on Vercel (MANUAL §5)
- 1N — Lint/build/format/type-check swept across all 9 repos (2026-04-19 audit) — scripts added, 4 classes of errors fixed (KhataGO `any`, EduScale/BE seeder vars, CareerGlyph root eslint config, CodeSensei stale `@ts-expect-error`)

### Pending (code-side)

- **1C** — Port `stripe-payments-demo` from Express to Next.js API routes (path `app/api/webhook/route.ts`, `app/api/create-payment-intent/route.ts`, `app/api/simulate-payment/route.ts`). User will deploy to Vercel after the port. Move `src/{idempotency,payments,retry,webhook}.ts` helpers, adapt tests. Keep the express-based version in a `legacy/` branch. Blocks MANUAL §4.
- **1D** — After user deploys the ported stripe-payments-demo, update `constants/projects.ts` with live URL + push new OG screenshot.
- **1F** — Refresh `public/llms.txt` / `public/llms-full.txt` with all 9 projects (currently lags). Add short architecture note per project.
- **1G** — Add a README to `stripe-payments-demo` that opens with the idempotency sequence diagram (reuse the SVG from portfolio's StripeCaseStudy), covers SETNX/HMAC/backoff/"don't retry 4xx", and has run+test steps.

### Blocked (waiting on user)

- 1J — Wire one of the 3 hero drafts from MANUAL §1 into `app/HomeContent.tsx` (currently the home hero paragraph is honest but the single-line positioning statement above it is still the cycling-titles carousel)

---

## Month 2 — May 19 → Jun 19, 2026 — Depth + proof

### Already done

- 2D — Dynamic OG images per project-detail page (commit 8754c2d)
- 2G — URL health-check script exists (`scripts/check-live-urls.mjs`) — scheduled workflow wiring still pending (see 2G' below)
- 2I — Replaced mailto contact with `/api/contact` (shipped this sprint)
- 2J — "Things I'm building to learn" strip on home (commit cec5f4a — copy updated for honesty this turn)

### Pending

- **2A** — Expand EduScale case study with a real-incident section (symptom / hypothesis / fix / confirmed-by-metric). **Blocked** on MANUAL §11 (user dictates 4 bullets).
- **2B** — Expand KhataGO case study. Reframe as "WhatsApp → Gemini function-calling → Prisma + reconciliation" with explicit flows: webhook verification, OCR prompt, transaction/receivable write path, reminder cron. Target-company signal: fintech + AI tool-use.
- **2C** — Stripe case-study page is mostly done (commit cec5f4a); pending: add visible GitHub Actions CI badge + live-URL link once 1D lands.
- **2E** — Perf pass for Web Vitals proof. `npm run analyze`, audit images >100 kB, font subset, dynamic-import the remaining chart components, target LCP <1.8s, INP <150ms, CLS <0.05, PageSpeed ≥95 mobile. Add a Web-Vitals screenshot to `/about`.
- **2F** — CareerGlyph frontend: edit-profile page, endorse button optimistic UX, register → edit → endorse E2E.
- **2G'** — Wire `scripts/check-live-urls.mjs` into a GitHub Actions cron so silent outages get surfaced before a recruiter hits them.
- **2H** — Guest-mode for DevTrack so a logged-out recruiter sees Realtime. Option A: seeded demo account auto-logs in on `?demo=1`. Option B: 30s Loom embedded on `/portfolio/devtrack` (MANUAL §9 delivers the Loom).
- **2K** — SEO audit: verify per-page OpenGraph + JSON-LD schema renders on home, about, portfolio, a project detail, one blog post. `https://search.google.com/test/rich-results` must pass.
- **2L** — E2E gate: every page must emit zero console errors, zero 4xx/5xx on internal links. CI fails on violation.
- **2M** — Port ArchitectureDiagram's icon logic so non-showcase projects can also visualize architecture (currently the fallback just lists architecture as text).

---

## Month 3 — Jun 19 → Jul 19, 2026 — Target-company alignment

### Pending

- **3A — Stripe SCA / 3DS demo** — `stripe-payments-demo` or sibling repo demonstrates `requires_action` → `confirmCardPayment` → webhook reconciliation; state machine on the case-study page; bonus: dispute/refund + metered billing.
- **3B — Vercel edge-runtime demo** — `/api/geolocate` on edge runtime, Upstash-backed rate limiter, cold-start comparison vs Node lambda. New portfolio card.
- **3C — Supabase-native demo** — Extend DevTrack with RLS policies (documented SQL on the case study page) + Realtime presence ("who's viewing this dashboard") + pgvector semantic search of commits.
- **3D — Lighthouse CI in GitHub Actions** — `lhci` runs per PR against home + one project detail page; LCP/INP/CLS budgets block merge on regression.
- **3E — Apply-ready sweep** — `scripts/check-live-urls.mjs` green + `npm run build` clean + `npm run type-check` clean + `npm run test:coverage` ≥ 70% + Lighthouse budgets met + all MANUAL §P0 items done.

### Nice-to-have (added this turn, good-to-have for selection)

- **3F** — Blog-less technical content: add a `/notes` section to the portfolio that allows short, paragraph-sized writeups without the "blog post" framing (lower employer risk than /blogs per MANUAL §14 decision). One per target company: "How webhook idempotency actually breaks," "How RLS policies really compose," "Cold-start myths on Vercel Edge."
- **3G** — CodeSensei Search deserves a live-demo widget on its portfolio page — embed a 3-query search box hitting the live API.
- **3H** — Add a Sentry-like error log viewer on `/admin/errors` (gated by a local-only env flag). Shows you can instrument in addition to building.
- **3I** — Repo badges — every project README gets a CI badge + test-count badge + coverage badge so a recruiter can scan the repo in 5 seconds.

---

## Quick Reference: Project → Target Company

| Project              | Primary signal                           | Target           |
| -------------------- | ---------------------------------------- | ---------------- |
| EduScale             | Distributed systems (Redlock, Redis, CB) | All              |
| redis-battle-demo    | Distributed-lock visualization + metrics | Stripe, Vercel   |
| stripe-payments-demo | Correctness: idempotency, deduplication  | Stripe           |
| KhataGO              | Reconciliation + AI tool-use             | Stripe           |
| CareerGlyph          | NestJS API + auth + RBAC + test suite    | Supabase, Vercel |
| CodeSensei Search    | pgvector semantic search, AI pipelines   | Supabase         |
| DevTrack             | Supabase Realtime + analytics            | Supabase, Vercel |
| portfolio itself     | Next.js depth: SEO, SSR, 247 tests       | Vercel           |

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
| Hero copy                     | `app/HomeContent.tsx`                          |
| CareerGlyph API               | `~/Desktop/Coding/CareerGlyph/apps/backend/`   |
| CareerGlyph Frontend          | `~/Desktop/Coding/CareerGlyph/apps/frontend/`  |
| redis-battle-demo             | `~/Desktop/Coding/redis-battle-demo/`          |
| stripe-payments-demo          | `~/Desktop/Coding/stripe-payments-demo/`       |
