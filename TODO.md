# TODO.md — Code-Executable Tasks (3-Month Plan)

All tasks here can be done with code, terminal commands, or file edits.
See PLAN.md for strategic context. See MANUAL.md for tasks requiring credentials or writing.

Legend: ✅ Done  🔲 Pending  🚫 Blocked (needs manual step first)

---

## Month 1 — April 16 to May 16, 2026

### 1A — Portfolio Project Card Overhaul

- ✅ **Rewrite EduScale card** — Added `@socket.io/redis-adapter`, `redlock`, `opossum`, `prom-client`, `Bull` as tech tags and architecture items. `challengesSolved` now names specific libraries and patterns.
- ✅ **Add CodeSenseiSearch project card** — Full card with NestJS, pgvector, embeddings architecture. No live demo (honest). GitHub link included.
- ✅ **Fix KhataGO card** — Removed dead GitHub link (private repo). `challengesSolved` now names webhook deduplication, Gemini OCR pipeline, Tally XML schema specifics.
- ✅ **Update ContextQA descriptions** — Vibe Testing: ~1,900 merged PRs. AxeTos: ~1,600 merged PRs. Both descriptions updated.

### 1B — AI Crawler Files

- ✅ **Update `public/llms.txt`** — CodeSenseiSearch added, EduScale real architecture named, KhataGO marked private repo, ContextQA PR counts added.
- ✅ **Update `public/llms-full.txt`** — Full technical sections for EduScale distributed arch, KhataGO three-layer pipeline, CodeSenseiSearch ingestion+search.

### 1C — Blog Infrastructure

- 🔲 **Migrate `lib/blog-data.ts` → MDX files** [L]
  - Install: `@next/mdx`, `@mdx-js/react`, `remark-gfm`, `rehype-pretty-code`
  - Create `/content/blog/` directory
  - Script: `scripts/migrate-blog.ts` reads each post from `blog-data.ts` and writes `content/blog/<slug>.mdx`
  - Update `app/blog/[slug]/page.tsx` to read MDX
  - Keep `lib/blog-data.ts` as thin index (slug, title, date, description) for listing pages
  - Sync `data/blog-manifest.json`

- ✅ **Add dynamic OpenGraph images** — `app/api/og/route.tsx` (edge runtime, `next/og` ImageResponse). Blog post metadata updated to use `/api/og?title=<encoded>`.

- ✅ **Add RSS feed** — `app/feed.xml/route.ts` (RSS 2.0, sorted by date, XML-escaped, 1-hour cache). Linked from `<head>` in layout.

### 1D — EduScale README *(run in the EduScale repo — needs repo access)*

- 🚫 **Add ASCII architecture diagram** — Blocked until EduScale repo is reviewed locally
- 🚫 **Document distributed lock usage** — Same blocker
- 🚫 **Document circuit breaker** — Same blocker
- 🚫 **Document Prometheus /metrics** — Same blocker
- 🚫 **Add working "Running locally" section** — Same blocker

### 1E — KhataGO README *(blocked: repo is private — see MANUAL.md §1)*

- 🚫 **Document WhatsApp webhook flow** — Blocked until repo is public
- 🚫 **Document Gemini OCR pipeline** — Blocked
- 🚫 **Document Tally XML export** — Blocked

### 1F — Security & Quality Fixes

- ✅ **Remove `dangerouslySetInnerHTML`** from `ExperienceSection` — Replaced HTML-embedded strings with plain text descriptions + structured highlights array.

### 1G — SEO Infrastructure

- ✅ **`app/sitemap.ts`** — Already existed; verified correct (static routes + all blog slugs).
- ✅ **`app/robots.ts`** — Added. Allows all crawlers, points to `/sitemap.xml`.

---

## Month 2 — May 16 to June 16, 2026

### 2A — Statistics API Refactor

- 🔲 **Refactor `app/api/statistics/route.ts`** [M]
  - Current: 1,133 lines, everything in one file
  - Extract `lib/github-service.ts`: all GitHub API calls
  - Extract `lib/leetcode-service.ts`: all LeetCode API calls
  - `route.ts` becomes thin orchestrator
  - Add unit tests: `__tests__/github-service.test.ts`, `__tests__/leetcode-service.test.ts`
  - Target: 60+ unit tests total

