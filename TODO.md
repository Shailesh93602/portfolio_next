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

- ✅ **Migrate `lib/blog-data.ts` → MDX files** — `scripts/migrate-blog.mjs` extracted all 17 posts into `content/blog/<slug>.mdx` (YAML frontmatter + HTML body). `lib/blog-data.ts` reduced from 10,078 → 135 lines (thin index using `gray-matter` + `fs.readFileSync`). All helper functions preserved (`getFeaturedPosts`, `getAllTags`, `getRelatedPosts`, `getPostsByTag`). 66 tests still green.

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

- ✅ **Refactor `app/api/statistics/route.ts`** — Extracted `lib/github-service.ts` (~240 lines) and `lib/leetcode-service.ts` (~200 lines). `route.ts` is now a 50-line orchestrator. Unit tests: `__tests__/github-service.test.ts` (10 tests), `__tests__/leetcode-service.test.ts` (5 tests). Total: 66 tests passing.

### 2B — Portfolio Feature Additions

- ✅ **Add blog search by URL query** — `/blogs?q=redis` and `?tag=react` filter client-side. State initialized from URL on mount. 300ms debounced `router.replace()` writes back. Wrapped in `<Suspense>` for `useSearchParams`.

- ✅ **Add reading progress bar to blog posts** — `components/ReadingProgressBar.tsx`, `transform: scaleX()` GPU-accelerated. ARIA `progressbar` role. Tests in `__tests__/reading-progress.test.tsx`. Rendered in `app/blog/[slug]/page.tsx`.

- ✅ **Add Lighthouse CI to GitHub Actions** — `.github/workflows/lighthouse.yml` PR trigger, desktop preset. `.lighthouserc.js` with assertions: perf ≥ 0.85 (warn), a11y/best-practices/seo ≥ 0.9 (error).

### 2C — `redis-battle-demo` Standalone Repo

- ✅ **Scaffold `redis-battle-demo`** — `~/Desktop/Coding/redis-battle-demo`. `src/server.js` (~180 lines): Express + Socket.io + `@socket.io/redis-adapter` (pub/sub clients) + `Redlock` (retryCount:0, distributed tick mutex). `docker-compose.yml` starts Redis. `public/index.html` live demo UI. README with ASCII architecture diagram + Redlock explanation.

---

## Month 3 — June 16 to July 16, 2026

### 3A — Bundle Analysis

- ✅ **Run bundle analysis** — Ran via `ANALYZE=true npx next build --webpack`. Top offenders: recharts+lodash (394kB, already lazy-loaded), lucide (359kB, named imports fine), yup (195kB — eliminated, see below), Next.js internals (217kB, not optimizable).

- ✅ **Fix the worst bundle offender** — Removed `yup` + `@hookform/resolvers` (195kB). Replaced with react-hook-form's built-in `rules` API in `ContactContent.tsx`. Net saving: ~195kB from client bundle.

### 3B — CareerGlyph MVP

- ✅ **Scaffold CareerGlyph backend** — `~/Desktop/Coding/careerglyph` (existing monorepo). Added `prisma/schema.prisma` (Developer, Skill, Project, Endorsement with SkillCategory/SkillLevel enums). `PrismaService` + `@Global() DatabaseModule`. `GET /profile/:username` loads skills+endorsements+projects, 404 for unknown/private. Swagger decorators. Seed file with sample developer, 3 skills, 2 projects, 1 endorsement.

### 3C — Test Suite Maintenance

- 🔲 **Regenerate all 42 Playwright screenshots** [S]
  - After Month 1 UI changes (project cards, experience section)
  - Command: `npm run build && npm run start` then `npx playwright test e2e/screenshots.spec.ts --project=chromium --workers=1`

- 🔲 **Ensure all E2E tests green after Month 1 changes** [S]
  - Run: `npm run test:e2e`
  - Fix any failures from new project cards or experience section changes

- ✅ **Add unit tests for new Month 2 components** — `__tests__/reading-progress.test.tsx` (3 tests: aria attrs, initial 0%, scroll update to 50%).

### 3D — SEO Polish

- ✅ **Add `hire` page to sitemap** — Added to `app/sitemap.ts`.

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
