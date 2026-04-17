# TODO.md — Code-Executable Tasks (3-Month Plan)

All tasks here can be done with code, terminal commands, or file edits.
See PLAN.md for strategic context. See MANUAL.md for tasks requiring credentials or writing.

Legend: ✅ Done 🔲 Pending 🚫 Blocked (needs manual step first)

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

### 1D — EduScale README _(run in the EduScale repo — needs repo access)_

- 🚫 **Add ASCII architecture diagram** — Blocked until EduScale repo is reviewed locally
- 🚫 **Document distributed lock usage** — Same blocker
- 🚫 **Document circuit breaker** — Same blocker
- 🚫 **Document Prometheus /metrics** — Same blocker
- 🚫 **Add working "Running locally" section** — Same blocker

### 1E — KhataGO README _(blocked: repo is private — see MANUAL.md §1)_

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

- ✅ **Regenerate all 42 Playwright screenshots** — All 42 (7 pages × 3 viewports × 2 themes) regenerated after UI changes (experience section, project cards, reading progress bar).

- ✅ **Ensure all E2E tests green after Month 1 changes** — 22/22 pass (navigation + SEO). Fixed pre-existing framer-motion re-animation bug in `AboutContent` (`containerVariants` moved to module scope).

- ✅ **Add unit tests for new Month 2 components** — `__tests__/reading-progress.test.tsx` (3 tests: aria attrs, initial 0%, scroll update to 50%).

### 3D — SEO Polish

- ✅ **Add `hire` page to sitemap** — Added to `app/sitemap.ts`.

### 3E — Resume

- 🔲 **Update resume PDF if content has changed** [S]
  - Replace `public/Shailesh_Chaudhari_Resume.pdf`
  - Filename must stay identical (all existing links remain valid)

---

## Test Coverage Sprint — All Projects

Current state: portfolio_next has 97 unit + 23 E2E tests. redis-battle-demo has 0 tests. CareerGlyph backend has 0 tests.
Goal: full coverage at every layer (unit → integration → API → E2E) for all three projects.

Legend: ✅ Done 🔲 Pending

---

### T1 — portfolio_next: Jest unit tests (missing coverage)

#### T1a — lib/blog-data.ts coverage

- 🔲 **`__tests__/blog-data.test.ts`**
  - `BLOG_SLUGS`: array has 17 entries, all strings, no duplicates
  - `loadPost(slug)`: returns `BlogPost` with required fields (slug, title, date, tags, description)
  - `loadPost('nonexistent')`: returns `null`
  - `blogPosts`: length matches `BLOG_SLUGS`, no nulls
  - `getPostBySlug(slug)`: returns matching post; returns `undefined` for unknown slug
  - `getFeaturedPosts()`: returns only posts with `featured: true`; returns array (possibly empty)
  - `getAllTags()`: returns unique tags, sorted, no empty strings
  - `getRelatedPosts(slug, n)`: excludes the source post; caps at `n`; returns `[]` for unknown slug
  - `getPostsByTag(tag)`: returns only posts containing the tag; empty array for unknown tag

#### T1b — lib/hooks coverage

- 🔲 **`__tests__/hooks.test.tsx`** (React Testing Library renderHook)
  - `useBlogPosts(posts, query, tag)`:
    - returns all posts when query + tag are empty
    - filters by title substring (case-insensitive)
    - filters by tag exact match
    - combined query + tag: intersection of both filters
    - returns `[]` when no posts match
  - `useStats()`:
    - initial state: `{ data: null, loading: true, error: null }`
    - after resolved fetch: `loading: false`, `data` populated
    - after rejected fetch: `loading: false`, `error` populated
    - mock `fetch` globally (jest.spyOn / msw or jest.fn)

#### T1c — ExperienceSection component

- 🔲 **`__tests__/experience-section.test.tsx`**
  - renders "Professional Experience" heading
  - renders each job title from `EXPERIENCE` constant
  - renders company name and date range for each entry
  - renders at least one highlight bullet per entry
  - no `dangerouslySetInnerHTML` present in rendered output (security regression)

#### T1d — Achievements component

