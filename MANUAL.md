# MANUAL.md — Tasks Requiring Your Action (3-Month Plan)

All tasks here require your credentials, accounts, original writing, or external actions.
Nothing here can be done by code alone.

See TODO.md for all code-executable tasks.
See PLAN.md for the strategic context behind each task.

---

## What Was Automated in This Session

- `dangerouslySetInnerHTML` removed from ExperienceSection — plain text + structured highlights
- EduScale project card: real architecture (@socket.io/redis-adapter, redlock, opossum, prom-client, Bull)
- CodeSenseiSearch project card added (NestJS + pgvector + embeddings)
- KhataGO GitHub link removed (private repo); challengesSolved updated with specific technical detail
- ContextQA cards: ~1,600 / ~1,900 merged PR counts added
- llms.txt + llms-full.txt fully rewritten with accurate technical depth; redis-battle-demo and CareerGlyph sections added
- robots.ts added (serves /robots.txt)
- sitemap.ts verified correct
- RSS feed: /feed.xml (RSS 2.0, all blog posts sorted by date)
- Dynamic OG images: /api/og?title=...&type=blog (edge runtime, next/og)
- Blog post metadata updated to use dynamic OG images
- Blog MDX migration: 17 `.mdx` files under `content/blog/`, `lib/blog-data.ts` reduced to 135-line thin index
- Blog search by URL query (`?q=` and `?tag=`), reading progress bar, Lighthouse CI workflow
- redis-battle-demo scaffolded at `~/Desktop/Coding/redis-battle-demo`
- CareerGlyph backend scaffolded at `~/Desktop/Coding/careerglyph` (Prisma schema, PrismaService, GET /profile/:username)
- Bundle analysis: yup (195 kB) removed, replaced with react-hook-form built-in rules
- `npm run analyze` script added to package.json
- Route-level error boundary (app/error.tsx) and global error boundary (app/global-error.tsx) added
- framer-motion containerVariants moved to module scope in AboutContent.tsx (fixes re-animation bug)
- All 42 Playwright screenshots regenerated; 22/22 E2E tests passing

---

## What Was Already Done (No Action Needed)

- Education section wired into About page
- All robotic language removed from portfolio pages
- Hire Me added to navbar
- Schema.org structured data on all 7 pages
- `llms.txt` + `llms-full.txt` for AI crawlers
- GA script wired to env var (fires only when set)
- 48 unit tests + 34 E2E tests passing
- 42 full-page Playwright screenshots
- Portfolio fake loading delay removed
- Contact form builds real `mailto:` URLs
- About page shows all sections by default
- Skip-to-main link + focus-visible indicators (WCAG AA)
- Navbar ARIA labels
- 5.7MB of dead images removed
- Source maps disabled in production
- AVIF + WebP image formats enabled
- Google Search Console verified and live
- `CLAUDE.md` created with full project documentation

---

## Month 1: April 16 – May 16, 2026

### 0. Add CodeSenseiSearch Screenshot — 15 min

The CodeSenseiSearch project card is live on the portfolio but uses a placeholder image. Once you've run the project locally and have a browser open to the search UI or API response, take a screenshot:

1. Run CodeSenseiSearch locally (`npm run start` or equivalent)
2. Make a sample search query — screenshot the results
3. Save as `public/Images/codesensei-search.png`
4. Tell Claude to update `constants/projects.ts` → `id: "codesensei-search"` → `image: "/Images/codesensei-search.png"`

---

### 1. Make KhataGO Repo Public — 30 min

The KhataGO GitHub link on your portfolio currently 404s. Every recruiter who clicks it sees a dead link. This is the fastest credibility fix available.

Steps:

1. Go to `https://github.com/Shailesh93602/khatago`
2. Settings → Danger Zone → Change visibility → Public
3. Before making it public, verify there are no secrets committed (`.env` files, API keys in history). Run: `git log --all --full-history -- .env` and `git grep -i "api_key\|secret\|password"` in the repo
4. After making it public, come back and tell Claude — the README overhaul (TODO.md §1E) can then be executed

