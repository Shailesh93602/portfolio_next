# CLAUDE.md — Shailesh Chaudhari Portfolio

## Project overview

Next.js 16 (App Router) personal portfolio. Deployed on Vercel at `https://shaileshchaudhari.vercel.app`.

Stack: Next.js 16 + Turbopack, TypeScript (strict), Tailwind CSS, shadcn/ui, framer-motion, react-hook-form, TanStack Query, Jest + React Testing Library (unit), Playwright (E2E), Resend (contact email), Zod (validation).

## Owner context (don't forget)

- Owner is a Software Engineer at **ContextQA** working on the **backend of their core QA-automation product** (test execution engine, VNC streaming, Playwright / WebdriverIO / LambdaTest orchestration). First 2-3 months at ContextQA were Chrome extensions (Vibe Testing + AxeTos) — current work is the core product backend.
- Previously ~2 years at EsparkBiz (intern Jan 2024 – Aug 2024; Software Engineer Aug 2024 – Jul 2025). Shipped 3 client projects end-to-end.
- Targeting **Tier-1 companies, Salesforce specifically**, at MTS level.
- **Honesty bar:** never claim specific PR counts, never claim "payments infrastructure engineer" title, never say Chrome extensions are the current work. See MANUAL.md for full rules.

## Key commands

```bash
npm run dev             # start dev server (localhost:3000)
npm run build           # production build (Turbopack)
npm run start           # serve production build
npm run lint            # ESLint
npm run type-check      # tsc --noEmit
npm run format          # Prettier (writes)
npm run format:check    # Prettier (CI check, read-only)

npm test                # Jest unit tests (currently 361 tests, 39 suites)
npm run test:watch      # Jest watch mode
npm run test:coverage   # Jest with coverage report
npm run test:e2e        # Playwright (needs dev/prod server running)
npm run test:e2e:ui     # Playwright with UI mode

npm run analyze         # Bundle analysis (ANALYZE=true build)

# Regenerate all screenshots (11 pages × 2 themes × 2 viewports)
# Requires prod server: npm run start
npx playwright test e2e/screenshots.spec.ts --project=chromium --workers=1
```

## Architecture