- 🔲 **`__tests__/achievements.test.tsx`**
  - renders "Achievements" heading
  - renders GeeksforGeeks Institute Rank 1 entry
  - renders HackerRank 5-star entry
  - renders all achievement titles from `ACHIEVEMENTS` constant

#### T1e — SkillsSection component

- 🔲 **`__tests__/skills-section.test.tsx`**
  - renders skills heading
  - renders each skill category
  - each skill name is present in the DOM

#### T1f — Navbar component

- 🔲 **`__tests__/navbar.test.tsx`**
  - renders main navigation landmark (`<nav aria-label="Main navigation">`)
  - renders logo link
  - all nav links present: About, Portfolio, Blogs, Contact, Hire
  - skip-to-main link is present in DOM with correct href

#### T1g — BlogFilters component

- 🔲 **`__tests__/blog-filters.test.tsx`**
  - renders search input
  - renders "All" tag button
  - renders each tag from the `tags` prop
  - typing in search input calls `onSearchChange`
  - clicking a tag button calls `onTagChange` with the tag

#### T1h — API route: /api/statistics

- 🔲 **`__tests__/api-statistics.test.ts`**
  - Mock `fetchGithubStats` and `fetchLeetCodeStats` (jest.mock `@/lib/github-service` and `@/lib/leetcode-service`)
  - `GET /api/statistics`: returns 200 with merged `{ github, leetcode }` shape
  - When `fetchGithubStats` throws: response still returns 200 with `github: null` (graceful fallback)
  - When `fetchLeetCodeStats` throws: response still returns 200 with `leetcode: null`
  - Response has correct `Cache-Control` header

#### T1i — API route: /api/blogs

- 🔲 **`__tests__/api-blogs.test.ts`**
  - No query params: returns all posts as JSON array
  - `?tag=redis`: returns only posts tagged "redis"
  - `?q=socket`: returns posts whose title/description matches
  - `?q=&tag=`: returns all posts (empty filters pass through)
  - Empty result: returns `[]` not a 404

#### T1j — ReadingProgressBar (extend existing)

- 🔲 Extend `__tests__/reading-progress.test.tsx`
  - `aria-valuenow` updates to 100 when scrolled to bottom
  - Component unmounts cleanly (scroll listener removed — no error thrown)

---

### T2 — portfolio_next: Playwright E2E (missing scenarios)

#### T2a — Blog post detail page

- 🔲 **`e2e/blog.spec.ts`**
  - Navigate to `/blogs` → click first article card → lands on `/blog/<slug>`
  - Page has `<article>` or `role="article"` landmark
  - Reading progress bar is present (`role="progressbar"`)
  - Scrolling to bottom increases progress bar `aria-valuenow`
  - Page title includes article title
  - JSON-LD BlogPosting schema is in DOM

#### T2b — Portfolio project detail page

- 🔲 **`e2e/portfolio-detail.spec.ts`**
  - Navigate to `/portfolio` → click EduScale card → lands on `/portfolio/eduscale`
  - Page shows architecture section
  - Tech stack tags are visible
  - Back/close navigation works (returns to `/portfolio`)

#### T2c — Blog search and filter via URL

- 🔲 **Add to `e2e/blog.spec.ts`**
  - Navigate to `/blogs?q=redis` → only Redis-related posts visible
  - Navigate to `/blogs?tag=react` → only React-tagged posts visible
  - Clear search → all posts return
  - Tag filter shown as active/selected in UI

#### T2d — Contact form validation

- 🔲 **`e2e/contact.spec.ts`**
  - Submit empty form → required field errors appear
  - Invalid email format → validation error on email field
  - Valid submission → success state shown (or `mailto:` link constructed)

#### T2e — Statistics page data renders

- 🔲 **Add to `e2e/navigation.spec.ts` or new spec**
  - `/statistics`: at least one chart or data element renders (not just spinner)
  - GitHub contribution heatmap container is in DOM
  - LeetCode stats section is visible (or graceful empty state)

#### T2f — RSS feed and OG image endpoints