**Why this matters for Skydo**: Skydo is fintech. KhataGO is your only fintech project. A dead GitHub link is a rejection signal.

---

### 2. Google Analytics Setup — 30 min

The GA script is already in the codebase waiting for a Measurement ID. You just need to create the property.

Steps:

1. Go to `https://analytics.google.com`
2. Create Account → Property → Data Stream → Web → `https://shaileshchaudhari.vercel.app`
3. Copy the Measurement ID (`G-XXXXXXXXXX`)
4. Vercel Dashboard → your project → Settings → Environment Variables
5. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (all environments: Production, Preview, Development)
6. Redeploy (push any trivial commit, or trigger manual redeploy in Vercel dashboard)

**Why this matters**: Vercel and Supabase engineering managers look at whether you instrument your own products. It's a signal you think about observability.

---

### 3. Verify Live Project URLs — 15 min

Free-tier Supabase pauses after 7 days of inactivity. Check before any recruiter visit.

| Project  | URL                                  | Fix if down                          |
| -------- | ------------------------------------ | ------------------------------------ |
| EduScale | `https://eduscale.vercel.app`        | Supabase dashboard → Restore project |
| DevTrack | `https://daily-dev-track.vercel.app` | Supabase dashboard → Restore project |
| KhataGO  | `https://khatago.vercel.app`         | Supabase dashboard → Restore project |

Do this before applying to any company. Set a calendar reminder to check every 2 weeks.

---

### 4. Write EduScale Architecture Blog Post — 6 hrs (highest ROI task in all 3 months)

This single post does more for your Supabase/Vercel profile than everything else combined. No recruiter at those companies reads "Redis pub/sub" and gets excited. They read "here's why I chose `@socket.io/redis-adapter` over raw pub/sub, the race condition it solved, and what broke in production."

**Proposed title**: "Building Real-Time Coding Battles: Redis Cluster + Distributed Locks at Sub-200ms"

Structure that works:

1. The problem (why polling was wrong, what "real-time" actually means in a competitive coding context)
2. The socket architecture (Socket.io rooms, reconnect logic, why you need the Redis adapter for horizontal scaling)
3. The race condition (two users simultaneously starting the same battle — what breaks without a lock)
4. Redlock solution (the algorithm, the specific config, why `redlock` over `SET NX EX`)
5. The circuit breaker (what external service it wraps, `opossum` config, what the fallback does)
6. What broke in production (be honest — this makes it credible and shows systems thinking)
7. What you'd do differently (Redis Streams vs pub/sub? Why or why not?)

After writing, Claude can add it to `lib/blog-data.ts` and `data/blog-manifest.json` — just paste the content.

**Do not use ChatGPT to write this.** Interviewers recognize AI-generated technical posts. The value of this post is your specific production decisions and mistakes.

---

## Month 2: May 16 – June 16, 2026

### 5. Make One OSS Contribution — Target: 1 merged PR

The "0 OSS merged PRs" gap is visible on your GitHub profile. One merged PR to a project used by Vercel/Supabase/Stripe engineers changes the conversation from "claims to be senior" to "ships in shared codebases."

**Best targets (in order):**

1. **shadcn/ui** (`shadcn-ui/ui`)
   - Look for: missing ARIA attributes on existing components, TypeScript type improvements, documentation fixes in `apps/www/content/docs/`
   - Low bar for first PR: docs fix or example improvement
   - High bar: accessibility fix to an existing component (guaranteed merge if correct)

2. **Supabase JS** (`supabase/supabase-js`)
   - Look for: TypeScript generics improvements, missing error handling in edge cases
   - Good signal for Supabase specifically

3. **Prisma** (`prisma/prisma`)
   - Look for: documentation improvements, example queries in `docs/`
   - Higher bar for code changes

Process that works:

