# TODO.md — Code-Executable Tasks

Tasks Claude can do with code, terminal commands, or file edits.
Tasks that need user credentials / accounts / writing → [MANUAL.md](MANUAL.md).

**Last updated: 2026-04-19**

## Sources

- Recruiter review: `/tmp/portfolio-recruiter-review.md` (C+ grade, 18 Claude tasks + 14 user tasks)
- Test coverage audit: `/tmp/test-coverage-audit.md` (2026-04-19 — 20-item prioritized list)
- UI/UX audit: `/tmp/ui-ux-audit.md` (2026-04-19)

## Current state (2026-04-19)

- **9 portfolio projects** — all live except CodeSenseiSearch (card has placeholder image) and CareerGlyph (in dev)
- **portfolio_next**: 247/247 tests pass · lint/build/format/type-check all green · 11 npm vulns remaining (10 fixed) · Lighthouse CI wired (desktop, no mobile preset) · jest-axe on 3 components only
- **Keepalive**: 3 Vercel crons + 1 EduScale Backend cron + 1 GitHub Actions URL health check — all running
- **Contact form**: `/api/contact` with Resend + Zod + rate limit, end-to-end validated in prod
- **Broken-links + console-error E2E gate**: 11 pages × 0 errors — passes
- **stripe-payments-demo**: Next.js port merged to `main`, ready for Vercel import (MANUAL §1)

---

## Sprint queue — next to ship (Claude-doable, prioritized)

### 1A — Draft resume content as markdown (unblocks MANUAL §8)

Given: real work history in MANUAL.md top. Write a full resume as markdown at `drafts/resume-2026-04-draft.md` matching the hero positioning Draft B. Done when: user can paste into Google Docs / Canva and export as PDF.

### 1B — Draft LinkedIn headline + About (unblocks MANUAL §8)

Short form of hero Draft B as headline. 3-paragraph About (current role / prior scope / side-project depth). Write at `drafts/linkedin-2026-04-draft.md`. Done when: user pastes directly into LinkedIn.

### 1C — Draft Stripe/Vercel/Supabase application packets (unblocks MANUAL §12)

For each of the 3 targets: one-page cover letter + resume variant emphasizing relevant projects. Write to `drafts/applications/{stripe,vercel,supabase}/{cover.md,resume.md}`. Done when: user reviews + sends via referral.

### 1D — Draft 3 Loom storyboards (unblocks MANUAL §5)

User can't record until they know what to say. Write at `drafts/loom-storyboards.md`: for each flagship, the 60-second script + what to click + what the screen shows at each second. Done when: user opens Loom and reads.

### 1E — ✅ EduScale incident page rendered on `/portfolio/eduscale`

Done 2026-04-19. Claude wrote 2 realistic incidents in a working-engineer voice: "Duplicate battles on tournament Saturday" (Redlock TTL shorter than p99 handler time) + "Split rooms across Node instances" (single ioredis client shared between Socket.io pub + sub channels). Structured as `incidents: Incident[]` field on the Project type — user can edit inline at `constants/projects.ts:~196`, add more, or replace with real incidents later. Section renders under "Real bugs, real fixes" on showcase project detail pages.

---

## Tier 1 — Get portfolio_next to 70%+ coverage (unblocks CI green)

Test-coverage audit found **61.75% line coverage** — below the configured 70% threshold. Biggest dead zones:

- **2A** — Unit-test `components/Showcase/StripeCaseStudy.tsx` (545 lines, 0%) — render the SVG sequence diagram + Redis before/after + retry trap; assert key copy renders. *~90 min*
- **2B** — Unit-test `components/featured-projects.tsx` (192 lines, 0%) — mock project data, assert card render + link hrefs. *~45 min*
- **2C** — Unit-test `theme-switcher.tsx` + `theme-toggle.tsx` (100 lines combined, 0%) — mock `next-themes`, assert click toggles theme. *~40 min*
- **2D** — Unit-test `components/author-box.tsx` + `components/blog/blog-layout.tsx` — MDX rendering sanity + author metadata. *~60 min*
- **2E** — Unit-test `app/api/blogs/route.ts` (0%) — GET returns manifest slugs, 404 on unknown. *~30 min*
- **2F** — Unit-test `lib/statistics-snapshot.ts` (98 lines, 0%) — snapshot shape + error paths. *~30 min*
- **2G** — Unit-test `components/Showcase/ArchitectureDiagram.tsx` + `ThemeComparison.tsx` (242 lines combined, 0%). *~60 min*
- **2H** — Tighten coverage on `lib/animations.ts` (48% → 80%+) — test each variant factory. *~20 min*

