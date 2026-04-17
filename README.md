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

| Command | Description |
|---|---|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript strict check |
| `npm run format` | Prettier (writes) |
| `npm run analyze` | Bundle analysis (ANALYZE=true build) |
| `npm test` | Jest unit tests (130 tests, 14 suites) |
| `npm run test:coverage` | Jest with coverage report |
| `npm run test:e2e` | Playwright E2E (requires running server) |
| `npm run test:e2e:ui` | Playwright with UI mode |

## Deployment

Deployed on Vercel with automatic CI/CD on push to `main`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shailesh93602/portfolio_next)