### 2B — Portfolio Feature Additions

- 🔲 **Add blog search by URL query** [M]
  - Route: `/blogs?q=redis` filters the blog list client-side
  - Server reads `searchParams`, passes to client component
  - Search input debounced 300ms, pushes to URL
  - E2E test: verify search input is present

- 🔲 **Add reading progress bar to blog posts** [S]
  - `components/ReadingProgressBar.tsx` — fixed bar at top, `transform: scaleX()` for perf
  - `useEffect` + scroll event: `(scrollY / (docHeight - windowHeight)) * 100`
  - Only on `app/blog/[slug]/` layout

- 🔲 **Add Lighthouse CI to GitHub Actions** [S]
  - `.github/workflows/lighthouse.yml`
  - Assert: performance ≥ 90, accessibility ≥ 95, best-practices ≥ 90
  - Runs on PRs to `main`

### 2C — `redis-battle-demo` Standalone Repo

- 🔲 **Scaffold `redis-battle-demo`** [L]
  - New repo at `~/Desktop/Coding/redis-battle-demo`
  - ~300 lines, starts with `docker compose up`
  - Stack: Node.js, Socket.io, `@socket.io/redis-adapter`, `redlock`
  - README with ASCII diagram and Redlock explanation
  - Reference implementation for the EduScale blog post (see MANUAL.md §4)

---

## Month 3 — June 16 to July 16, 2026

### 3A — Bundle Analysis

- 🔲 **Run `ANALYZE=true npm run build`** [S]
  - Identify largest client bundles
  - Document in a comment in `next.config.ts`

- 🔲 **Fix the worst bundle offender** [M]
  - Candidates: framer-motion (tree-shake), icon library (modular imports)
  - Verify improvement by re-running analysis

### 3B — CareerGlyph MVP

- 🔲 **Scaffold CareerGlyph backend** [L]
  - New repo at `~/Desktop/Coding/careerglyph`
  - NestJS + Postgres schema: `Developer`, `Skill`, `Project`, `Endorsement`
  - One working endpoint: `GET /profile/:username`
  - README explaining concept (dynamic verifiable developer profiles)

### 3C — Test Suite Maintenance

- 🔲 **Regenerate all 42 Playwright screenshots** [S]
  - After Month 1 UI changes (project cards, experience section)
  - Command: `npm run build && npm run start` then `npx playwright test e2e/screenshots.spec.ts --project=chromium --workers=1`

- 🔲 **Ensure all E2E tests green after Month 1 changes** [S]
  - Run: `npm run test:e2e`
  - Fix any failures from new project cards or experience section changes

- 🔲 **Add unit tests for new Month 2 components** [M]
  - `__tests__/ReadingProgressBar.test.tsx`
  - `__tests__/blog-search.test.ts`

### 3D — SEO Polish

- 🔲 **Add `hire` page to sitemap** [S]
  - Check `app/sitemap.ts` — `/hire` route missing, add it

### 3E — Resume

- 🔲 **Update resume PDF if content has changed** [S]
  - Replace `public/Shailesh_Chaudhari_Resume.pdf`
  - Filename must stay identical (all existing links remain valid)

---

## Ongoing

- Run `npm test` after any utility/component change (target: 48+ tests green)
- Run `npm run type-check` before every commit
- Update `CLAUDE.md` when new routes, components, or conventions are added
- Run `npm run generate-blog-manifest` when blog posts are added

---

## Quick Reference: File Locations

| What to change | File |
|---|---|
| Project card content | `constants/projects.ts` |
| Experience / Education | `constants/index.ts` |
| Blog post list | `lib/blog-data.ts` + `data/blog-manifest.json` |
| Social links, email, site URL | `lib/constants.ts` |
| About page bio text | `app/about/AboutContent.tsx` |
| Navigation links | `components/navbar/index.tsx` |
| AI crawler context | `public/llms.txt`, `public/llms-full.txt` |
| Resume PDF | `public/Shailesh_Chaudhari_Resume.pdf` |
| Page metadata | `app/<page>/metadata.ts` |
| OG image design | `app/api/og/route.tsx` |
| RSS feed | `app/feed.xml/route.ts` |