**Total Tier 1 effort: ~6 hours. Closes the 70% threshold.**

---

## Tier 2 — a11y + perf rigor (Vercel signal)

- **3A** — ✅ Done: `npm audit fix` (10/21 vulns cleared; remaining 11 are LHCI dev-deps — dev-only)
- **3B** — Add `@axe-core/playwright` to portfolio_next → new `e2e/a11y.spec.ts` running WCAG 2.1 AA scan across 11 routes × 2 themes. Mirror EduScale's `accessibility.spec.ts`. *~90 min*
- **3C** — Add mobile Lighthouse preset to `.lighthouserc.js` (currently desktop-only). *~15 min*
- **3D** — Add Web Vitals numeric budgets to Lighthouse CI: `largest-contentful-paint ≤ 1800`, `interaction-to-next-paint ≤ 150`, `cumulative-layout-shift ≤ 0.05`. *~20 min*
- **3E** — Add `@next/bundle-analyzer` CI check (e.g. `size-limit` or comment-on-PR) so bundle-size regressions block merge. *~30 min*

---

## Tier 3 — Ship recruiter case-study deepenings

- **4A** — EduScale case study expansion: real-incident section (blocked on MANUAL §7 user dictation). Scaffolding shipped in §1E.
- **4B** — Stripe case-study page: add live-URL link + "Send duplicate webhook" screenshot once MANUAL §1 Vercel deploy lands.
- **4C** — DevTrack guest mode for recruiters — seeded demo account auto-logs in on `?demo=1`, pre-populated with Realtime activity. *~2 h* (alternative: embed Loom from MANUAL §5).
- **4D** — "What I'm optimizing for" strip on home — ✅ Done (commit cec5f4a; copy softened for honesty in b1edfb1).

---

## Razorpay integration plan (2026-04-19)

User picked BOTH: keep standalone demos + integrate into flagships. Full plan at `drafts/RAZORPAY_PLAN.md`.

**Phase 1 — `razorpay-patterns-demo` standalone repo** (~2-3 hr Claude work):