```
app/                    # Next.js App Router pages
  HomeContent.tsx       # Home page — hero (static positioning, no cycling titles), "Things I'm building to learn" strip, featured posts
  metadata.ts           # Root Metadata (OG + Twitter)
  page.tsx              # Home — renders HomeContent + FAQPage JSON-LD
  layout.tsx            # Root layout: Providers → ThemeProvider → skip-nav → Navbar → main#main-content → Footer → GA + Sentry
  providers.tsx         # "use client" — QueryClientProvider for TanStack Query
  globals.css           # CSS variables (light + dark tokens via :root / .dark), focus-visible styles

  api/
    contact/route.ts    # POST — Zod validation + Resend email + in-memory rate limit (5/hr per IP) + graceful 503+mailto fallback when RESEND_API_KEY missing
    og/route.tsx        # Dynamic OG image (@vercel/og) for project detail pages
    statistics/route.ts # GitHub + LeetCode stats with 10s upstream timeout + snapshot fallback

  about/                # About page
  blog/[slug]/          # Individual blog post (MDX)
  blogs/                # Blog listing
  contact/              # Contact form (calls /api/contact, falls back to mailto on 503)
  hire/, hire-me/       # permanentRedirect → /services
  services/             # "What I work on" — neutral; NOT a freelance landing page (see __tests__/no-hire-copy.test.ts)
  portfolio/            # Portfolio listing
    PortfolioContent.tsx
    PortfolioSkeleton.tsx  # "use client" — used as loading.tsx target (NEVER remove "use client" — framer-motion there breaks SSG without it)
    loading.tsx
    [id]/
      page.tsx
      ProjectDetailContent.tsx   # Renders showcase or fallback project layout based on project.isShowcase
  statistics/           # GitHub + LeetCode stats page with snapshot fallback

components/
  navbar/               # Sticky navbar with mobile overlay
  ui/                   # shadcn/ui primitives
  Showcase/
    ArchitectureDiagram.tsx  # Layered architecture visualization (lucide icons per layer)
    KeyMetrics.tsx           # 3-card metric grid used on showcase project detail pages
    ThemeComparison.tsx      # Light/dark image toggle for project screenshots
  ExperienceSection, EducationSection, SkillsSection, Achievements
  stats-charts.tsx      # Dynamic import (ssr:false) — recharts
  github-contribution-heatmap.tsx

constants/
  projects.ts           # ALL project data (cards + showcase detail screens). Project = { id, title, description, tags, github, live, isShowcase, architecture, keyMetrics, userFlow, showcases, features, techStack, problem, solution, challengesSolved }
  index.ts              # ExperienceSection / EducationSection data + itemVariants + shared animation config

content/
  blog/                 # 21 MDX files — YAML frontmatter + HTML body. Add new posts here, then add slug to BLOG_SLUGS in blog-data.ts.

data/
  blog-manifest.json          # Auto-generated by scripts/generate-blog-manifest.mjs on postbuild — don't edit by hand (in .prettierignore)
  statistics-snapshot.json    # Last-known-good GitHub + LeetCode numbers — served by /statistics when live APIs time out (in .prettierignore)

lib/
  blog-data.ts                # BLOG_SLUGS, loadPost (gray-matter), helper exports
  github-service.ts           # GitHub API calls + getLocalDate/daysBetween
  leetcode-service.ts         # LeetCode API calls + streak calculation
  statistics-snapshot.ts      # getStatisticsSnapshot() — reads data/statistics-snapshot.json
  constants.ts                # SOCIAL_LINKS, CONTACT_INFO, SITE_URL, META_DEFAULTS
  claims.ts                   # Numbers stated about OTHER repos (BALLAST ledger findings, KhataGO tool count) — defined once, imported by every page, verified daily by check-project-claims.mjs
  phone.ts                    # Contact-form phone validation/normalisation (accepts +91 / spaces / dashes)
  blog-constants.ts           # BLOG_AUTHOR, SITE_URL (for layout schema)
  blog-html.ts                # makeScrollRegionsFocusable — adds tabindex="0" to <pre>/<table> in post HTML at render (they scroll on a phone; axe scrollable-region-focusable kept the a11y job red 2026-08-30 → 09-05)
  animations.ts               # Shared framer-motion variants (fadeIn, staggerContainer)
  utils.ts                    # cn() utility

scripts/
  check-live-urls.mjs            # Daily URL health check (GitHub Actions). Reads every `live`/`github` URL out of constants/projects.ts, so it widens automatically when a project is added. KNOWN_PRIVATE entries carry an expiry.
  check-project-claims.mjs       # Daily CLAIM check. Verifies the NUMBERS projects.ts states about other repos against those repos. Every false claim here started as a true one — "Vitest (147)" was right when written and wrong four merges later. Fetches at a resolved SHA, never at `main`: raw.githubusercontent's CDN serves stale objects for minutes after a push, which made an earlier version flaky exactly when it mattered.
  generate-blog-manifest.mjs     # Runs as postbuild; reads content/blog/ → writes data/blog-manifest.json
  migrate-blog.mjs               # One-time script: extracted blog posts from old blog-data.ts

.github/workflows/
  ci.yml                     # quality (tsc · eslint · prettier · jest) + a11y (a11y.spec.ts, both viewports, next dev) + e2e (recruiter-journey + meta-and-schema, chromium, production build)
  url-health-check.yml       # Daily 10:00 UTC cron runs check-live-urls.mjs
  claim-check.yml            # Daily 10:30 UTC + on PRs touching constants/projects.ts. Runs check-project-claims.mjs.
  (Supabase keepalive workflow DELETED — replaced by per-project Vercel crons inside KhataGO + DevTrack + EduScale/Frontend)

public/
  Images/                     # Static images (shailesh.webp, project screenshots, per-project /Images/<project>/)
  Images/screenshots/         # Playwright screenshots (gitignored; regenerate via e2e/screenshots.spec.ts)
  Shailesh_Chaudhari_Resume.pdf
  llms.txt, llms-full.txt     # AI crawler context files
  feed.xml/route.ts           # RSS feed
  sitemap.xml, robots.txt
```

## Environment variables