1. Run the project locally (this alone eliminates most contributors)
2. Find a failing test, a missing type, or a documentation gap
3. Fix it with the smallest possible change
4. PR description: explain what was broken, why your fix is correct, link to the relevant code path

**Do not open a PR for whitespace fixes or renaming.** Maintainers reject these and it looks worse than no contribution.

---

### 6. Write Postgres/RBAC Deep Dive Post — 4 hrs

**Proposed title**: "Role-Based Access Control in Postgres: How EduScale Manages Permissions Without Code Changes"

This addresses the "no Postgres depth" gap that matters for Supabase.

Structure:

1. The requirement (students, teachers, admins — different permissions per feature per plan tier)
2. The schema: `Role`, `Permission`, `Feature`, `RolePermission` join table
3. Why not just `if (user.role === 'admin')` in code (it doesn't scale, it breaks at edge cases)
4. The Postgres query that checks permission in one round trip
5. Row Level Security as an alternative (pros/cons vs application-level checks)
6. What you'd do differently for a multi-tenant SaaS

After writing, Claude can add it to `lib/blog-data.ts` and wire it in.

---

### 7. Write KhataGO Fintech Correctness Post — 4 hrs

**Proposed title**: "Why WhatsApp Webhooks Need Deduplication: Building KhataGO's Receipt Pipeline"

This addresses the "no fintech depth" gap that matters for Skydo and Stripe.

Structure:

1. The webhook problem (Meta sends the same event multiple times — why and how often)
2. Your deduplication implementation (the message ID hash, the Redis TTL window)
3. The OCR pipeline (image → Gemini → structured JSON → ledger entry — what can go wrong at each step)
4. Why Tally XML is non-trivial (the date format, ledger name lookup, GST fields)
5. What idempotency means in a receipt processing pipeline
6. What you'd handle differently at 10x scale

After writing, Claude can add it to `lib/blog-data.ts`.

---

## Month 3: June 16 – July 16, 2026

### 8. Update Resume PDF — 30 min

The portfolio links to `/Shailesh_Chaudhari_Resume.pdf`. If you've updated experience descriptions (EduScale architecture, ContextQA PR counts, KhataGO tech stack) or skills since the last version, the PDF is now stale.

Steps:
1. Open your current resume in Google Docs / Overleaf / whatever you use
2. Update to match what's in the portfolio: `@socket.io/redis-adapter`, `redlock`, `opossum`, ContextQA ~1,900 / ~1,600 merged PRs, KhataGO (WhatsApp Business API, Gemini AI OCR, Tally XML)
3. Export as PDF — **filename must stay exactly `Shailesh_Chaudhari_Resume.pdf`** (all existing hire-page links point to it)
4. Replace `public/Shailesh_Chaudhari_Resume.pdf` with the new file
5. `git add public/Shailesh_Chaudhari_Resume.pdf && git commit -m "docs: update resume PDF"` then push

**Filename must not change** — the hire page hardlinks to `/Shailesh_Chaudhari_Resume.pdf`.

---

### 9. Apply to Skydo — Highest probability this month

Skydo is fintech, full-stack, India-based, and values third-party API integration depth. KhataGO (once public with a good README) is a direct match for what they're looking for.

Preparation before applying:

- KhataGO GitHub must be public (Task 1)
- KhataGO README must document webhook + OCR + Tally (TODO.md §1E)
- KhataGO fintech post must be published (Task 7)
- All three live project URLs must be working (Task 3)

Application materials:

- Lead with KhataGO (WhatsApp Business API, Gemini AI OCR, Tally XML) — this is exactly what Skydo does
- Mention EduScale architecture depth (Redis cluster adapter, distributed locks)
- Reference the fintech post as evidence of your thinking

---

### 10. LinkedIn Profile Update — 2 hrs

Current LinkedIn likely doesn't reflect the EduScale architecture depth or KhataGO's real technical stack. Recruiters check LinkedIn before GitHub.

Specific updates needed:

1. ContextQA role description: add "~1,900 merged PRs on Vibe Testing Chrome extension" and "~1,600 merged PRs on AxeTos accessibility extension"
2. EduScale description: add `@socket.io/redis-adapter`, `redlock`, `opossum`, `prom-client`, `bull`
3. KhataGO description: add WhatsApp Business API, Gemini AI OCR, Tally ERP XML export
4. Add CodeSenseiSearch as a project (once publicly visible on portfolio)
5. Add the EduScale architecture post as a "featured" article once published
6. Skills section: add "Redis (Cluster, Pub/Sub, Lua scripting)", "Socket.io", "Prometheus", "Circuit Breaker Pattern"

---

### 11. Apply to Vercel — After OSS contribution is merged

Do not apply to Vercel without at least one merged OSS PR. Their hiring bar explicitly filters for engineers who ship in shared codebases.

Before applying:

- OSS PR must be merged (Task 5)
- EduScale architecture post must be published (Task 4)
- Vercel/performance post (see below) must be published
- Bundle analysis and fix must be done (TODO.md §3A)

**Vercel/performance post**: "ISR vs Edge Caching: What I Measured Building a Next.js Portfolio"

Topics: `ANALYZE=true npm run build` findings, AVIF vs WebP measured savings, ISR revalidation strategy, what Lighthouse caught that bundle analysis missed.

---

### 12. Apply to Supabase — After Postgres depth is demonstrated

Before applying:

- Postgres/RBAC post must be published (Task 6)
- EduScale architecture post must be published (Task 4)
- LinkedIn skills updated to include Postgres-specific depth

Supabase specifically looks for: Postgres RLS, indexes, query explain plans, OSS mindset. Your RBAC post covers the first. Reference it explicitly in the application.

---

### 13. Apply to Stripe — Stretch goal (requires correctness post)

Stripe rejects on the first sign of sloppy thinking about correctness. Before applying:

- Remove `dangerouslySetInnerHTML` from `components/ExperienceSection/index.tsx` (Claude can do this — it's a sanitization issue, not a manual task, but you need to approve the DOMPurify approach)
- KhataGO fintech correctness post must be published (Task 7)
- Be ready to talk about idempotency, webhook deduplication, and what happens when a payment fails halfway through

---

## Priority Order (Consolidated)

| When               | Task                             | Time    | Why                                                    |
| ------------------ | -------------------------------- | ------- | ------------------------------------------------------ |
| Week 1 (Apr 16-22) | Make KhataGO public              | 30 min  | Fixes the dead GitHub link immediately                 |
| Week 1             | Verify 3 live URLs               | 15 min  | Don't let recruiters hit paused DBs                    |
| Week 1             | Google Analytics setup           | 30 min  | Shows you instrument your own products                 |
| Month 1            | Write EduScale architecture post | 6 hrs   | Highest ROI task in the entire plan                    |
| Month 2            | Get one OSS PR merged            | Ongoing | Required for Vercel; improves all profiles             |
| Month 2            | Write Postgres/RBAC post         | 4 hrs   | Required for Supabase                                  |
| Month 2            | Write KhataGO fintech post       | 4 hrs   | Required for Skydo/Stripe                              |
| Month 3            | Update resume PDF                | 30 min  | Portfolio and resume must match the new tech depth     |
| Month 3            | Apply to Skydo                   | 2 hrs   | Highest probability conversion this month              |
| Month 3            | Update LinkedIn                  | 2 hrs   | Recruiters check before GitHub                         |
| Month 3            | Write Vercel/performance post    | 3 hrs   | Required before Vercel application                     |
| Month 3            | Apply to Vercel                  | 2 hrs   | After OSS PR is merged                                 |
| Month 3            | Apply to Supabase                | 2 hrs   | After Postgres post is published                       |
| Stretch            | Apply to Stripe                  | 2 hrs   | After correctness post + `dangerouslySetInnerHTML` fix |