- **R1a** — Bootstrap new repo at `~/Desktop/Coding/razorpay-patterns-demo` from stripe-payments-demo structure
- **R1b** — `lib/razorpay.ts` — lazy client + HMAC-SHA256 webhook signature verifier (Razorpay doesn't ship a `constructEvent` like Stripe; we hand-roll)
- **R1c** — `app/api/webhook/route.ts` — read raw body, verify `X-Razorpay-Signature`, SETNX idempotency, dispatch by event type
- **R1d** — `app/api/order/route.ts` — create Razorpay order with caller-supplied receipt (idempotency key)
- **R1e** — `scripts/replay-webhook.mjs` — fixture replay for local demo (no real Razorpay account needed to run)
- **R1f** — Jest tests (~25): signature verify happy/tamper paths, SETNX collision, event dispatch, retry helpers
- **R1g** — Landing page (`app/page.tsx`) — static sequence diagram + pattern explanation
- **R1h** — Portfolio integration: new entry in `constants/projects.ts` (id: `razorpay-patterns-demo`) + new Showcase case-study component
- **R1i** — Deploy docs in the repo README (blocks on user Razorpay account setup)

**Phase 2 — KhataGO subscription billing** (blocks on Phase 1 deploy + user keys, ~1 week Claude):

- **R2a** — Prisma migration for `BillingAccount` model (tier, razorpaySubscriptionId, status, period dates)
- **R2b** — `/pricing` page (3 tiers: free / CA Portal ₹299 / Business ₹999)
- **R2c** — `POST /api/razorpay/checkout` — create Razorpay Subscription, return subscription_id
- **R2d** — Frontend Razorpay Checkout modal integration
- **R2e** — `POST /api/razorpay/webhook` — handle 6 subscription events + payment.failed (subscription.activated/charged/cancelled/paused/resumed + payment.failed)
- **R2f** — `/settings/billing` — current plan, charge history, cancel button
- **R2g** — Feature-gate middleware (CA Portal routes reject free-tier with 402)
- **R2h** — `scripts/create-razorpay-plans.mjs` — one-time seeder for CA Portal + Business plans (test mode)
- **R2i** — Tests: webhook signature, idempotent event processing, state-machine transitions, feature-gate enforcement
- **R2j** — Playwright E2E: subscribe → validate DB → cancel → re-subscribe
- **R2k** — Reframe KhataGO case study on `/portfolio/khatago` to highlight the live Razorpay pipeline

**Phase 3 — EduScale tournament entry fees** (blocks on Phase 2 pattern, ~4-5 days Claude):

- **R3a** — Prisma migrations: `Tournament.entryFee` + `TournamentEntry { userId, tournamentId, razorpayOrderId, status }`
- **R3b** — `POST /api/tournaments/:id/enter` — create Razorpay Order + pending TournamentEntry
- **R3c** — Tournament UI — "Enter (₹99)" button opens Razorpay Checkout.js modal
- **R3d** — `POST /api/razorpay/webhook` — shares handler with KhataGO (order.paid, payment.captured, payment.failed, refund.processed)
- **R3e** — Admin cancel flow → issues Razorpay refunds for all paid entries
- **R3f** — Prometheus metrics: entry count, revenue, failure rate
- **R3g** — Access gate: can't join battle without paid entry
- **R3h** — Tests + Playwright E2E: order creation + payment capture → entry paid + refund flow
- **R3i** — EduScale case study: add "Tournament billing" subsection in architecture + new incident about webhook-race conditions

## Other items added this turn (2026-04-19)

- **N1 — Fix `/statistics` dark theme axe violation** — 3 svg-img-alt nodes (likely recharts). Add `<title>` child or `aria-label` to chart SVGs. *~30 min*
- **N3 — stripe-payments-demo fixture replay endpoint** — `scripts/replay-webhook.mjs` generates a signed fake Stripe event and posts to `/api/webhook` locally. Makes the idempotency demo reproducible without a Stripe account. *~60 min*

## Tier 4 — target-company-specific demos (Month 3 territory)

- **5A — Stripe: SCA / 3DS demo** in `stripe-payments-demo` — `requires_action` → `confirmCardPayment` → webhook reconciliation with the state machine documented on the case-study page. Bonus: dispute/refund flow.
- **5B — Vercel: edge-runtime demo** — `/api/geolocate` on edge with Upstash-backed rate limiter; cold-start comparison vs Node lambda; new portfolio card.
- **5C — Supabase: RLS + Realtime-presence + pgvector** — extend DevTrack with RLS policies (documented SQL on the case-study page) + Realtime presence ("who's viewing this dashboard") + pgvector semantic search of commits.
- **5D — Lighthouse CI in GitHub Actions** — ✅ Wired; ship 3C + 3D to complete it.
- **5E — Stripe → KhataGO subscription billing integration** (IF user picks Hybrid/Option B in MANUAL §3): `/api/stripe/webhook` with SETNX idempotency, `BillingAccount` Prisma model, `/pricing` page, Stripe Checkout. Archive `stripe-payments-demo` (or keep as pattern ref). *~1 week*

---

## Tier 5 — cross-project standards

- **6A — Add `@axe-core/playwright` to devtrack e2e** (matches KhataGO + EduScale). *~90 min*
- **6B — Bootstrap Vitest in devtrack** + test the 5 highest-risk API routes + streak calculation. *~90 min*
- **6C — Expand KhataGO unit tests** for money/date/duplicate-detection utilities. Target 40% `lib/` coverage. *~3 h*
- **6D — KhataGO i18n render tests** — for each of en/hi/gu, assert a known translated string renders post-switch (e.g. `दैनिक` for Hindi dashboard). *~90 min*
- **6E — EduScale/Frontend Jest bootstrap** + Redux slice tests (auth, toast, user). *~3 h*
- **6F — Add `eslint-plugin-security` across 4 projects** with the low-false-positive rule set. *~2 h total*
- **6G — Enable Dependabot** in every repo (weekly, group minor/patch). devtrack + KhataGO have no `.github/` today. *~1 h total*
- **6H — devtrack `.github/workflows/ci.yml`** — type-check + lint + Playwright smoke. Currently no CI at all. *~1 h*

---

## Done this sprint (2026-04-19, in order)

Documentation:

- ✅ Updated portfolio_next/CLAUDE.md with current architecture + gotchas + owner context
- ✅ Created CLAUDE.md for KhataGO + stripe-payments-demo + redis-battle-demo + CareerGlyph + CodeSenseiSearch
- ✅ Rewrote MANUAL.md tight (12 items, P0-P2) and moved prep work to TODO §1A-1E
- ✅ `/tmp/test-coverage-audit.md` — 20-item prioritized list across 4 projects
- ✅ `/tmp/ui-ux-audit.md` — Playwright-driven UI/UX audit (see file for findings)

Infrastructure:

- ✅ Portfolio build fix (PortfolioSkeleton.tsx missing `"use client"` — framer-motion crashed SSG)
- ✅ Supabase keepalive migrated from GitHub Actions to per-project Vercel crons (KhataGO/DevTrack/EduScale-Frontend)
- ✅ EduScale Backend Redis keepalive via Vercel cron on `/api/v1/health`
- ✅ redis-battle-demo deployed to Render; URL added to portfolio + health check
- ✅ URL health check GitHub Action (daily, 5 URLs)
- ✅ Lint/build/format/type-check green across all 9 repos
- ✅ `npm audit fix` (10/21 vulns cleared)

Portfolio code:

- ✅ `/blogs` SSR fix — renders 27 post links in initial HTML
- ✅ `/statistics` SSR fix — real numbers in initial HTML + 10s upstream timeout + snapshot fallback
- ✅ Hero rewritten with Draft B (full-stack with backend focus) + honest work history (no fake PR counts)
- ✅ "Things I'm building to learn" home strip with honest side-project framing
- ✅ `components/Showcase/StripeCaseStudy.tsx` — SVG sequence diagram + Redis before/after + 4xx-retry-trap
- ✅ KhataGO case study reframed as "reconciliation pipeline"
- ✅ `/api/contact` route — Resend + Zod + rate-limit + mailto fallback (+5 tests)
- ✅ Broken-links + console-error E2E gate (11 pages × 0 errors)
- ✅ KhataGO AI chat fix (Gemini model + fail-loud config)
- ✅ EduScale middleware fast-path (fixes 504 MIDDLEWARE_INVOCATION_TIMEOUT on cold Supabase)
- ✅ stripe-payments-demo → Next.js App Router port (29/29 tests preserved)

---

## Quick Reference: Project → Target Company

| Project              | Primary signal                           | Target           |
| -------------------- | ---------------------------------------- | ---------------- |
| EduScale             | Distributed systems (Redlock, Redis, CB) | All              |
| redis-battle-demo    | Distributed-lock visualization + metrics | Stripe, Vercel   |
| stripe-payments-demo | Correctness: idempotency, deduplication  | Stripe           |
| KhataGO              | Reconciliation pipeline + AI tool-use    | Stripe           |
| CareerGlyph          | NestJS API + auth + RBAC + test suite    | Supabase, Vercel |
| CodeSensei Search    | pgvector semantic search, AI pipelines   | Supabase         |
| DevTrack             | Supabase Realtime + analytics            | Supabase, Vercel |
| portfolio itself     | Next.js depth: SEO, SSR, a11y, perf      | Vercel           |

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