- 🔲 **`e2e/api.spec.ts`**
  - `GET /feed.xml` returns 200 with `Content-Type: application/rss+xml`
  - Feed contains at least one `<item>` with `<title>` and `<link>`
  - `GET /api/og?title=Hello+World` returns 200 with `Content-Type: image/png`
  - `/robots.txt` returns 200 and contains `Sitemap:`
  - `/sitemap.xml` returns 200 and contains the portfolio domain

#### T2g — 404 page

- 🔲 **Add to `e2e/navigation.spec.ts`**
  - Navigate to `/does-not-exist` → renders 404 page (not a blank/error page)
  - Page contains a link back to home

#### T2h — Accessibility assertions (jest-axe)

- 🔲 **`__tests__/a11y.test.tsx`** (jest-axe + `axe-core`)
  - Install: `npm install --save-dev jest-axe @types/jest-axe`
  - Render `<BlogCard />` → `expect(await axe(container)).toHaveNoViolations()`
  - Render `<ProjectCard />` → no axe violations
  - Render `<ExperienceSection />` → no axe violations
  - Render `<EducationSection />` → no axe violations
  - Render `<SkillsSection />` → no axe violations

---

### T3 — redis-battle-demo: Full test suite (0 → covered)

#### T3a — Test infrastructure setup

- 🔲 **Install test dependencies**
  ```
  npm install --save-dev jest @types/jest socket.io-client ioredis-mock
  ```
- 🔲 **Add `jest.config.js`** — `testEnvironment: 'node'`, pattern `**/*.test.js`
- 🔲 **Add `"test": "jest"` script** to `package.json`

#### T3b — Server configuration unit tests

- 🔲 **`src/__tests__/config.test.js`**
  - `PORT` defaults to 3001 when env unset
  - `REDIS_URL` defaults to `redis://localhost:6379`
  - `INSTANCE_ID` is a non-empty string (randomUUID format)
  - `TICK_INTERVAL_MS` is 2000
  - `LOCK_TTL_MS` is 1500

#### T3c — Redlock distributed mutex unit tests

- 🔲 **`src/__tests__/redlock.test.js`** (mock `redlock` module)
  - `tryTick()` acquires lock on `battles:tick:lock`
  - Emits `server_tick` event to all connected clients when lock acquired
  - Does NOT emit when lock acquisition throws (another instance holds lock)
  - Releases lock after emit
  - Lock TTL is `LOCK_TTL_MS`

#### T3d — Socket.io event handler tests

- 🔲 **`src/__tests__/socket-events.test.js`** (use `socket.io-client` against test server)
  - `join_room` with roomId: player tracked in room state, `room_update` emitted to room
  - Second `join_room` same room: `room_update` sent with both players
  - `attack` red team: room's red score increases by 10, `room_update` emitted
  - `attack` blue team: room's blue score increases by 10
  - `disconnect`: player removed from room, `room_update` emitted to remaining players
  - Room state empty after last player disconnects

#### T3e — Redis adapter integration tests

- 🔲 **`src/__tests__/redis-adapter.test.js`** (use `ioredis-mock`)
  - Adapter is configured with separate pub/sub clients
  - Two server instances sharing same Redis: `server_tick` emitted on instance A is received by clients on instance B
  - (Can simulate with two `Server` instances in same test process, shared mock Redis)

---

### T4 — CareerGlyph backend: Full test suite (0 → covered)

#### T4a — PrismaService unit tests

- 🔲 **`src/database/prisma.service.spec.ts`**
  - `onModuleInit` calls `this.$connect()`
  - `onModuleDestroy` calls `this.$disconnect()`
  - Mock `$connect` and `$disconnect` (jest.spyOn)

#### T4b — ProfileService unit tests

- 🔲 **`src/profile/profile.service.spec.ts`** (mock PrismaService)
  - `getByUsername('existing-public-user')`: calls `prisma.developer.findUnique` with correct `where` + `include`
  - `getByUsername('existing-public-user')`: returns formatted profile with `endorsementCount` on each skill
  - `getByUsername('private-user')`: throws `NotFoundException` (isPublic = false)
  - `getByUsername('nonexistent')`: throws `NotFoundException` (null result from Prisma)
  - `formatProfile()`: strips `isPublic`, `createdAt`, `updatedAt` internal fields
  - `formatProfile()`: computes `endorsementCount` = length of endorsements array per skill
  - Prisma mock returns developer with 3 skills, 2 projects, 1 endorsement — shape matches expected output

