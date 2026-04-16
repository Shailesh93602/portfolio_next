# TODO.md — Code-Executable Tasks (3-Month Plan)

All tasks here can be done with code, terminal commands, or file edits.
Organized by month. Each item has an estimated effort (S = <1 hr, M = 1-3 hrs, L = 3-6 hrs).

See PLAN.md for context on why each task matters.
See MANUAL.md for tasks that require your credentials or writing.

---

## Month 1 — April 16 to May 16, 2026

### 1A — Portfolio Project Card Overhaul

- [ ] **Rewrite EduScale card description** [S]
  - File: `constants/projects.ts`
  - Replace "Redis pub/sub" with accurate: `@socket.io/redis-adapter` (Redis cluster adapter), `redlock` (distributed locks), `opossum` (circuit breaker), `prom-client` (Prometheus metrics), `bull` queues, `winston` structured logging
  - Add these as tech tags on the card
  - Update the "highlights" or bullet points to name the specific patterns, not just "real-time"

- [ ] **Add CodeSenseiSearch project card** [S]
  - File: `constants/projects.ts`
  - Title: CodeSenseiSearch
  - Stack: NestJS, TypeScript, vector embeddings, semantic search, PostgreSQL
  - Description: AI-powered semantic code search engine using vector embeddings. Indexes codebases and answers natural-language queries against them. Phase 7 (full search pipeline) complete.
  - GitHub link: `https://github.com/Shailesh93602/CodeSenseiSearch`
  - Mark as "no live demo" (honest)

- [ ] **Fix KhataGO card** [S]
  - File: `constants/projects.ts`
  - Remove or label GitHub link as "(private repo)" — it currently 404s
  - Rewrite description: WhatsApp Business API webhook for invoice capture, Gemini AI OCR for receipt photos → structured transactions, Tally ERP XML export
  - Add tech tags: WhatsApp Business API, Gemini AI, OCR, Tally XML, Supabase

- [ ] **Update ContextQA project descriptions** [S]
  - File: `constants/projects.ts`
  - Vibe Testing: change from "built Chrome extension" to "Chrome extension with ~1,900 merged PRs; automated E2E test recorder with DOM diffing"
  - AxeTos: change from "built Chrome extension" to "Chrome extension with ~1,600 merged PRs; automated WCAG accessibility auditing with violation tracking"

### 1B — AI Crawler Files

- [ ] **Update `public/llms.txt`** [S]
  - Add CodeSenseiSearch to project inventory
  - Update EduScale description with real architecture
  - Update KhataGO description with WhatsApp + Gemini + Tally
  - Update ContextQA impact numbers (PRs merged)

- [ ] **Update `public/llms-full.txt`** [S]
  - Same updates as llms.txt, with full detail sections
  - Add CodeSenseiSearch full technical section
  - Add EduScale architecture section (Redis cluster adapter, Redlock algorithm, circuit breaker pattern, Prometheus metrics endpoint)
  - Add KhataGO architecture section (webhook flow, OCR pipeline, XML export format)

### 1C — Blog Infrastructure

- [ ] **Migrate `lib/blog-data.ts` → MDX files** [L]
  - Install: `@next/mdx`, `@mdx-js/react`, `remark-gfm`, `rehype-highlight` (or `rehype-pretty-code`)
  - Create `/content/blog/` directory
  - Write a script (`scripts/migrate-blog.ts`) that reads each post from `blog-data.ts` and writes `content/blog/<slug>.mdx`
  - Update `app/blog/[slug]/page.tsx` to read from MDX files instead of `blog-data.ts`
  - Keep `lib/blog-data.ts` as a thin index (title, slug, date, description) for listing pages
  - Keep `data/blog-manifest.json` in sync

- [ ] **Add dynamic OpenGraph images per blog post** [M]
  - Create `app/api/og/route.tsx` using `@vercel/og` (ImageResponse)
  - Design: blog title + site name + author, dark background, text truncation at 70 chars
  - Update each blog post's metadata to reference `api/og?title=<encoded-title>`
  - Add a generic fallback OG image for non-blog pages

- [ ] **Add RSS feed** [S]
  - Create `app/feed.xml/route.ts` that generates RSS 2.0 XML from `lib/blog-data.ts`
  - Include: title, link, description, pubDate, guid for each post
  - Add `<link rel="alternate" type="application/rss+xml">` to `app/layout.tsx`

### 1D — EduScale README (run in the EduScale repo)

