# 3-Month Plan — Shailesh Chaudhari
**Goal:** Get selected at Vercel, Supabase, Skydo, Stripe, or equivalent companies
**Period:** April 2026 – July 2026
**Current state:** Strong technical ability, poor visibility. The code is there; the presentation isn't.

---

## The Core Problem (Honest Assessment)

Your actual technical stack is production-grade:
- EduScale backend uses `@socket.io/redis-adapter`, `redlock` (distributed locks), `opossum` (circuit breaker), `prom-client` (Prometheus metrics), `bull` queues, `winston` structured logging — **none of this is mentioned anywhere on your portfolio**
- KhataGO has a real WhatsApp Business API webhook, Gemini AI OCR for receipt photos, Tally ERP XML export — **the repo is private and the portfolio description says nothing specific**
- CodeSenseiSearch is a full NestJS + vector embeddings AI search engine — **not on the portfolio at all**
- ContextQA repos have 1,600–1,900 merged PRs — **you describe this as "built Chrome extensions"**

The gap is entirely presentation. Every item in this plan is about making what already exists visible.

---

## Target Companies and What They Each Look For

| Company | Primary Signal They Want | Your Current Gap |
|---|---|---|
| **Vercel** | Next.js internals, OSS contribution, DX thinking | No OSS PR, no depth post on Next.js |
| **Supabase** | Postgres depth (RLS, indexes, query tuning), OSS mindset | No evidence of Postgres beyond basic CRUD |
| **Stripe** | Correctness-first thinking, idempotency, edge cases | No financial systems post, `dangerouslySetInnerHTML` in code |
| **Skydo** | Full-stack fintech, third-party API integration | KhataGO shows this but is hidden behind a 404 GitHub link |
| **Early-stage startups** | Ships fast, writes tests, understands real-time systems | Already strong here |

---

## Month 1: Fix What's Broken, Reveal What's Hidden
**April 16 – May 16, 2026**
**Goal:** Every recruiter who visits the portfolio sees the real technical depth in under 60 seconds.

### Phase 1A — Portfolio Content Overhaul (Automatable — see TODO.md)
- Rewrite EduScale project card with real architecture (Redis adapter, Redlock, circuit breaker, Prometheus)
- Add CodeSenseiSearch as a new project card
- Fix KhataGO card: remove dead GitHub link → label as "private repo", update description with WhatsApp API + Tally XML details
- Update `llms.txt` and `llms-full.txt` to reflect real project inventory
- Migrate `blog-data.ts` (10,078 lines) → MDX files. One `.mdx` per post in `/content/blog/`
- Add dynamic OpenGraph images per blog post (`/api/og` route)
- Add RSS feed (`/feed.xml`)

### Phase 1B — EduScale README (Automatable)
- Add ASCII architecture diagram: Client → Socket.io → Redis Adapter → Bull Queue → Postgres
- Document the distributed lock usage (what race condition it prevents, how Redlock solves it)
- Document the circuit breaker (what service it wraps, what happens when it trips)
- Add a "Running locally" section that actually works
- Add Prometheus metrics screenshot description (the metrics endpoint exists, document it)

### Phase 1C — KhataGO README (Automatable)
- Document the WhatsApp webhook flow (Meta verification, deduplication logic)
- Document the Gemini AI OCR pipeline (how a receipt image becomes a transaction)
- Document the Tally XML export format (what fields, why it's non-trivial)

### Phase 1D — Manual writing (see MANUAL.md)
- **Make KhataGO repo public** (30 min)
- **Write EduScale battle zone post** (6 hrs) — the single highest-ROI task in all 3 months

---

## Month 2: Build Depth Signals
**May 16 – June 16, 2026**
**Goal:** Have at least one OSS contribution and two technical posts that demonstrate you understand systems, not just APIs.

### Phase 2A — Portfolio Features (Automatable)
- Refactor `app/api/statistics/route.ts` (1,133 lines) into `lib/github-service.ts` + `lib/leetcode-service.ts`
- Add blog post reading progress bar
- Add URL-based blog search (`/blogs?q=redis`)
- Add Lighthouse CI to GitHub Actions
- Build `redis-battle-demo` — a minimal standalone repo showing the EduScale battle engine: Redis adapter + Socket.io + Redlock in ~300 lines, runnable with one `docker compose up`. This is the reference implementation for the blog post and interview questions.

### Phase 2B — Manual (see MANUAL.md)
- **One merged OSS PR** (primary target: shadcn/ui, Supabase JS, or Prisma)
- **Write Postgres/RBAC post** using EduScale's Role/Permission/Feature/RolePermission schema
- **Write KhataGO fintech correctness post** (idempotency, webhook deduplication, Tally XML strictness)

---

## Month 3: Company-Specific Preparation
**June 16 – July 16, 2026**
**Goal:** Be ready to answer every question about every project with specific numbers and architecture decisions. Have presence on the platforms each company monitors.

### Phase 3A — Technical Polish (Automatable)
- Bundle analysis: run `ANALYZE=true npm run build`, document findings, fix the worst offender
- Scaffold CareerGlyph MVP backend (the concept: dynamic, verifiable developer profiles is directly relevant to Vercel/GitHub)
- Update resume PDF content (if data has changed)
- Regenerate all 42 Playwright screenshots showing current state
- Full test pass: all 48 unit + 22 E2E tests green

### Phase 3B — Manual (see MANUAL.md)
- **Write Vercel/performance post** using EduScale frontend or portfolio site: bundle analysis, ISR, edge caching
- **Apply to Skydo first** (highest probability of converting this month)
- **LinkedIn profile update** to match portfolio depth
- **Google Analytics setup** on portfolio + EduScale

---

## Success Metrics at End of Month 3

| Metric | Current | Target |
|---|---|---|
| GitHub followers | 10 | 50+ (organic from posts + OSS) |
| OSS merged PRs | 0 | 1+ |
| Deep technical posts | 0 | 3+ |
| Portfolio project cards | 5 | 6+ (CodeSenseiSearch added) |
| KhataGO GitHub | 404 | Public with full README |
| Blog architecture | 10,078-line .ts file | MDX files, one per post |
| Companies applied to | 0 | Skydo + 2 others |

---

## Project Inventory Reference

| Project | Status | Public | Live | Portfolio |
|---|---|---|---|---|
| EduScale (Frontend + Backend) | Active | ✅ | ✅ | ✅ (description wrong) |
| KhataGO | Active | ❌ Private | ✅ | ✅ (GitHub 404) |
| DevTrack | Stable | ✅ | ✅ | ✅ |
| Vibe Testing (ContextQA) | Work | ❌ | No demo | ✅ |
| AxeTos (ContextQA) | Work | ❌ | No demo | ✅ |
| CodeSenseiSearch | Phase 7 done | ✅ | ❌ | ❌ **MISSING** |
| CareerGlyph | Initial setup | ✅ | ❌ | ❌ Not ready |
| MrEngineer | Partial | Private | ❌ | ❌ Redundant with EduScale |
| redis-battle-demo | Not built | — | — | Planned Month 2 |

---

## The Single Most Important Insight

Your EduScale backend uses `@socket.io/redis-adapter` (Redis cluster), `redlock` (distributed locking), `opossum` (circuit breaker), and `prom-client` (Prometheus). These are the exact patterns a Supabase or Vercel engineer uses daily. The gap is that no one can see them because:

1. The portfolio description says "Redis pub/sub" (vague and incorrect)
2. The README doesn't explain the architecture
3. There's no blog post walking through the implementation

One session fixing (1) and one post fixing (3) will change how every engineering recruiter at those companies reads your profile.