| Variable                               | Required | Purpose                                                                                                                          |
| -------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`        | Optional | Google Analytics (skipped if unset)                                                                                              |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console meta tag                                                                                                   |
| `GITHUB_TOKEN`                         | Optional | GitHub API rate limit (statistics page)                                                                                          |
| `RESEND_API_KEY`                       | Optional | Enables /api/contact real email send. Without it the endpoint returns 503 + fallback:"mailto" and the UI falls back to `mailto:` |
| `RESEND_FROM`                          | Optional | Custom `From` header (requires verified Resend domain). Defaults to `onboarding@resend.dev`                                      |

## Theming

`next-themes` with `attribute="class"`. Light/dark CSS tokens live in `app/globals.css` under `:root` and `.dark`. Playwright screenshots set theme via `localStorage.setItem("theme", "light"|"dark")` then `page.reload()`.

**Critical gotcha:** Any component that uses `framer-motion` **MUST be `"use client"`** — if a server component renders `motion.*`, SSG prerender fails with "Element type is invalid: got undefined" (we debugged this at length; the offender was `PortfolioSkeleton.tsx`). If the build fails with that error on any `/portfolio*` page, first suspect is a framer-motion import without `"use client"`.

## Testing

- **Unit tests** (`__tests__/`): 361 tests across 39 suites. Covers API routes (statistics, contact), blog functions, components (BlogCard, ProjectCard, EducationSection, KeyMetrics), utils, constants. Run with `npm test`.
- **E2E** (`e2e/`):
  - `routes.ts` — **not a spec.** Derives the route inventory (static + `/portfolio/<id>` from `constants/projects.ts` + `/blog/<slug>` from `BLOG_SLUGS`) so adding a project or post automatically widens the asset / SEO gates.
  - `navigation.spec.ts` — desktop + mobile nav sanity
  - `portfolio-detail.spec.ts` — showcase + fallback project details
  - `blog.spec.ts` — blog listing + post navigation
  - `seo.spec.ts` — hand-picked schema blocks
  - `a11y.spec.ts` — axe WCAG 2 A/AA on every route × light + dark
  - `screenshots.spec.ts` — full-page screenshots generator (not a test, artifact-only)
  - `ux-capture.spec.ts` — visual audit harness: every page at 1440 + 390 in **both** themes → `/tmp/portfolio-ux/` (artifact-only, reviewed by eye)
  - `api-endpoints.spec.ts` — API route sanity
  - `console-and-links.spec.ts` — **broken-links + console-error gate** — 11 pages × 0 errors required. Whitelists benign third-party noise (GA, Vercel Insights, Sentry).
  - `asset-integrity.spec.ts` — **every route** × 0 console errors / 0 failed requests, every `<img>` decoded with non-zero intrinsic size, og+twitter images resolve to real bytes, icons + manifest + the resume PDF (asserts `%PDF-` magic bytes), and the legacy `/hire` `/hire-me` `/blog` redirects.
  - `recruiter-journey.spec.ts` — **one sequential journey** (runs in CI, chromium): home (hero above the fold, no availability/freelance copy) → /portfolio → a project detail → /engineering (findings render, internal write-ups 200) → resume PDF (200, `application/pdf`, `%PDF-`, >20 KB, plus the `/resume` redirect) → /contact (mailto + form present, **no phone number in text or markup, no "project in mind" copy**). Plus case-study substance, live/repo popups, every card resolves. The old "Hire me" CTA assertion is gone with the CTA.
  - `blog-journey.spec.ts` — listing → post → MDX rendered as HTML → RSS well-formedness → per-post OG image → BlogPosting JSON-LD.
  - `contact-form.spec.ts` — real validation copy, server-side Zod validation, and the 503 + `fallback:"mailto"` path (the default behaviour with no `RESEND_API_KEY`).
  - `statistics-fallback.spec.ts` — snapshot renders in the SSR HTML and survives an upstream 504 / a 12s hang.
  - `meta-and-schema.spec.ts` — per-route title/description/canonical/og:type, **brand appears at most once in `<title>`**, unique canonicals + titles, valid JSON-LD, sitemap ↔ robots ↔ servable-routes consistency.
- `e2e/` tests require a running server. **CI runs three of them** (`.github/workflows/ci.yml`): the `a11y` job runs `a11y.spec.ts` on both viewports against `next dev` (~7 min); the `e2e` job builds, then runs `recruiter-journey.spec.ts` + `meta-and-schema.spec.ts` on chromium against `next start` (Playwright starts it via `PLAYWRIGHT_WEB_SERVER_COMMAND`). Everything else is local-only — run it before a PR that touches what it covers.
- **Pin the port.** Port 3000 is often taken by another app on this machine, which silently points the whole suite at the wrong site. Run the gates against a production build:
  ```bash
  npm run build && npx next start -p 3230
  PLAYWRIGHT_NO_SERVER=1 PLAYWRIGHT_PORT=3230 npx playwright test --project=chromium
  ```
  `PLAYWRIGHT_PORT` drives both `baseURL` and the auto-started dev server; `PLAYWRIGHT_NO_SERVER=1` tells Playwright you started the server yourself.

## Conventions

- Page components are `*Content.tsx` with `"use client"`, imported by the page's `page.tsx` (a server component).
- `metadata.ts` per-page file exports the Next.js `Metadata` object (so server-rendered head can consume it).
- All constants (social links, contact info) come from `lib/constants.ts` — **never hardcode URLs/emails**.
- Images: use `next/image` everywhere. Store new images under `public/Images/<project-name>/`.
- Blog posts: add MDX to `content/blog/`, then add the slug to `BLOG_SLUGS` in `lib/blog-data.ts`. `data/blog-manifest.json` is auto-generated on postbuild. `archived: true` in frontmatter keeps a post at its URL (200, in the sitemap) but out of the index / home / RSS / tags — the 17 posts from 2024 are archived this way; `publishedPosts` is what surfaces list, `blogPosts` is everything that renders.
- **Commits:** no "Co-Authored-By: Claude" lines. Focused, imperative subject lines.

## Accessibility baseline (WCAG AA)

- Skip-to-main link in layout (`<a href="#main-content">`)
- `<main id="main-content">` landmark
- `<nav aria-label="Main navigation">` with logo `aria-label`
- `focus-visible` outline: `2px solid hsl(var(--ring))` in globals.css
- All interactive elements use semantic HTML (`<button>`, `<a>`) — no click handlers on `<div>`

## Keepalive infrastructure (cross-project)

- This portfolio is deployed on Vercel. The 3 Supabase-backed projects (KhataGO, DevTrack, EduScale/Frontend) each own `/api/cron/keepalive` + `vercel.json` cron at `0 9 * * *`. Each does a real DB query (Prisma `SELECT NOW()` / Supabase `auth.getSession()`).
- EduScale Backend has its own Vercel cron at `/api/v1/health` which pings Redis + Postgres + Bull daily at 09:00 UTC (keeps Upstash Redis unpaused).
- Secret convention: cron endpoints in the sibling repos (KhataGO, DevTrack, EduScale) gate on `Authorization: Bearer $CRON_SECRET`. Add `CRON_SECRET` in each of those projects' Vercel env (Production) before redeploying. **This portfolio repo has no cron routes of its own** — the mention is here so future-me doesn't add an unprotected one by accident.

## Known gotchas

- `PortfolioSkeleton.tsx` (loading.tsx target) **MUST** have `"use client"` — framer-motion imports without it crash SSG.
- `data/blog-manifest.json` + `data/statistics-snapshot.json` are generated artifacts — listed in `.prettierignore`. If Prettier touches them, the `format:check` CI step fails.
- The `KeyMetrics` / `ArchitectureDiagram` / `ThemeComparison` components are already direct imports (not `next/dynamic`) — `next/dynamic` with `ssr:false` inside a "use client" component also triggers the Turbopack SSG bug.
- **Scope (locked 2026-08-15):** the featured set is **KhataGO, EduScale and this portfolio**, plus the ContextQA work (Vibe Testing, AxeTos) and the OSS libraries. Demo projects — holdfast, redis-battle-demo, stripe-payments-demo, razorpay-patterns-demo — were **removed** on the owner's call: a demo app is not a resume item, and anything worth showing should live inside a real project instead. Do not re-add them.

## Related docs (external — NOT tracked in this repo)

Working-state docs live outside the public repo to keep roadmap, recruiter strategy, and WIP drafts off GitHub. All paths below are absolute on the owner's machine.

- `/Users/shaileshchaudhary/Desktop/Coding/docs/portfolio-next/MANUAL.md` — tasks that require the owner's credentials / accounts / writing.
- `/Users/shaileshchaudhary/Desktop/Coding/docs/portfolio-next/TODO.md` — code-executable backlog.
- `/Users/shaileshchaudhary/Desktop/Coding/docs/portfolio-next/PLAN.md` — 3-month plan, target companies, priorities.
- `/Users/shaileshchaudhary/Desktop/Coding/docs/portfolio-next/drafts/` — OSS contribution drafts, Razorpay plan, Loom storyboards, audits, etc.

If a future session needs any of these, read from the path above. Do NOT recreate them inside this repo.