- [ ] **Add ASCII architecture diagram** [S]
  - Format: `Client → Socket.io → @socket.io/redis-adapter → Redis Cluster → Bull Queue → Worker → Postgres`
  - Add a second diagram for the battle flow: `Client A joins room → Redlock acquires lock → battle state write → lock released → Redis pub/sub notifies Client B`

- [ ] **Document distributed lock usage** [S]
  - What race condition it prevents (two users simultaneously starting the same battle)
  - The specific Redlock configuration (retry count, retry delay)
  - What happens when the lock times out

- [ ] **Document circuit breaker** [S]
  - Which service it wraps (external AI judging API or similar)
  - `opossum` config (timeout, errorThresholdPercentage, resetTimeout)
  - What the fallback behavior is when the breaker is open

- [ ] **Document Prometheus metrics endpoint** [S]
  - The `/metrics` path
  - What metrics are exposed (active battles, queue depth, request latency)
  - Screenshot or text output of a sample scrape

- [ ] **Add working "Running locally" section** [S]
  - Prerequisites: Node 18+, Redis (via Docker), Postgres
  - `docker compose up -d` command
  - Environment variable table with descriptions

### 1E — KhataGO README (run in the KhataGO repo)

- [ ] **Document WhatsApp webhook flow** [S]
  - Meta webhook verification challenge (GET handler)
  - Deduplication logic (how duplicate message events are dropped)
  - Message types handled (text, image, document)

- [ ] **Document Gemini AI OCR pipeline** [S]
  - Step 1: incoming WhatsApp image URL → download to buffer
  - Step 2: buffer → Gemini Vision API → structured JSON (merchant, amount, date, items)
  - Step 3: JSON → database transaction record
  - Error handling when OCR confidence is low

- [ ] **Document Tally XML export** [S]
  - The specific Tally XML schema used (TallyMessage > TALLYMESSAGE > VOUCHER)
  - Why it's non-trivial (date format, ledger mapping, GST fields)
  - Sample export snippet showing the structure

---

## Month 2 — May 16 to June 16, 2026

### 2A — Statistics API Refactor

- [ ] **Refactor `app/api/statistics/route.ts`** [M]
  - Current: 1,133 lines, everything in one file
  - Extract `lib/github-service.ts`: all GitHub API calls (repos, commits, contribution data, language stats)
  - Extract `lib/leetcode-service.ts`: all LeetCode scraping/API calls
  - `route.ts` becomes orchestrator: calls both services, merges results, returns JSON
  - Add JSDoc to the service interfaces (the public types, not implementation details)
  - Add unit tests for each service in `__tests__/github-service.test.ts` and `__tests__/leetcode-service.test.ts`

### 2B — Portfolio Feature Additions

- [ ] **Add blog search by URL query** [M]
  - Route: `/blogs?q=redis` filters the blog list
  - Implementation: read `searchParams` in `app/blogs/page.tsx` (server component)
  - Client filter: case-insensitive match on title + description + tags
  - Add a search input that pushes to `router.push('/blogs?q=<value>')` on change (debounced 300ms)
  - Update E2E test in `e2e/navigation.spec.ts`: verify search input is present

- [ ] **Add reading progress bar to blog posts** [S]
  - Create `components/ReadingProgressBar.tsx` — a thin fixed bar at top of page
  - `useEffect` + `scroll` event: `(scrollY / (docHeight - windowHeight)) * 100`
  - Use CSS `transform: scaleX()` for performance (no layout thrash)
  - Add to `app/blog/[slug]/page.tsx` layout only (not site-wide)