#### T4c — ProfileController unit tests

- 🔲 **`src/profile/profile.controller.spec.ts`** (mock ProfileService)
  - `GET /profile/:username` calls `profileService.getByUsername(username)`
  - Returns the formatted profile from service
  - When service throws `NotFoundException`, controller propagates it (NestJS handles 404)
  - Health endpoint returns `{ status: 'ok' }`

#### T4d — AuthController + AuthService unit tests

- 🔲 **`src/auth/auth.controller.spec.ts`** + **`src/auth/auth.service.spec.ts`**
  - `getHealth()` returns `{ status: 'ok' }`
  - Controller routes `GET /auth/health` to service

#### T4e — AppModule integration test

- 🔲 **`src/app.module.spec.ts`** (full NestJS module bootstrap)
  - Creates NestJS testing module with all imports
  - `ProfileService` is injectable (wired through `DatabaseModule`)
  - `PrismaService` is globally provided

#### T4f — E2E / API integration tests (supertest)

- 🔲 **`test/app.e2e-spec.ts`** (supertest against full bootstrap)
  - Setup: mock PrismaService responses (don't hit real DB)
  - `GET /profile/shailesh` → 200 with `{ username, skills, projects }` shape
  - `GET /profile/private-user` → 404 `{ message: 'Developer not found or profile is private' }`
  - `GET /profile/nonexistent` → 404
  - `GET /auth/health` → 200 `{ status: 'ok' }`
  - Response has CORS headers (from bootstrap CORS config)
  - Response has `X-Powered-By` removed (helmet)
  - Swagger JSON available: `GET /api-docs-json` → 200 (or `/api` → 200 HTML)

#### T4g — ValidationPipe tests

- 🔲 **Add to e2e spec**
  - `GET /profile/` (no username) → 404 (NestJS routing, not 500)
  - `GET /profile/username-with-special-chars!@#` → 404 or 400 depending on validation

---

### T5 — Test quality gates (all projects)

- 🔲 **Add Jest coverage thresholds** to `jest.config.ts` (portfolio_next):
  ```ts
  coverageThreshold: {
    global: { branches: 70, functions: 80, lines: 80, statements: 80 }
  }
  ```
- 🔲 **Add coverage script** to portfolio_next `package.json`:
  `"test:coverage": "jest --coverage"`
- 🔲 **Add coverage to CareerGlyph** — `npm run test:cov` already exists; add threshold in `package.json` jest config:
  ```json
  "coverageThreshold": { "global": { "lines": 80 } }
  ```
- 🔲 **Add `npm test` to redis-battle-demo** CI/pre-commit — once T3a is done
- 🔲 **Update CLAUDE.md** — document new test commands and coverage commands for all three projects

---

## Ongoing

- Run `npm test` after any utility/component change (target: 200+ tests green across all projects)
- Run `npm run type-check` before every commit
- Update `CLAUDE.md` when new routes, components, or conventions are added
- Run `npm run generate-blog-manifest` when blog posts are added

---

## Quick Reference: File Locations

| What to change                | File                                           |
| ----------------------------- | ---------------------------------------------- |
| Project card content          | `constants/projects.ts`                        |
| Experience / Education        | `constants/index.ts`                           |
| Blog post list                | `lib/blog-data.ts` + `data/blog-manifest.json` |
| Social links, email, site URL | `lib/constants.ts`                             |
| About page bio text           | `app/about/AboutContent.tsx`                   |
| Navigation links              | `components/navbar/index.tsx`                  |
| AI crawler context            | `public/llms.txt`, `public/llms-full.txt`      |
| Resume PDF                    | `public/Shailesh_Chaudhari_Resume.pdf`         |
| Page metadata                 | `app/<page>/metadata.ts`                       |
| OG image design               | `app/api/og/route.tsx`                         |
| RSS feed                      | `app/feed.xml/route.ts`                        |
