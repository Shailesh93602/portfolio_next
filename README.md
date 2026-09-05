[![CI](https://github.com/Shailesh93602/portfolio_next/actions/workflows/ci.yml/badge.svg)](https://github.com/Shailesh93602/portfolio_next/actions/workflows/ci.yml)

# Shailesh Chaudhari — Portfolio

Personal portfolio website built with Next.js 16 App Router, showcasing projects, experience, blog posts, and coding statistics.

**Live:** https://shaileshchaudhari.vercel.app

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, SSG)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 3, Framer Motion
- **UI:** Shadcn UI, Radix UI
- **Data fetching:** React Query
- **Analytics:** Vercel Analytics, Speed Insights
- **Deployment:** Vercel

## Features

- Responsive dark/light theme
- Project showcase with architecture diagrams and live demos
- Blog system with SSG, OpenGraph metadata, and structured data
- Coding statistics dashboard (GitHub, LeetCode, GFG)
- Contact form
- Sitemap and robots.txt for SEO

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```env
# Google Analytics (optional — analytics won't load without this)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Project Structure

```
app/           # Routes and pages (App Router)
components/    # Reusable UI components
constants/     # Static data (projects, skills, experience)
lib/           # Hooks, utilities, blog data
types/         # TypeScript interfaces
public/        # Static assets and images
```

## Scripts

| Command                   | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Development server (localhost:3000)                            |
| `npm run build`           | Production build                                               |
| `npm run start`           | Serve production build                                         |
| `npm run lint`            | ESLint                                                         |
| `npm run type-check`      | TypeScript strict check                                        |
| `npm run format`          | Prettier (writes)                                              |
| `npm run analyze`         | Bundle analysis (ANALYZE=true build)                           |
| `npm test`                | Jest unit tests (414 tests, 42 suites)                         |
| `npm run test:coverage`   | Jest with coverage report                                      |
| `npm run test:e2e`        | Playwright E2E (requires running server)                       |
| `npm run test:e2e:ui`     | Playwright with UI mode                                        |
| `npm run check:claims`    | Numbers stated about other repos vs. those repos (daily in CI) |
| `npm run check:freshness` | Does each live site serve its repo's `main`? (daily in CI)     |

## Deployment

Deployed on Vercel with automatic CI/CD on push to `main`.

### Deploy freshness

`GET /api/version` reports the commit each deployment is serving
(`{ sha, shortSha, ref, deployedAt, env }`, baked from `VERCEL_GIT_COMMIT_SHA`
at build; `Cache-Control: no-store`, `noindex`). KhataGO and EduScale expose
the same route, and EduScale's backend puts the same block in
`/api/v1/health`. `scripts/check-deploy-freshness.mjs` compares each served
sha with the repository's `main` every morning (the `freshness` job in
`.github/workflows/url-health-check.yml`) and fails if the served commit is
not an ancestor of `main`, if `main` has been ahead for more than 24 hours, or
if the route 404s while `main` has it. A build in flight is not a failure: for
30 minutes (`FRESHNESS_GRACE_MINUTES`) after the oldest change live is missing
— the oldest unserved commit, or the commit that put the route on `main`;
never `main` HEAD, which any unrelated commit would reset — a behind sha or a
404 is reported as `deploying` (exit 0, warning) instead. The decision is
`scripts/deploy-freshness-decision.mjs`, unit-tested against a fake clock.

A 200 proves a site is up, not that it is current: KhataGO's production
deploys failed from 2026-08-30 while every status-code check stayed green.
**The KhataGO row of this check is red by design until that deploy is fixed**
— its repo is private to the workflow token, so the sha cannot be compared,
but the route has been on its `main` since 2026-09-05 and a 404 there is a
stale build. A private repo has no commit times to measure a grace window
from, so it gets none.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shailesh93602/portfolio_next)