- [ ] **Add Lighthouse CI to GitHub Actions** [S]
  - Create `.github/workflows/lighthouse.yml`
  - Runs on PRs to `main`
  - Steps: `npm ci` → `npm run build` → `npm run start &` → `lhci autorun`
  - `.lighthouserc.js`: assert performance ≥ 90, accessibility ≥ 95, best-practices ≥ 90
  - Upload results to temporary storage (lhci's public storage is fine for now)

### 2C — `redis-battle-demo` Standalone Repo

- [ ] **Scaffold `redis-battle-demo` project** [L]
  - New repo at `~/Desktop/Coding/redis-battle-demo`
  - Goal: minimal, runnable reference implementation of the EduScale battle engine
  - Stack: Node.js, Socket.io, `@socket.io/redis-adapter`, `redlock`, Docker Compose
  - Target: ~300 lines of application code, starts with `docker compose up`
  - Structure:
    ```
    redis-battle-demo/
      docker-compose.yml    # Redis 7 + Node app
      src/
        server.ts           # Socket.io + Redis adapter setup
        battle.ts           # Redlock usage for battle state
        index.ts            # Entry point
      README.md             # Architecture diagram + explanation
    ```
  - Docker Compose: Redis 7 Alpine + Node 20 Alpine, health checks
  - README: ASCII diagram, code walkthrough, "why Redlock?" explanation
  - This repo is the reference implementation for the EduScale blog post

---

## Month 3 — June 16 to July 16, 2026

### 3A — Bundle Analysis and Optimization

- [ ] **Run bundle analysis and document results** [S]
  - Command: `ANALYZE=true npm run build`
  - Identify the largest client-side bundles
  - Document findings in a comment in `next.config.ts`

- [ ] **Fix the worst bundle offender** [M]
  - Likely candidates: framer-motion (tree-shake unused variants), recharts (already dynamic-imported), or a large icon library
  - Apply the fix (dynamic import, modular import path, or replacement with lighter alternative)
  - Re-run `ANALYZE=true npm run build` to verify improvement

- [ ] **Scaffold CareerGlyph MVP backend** [L]
  - New repo at `~/Desktop/Coding/careerglyph`
  - Concept: dynamic, verifiable developer profiles — a GitHub profile card that auto-updates from real activity
  - MVP scope: NestJS API + Postgres schema for developer profiles, skills, and project links
  - Schema: `Developer`, `Skill`, `Project`, `Endorsement` (one-to-many)
  - One working API route: `GET /profile/:username` returns profile JSON
  - README explaining the concept and tech choices
  - This is relevant to Vercel/GitHub conversations: "I'm building the thing that would replace the static PDF resume"

### 3B — Test Suite Maintenance

- [ ] **Regenerate all 42 Playwright screenshots** [S]
  - Command: `npx playwright test e2e/screenshots.spec.ts --project=chromium --workers=1`
  - Requires: `npm run build && npm run start` (production server)
  - Do this whenever major UI changes are made

- [ ] **Ensure all tests pass after Month 1 changes** [S]
  - `npm test` — all 48 unit tests
  - `npm run test:e2e` — all E2E tests
  - Fix any failures introduced by blog MDX migration or new project cards
  - Target: 48+ unit tests, 34+ E2E tests, all green

- [ ] **Add unit tests for new components** [M]
  - `__tests__/ReadingProgressBar.test.tsx` — scroll event handler logic
  - `__tests__/blog-search.test.ts` — URL query parsing and filter logic
  - `__tests__/og-route.test.ts` — OG image route parameter handling
  - Target: 60+ unit tests total

### 3C — SEO and Performance Hardening

- [ ] **Add `sitemap.xml` generation** [S]
  - Create `app/sitemap.ts` (Next.js built-in sitemap generation)
  - Include all static routes + all blog post URLs from `lib/blog-data.ts`
  - Verify it appears at `/sitemap.xml` after deploy

- [ ] **Add `robots.txt`** [S]
  - Create `app/robots.ts` (Next.js built-in robots.txt generation)
  - Allow all crawlers, point to sitemap URL
  - Verify it appears at `/robots.txt` after deploy

- [ ] **Update resume PDF metadata** [S]
  - If resume content has changed (new projects, ContextQA impact numbers), regenerate the PDF
  - Replace `public/Shailesh_Chaudhari_Resume.pdf` with updated version
  - Keep filename identical (all existing links remain valid)

---

## Ongoing / Any Month

- [ ] **Keep E2E tests green after every major change** — run `npm run test:e2e` after any page structure change
- [ ] **Keep unit tests green** — run `npm test` after any utility or component change
- [ ] **Update `CLAUDE.md`** when architecture changes — add new routes, components, or conventions as they're created
- [ ] **Update `data/blog-manifest.json`** when new blog posts are added — run `npm run generate-blog-manifest`

---

## Quick Reference: File Locations for Common Edits

| What to change | File |
|---|---|
| Project card content | `constants/projects.ts` |
| Blog post list | `lib/blog-data.ts` + `data/blog-manifest.json` |
| Social links, email, site URL | `lib/constants.ts` |
| About page bio text | `app/about/AboutContent.tsx` |
| Navigation links | `components/navbar/index.tsx` |
| AI crawler context | `public/llms.txt`, `public/llms-full.txt` |
| Resume PDF | `public/Shailesh_Chaudhari_Resume.pdf` |
| Page metadata | `app/<page>/metadata.ts` |
