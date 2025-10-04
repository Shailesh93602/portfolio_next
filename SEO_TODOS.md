# SEO TODOs — Prioritized Task Tracker

Use this file to track SEO tasks, owners, priority, status, and notes. Update the `Status` column as you progress: Todo, In Progress, Blocked, Done.

| ID | Task | Priority | Status | Owner | ETA | Notes |
|----|------|----------|--------|-------|-----|-------|
| A1 | Verify Google Search Console & submit sitemap | P0 | Todo | You/Ops | 1 day | Domain verification required. |
| A2 | Add JSON-LD Person & WebSite schema to root layout | P0 | Done | Dev | 1 day | Added JSON-LD script to `app/layout.tsx`. |
| A3 | Add BlogPosting schema to posts | P0 | Done | Dev | 1 day | `app/blog/[slug]/page.tsx` already includes BlogPosting JSON-LD. |
| A4 | Ensure canonical tags and OG/Twitter meta across site | P0 | In Progress | Dev | 1–2 days | Metadata centralized in `app/layout.tsx` and `app/metadata.ts`; verify canonical links site-wide. |
| A5 | Check robots.txt for sitemap reference and disallows | P0 | Todo | Dev/Ops | 1 day | `robots.txt` currently exists; verify content. |
| B1 | Create 'Hire / Services' page targeting hiring keywords | P1 | Deferred | Content/Dev | - | Task deferred; /hire page removed per request.
| B2 | Standardize metadata templates in codebase | P1 | Todo | Dev | 2 days | Use `META_DEFAULTS` from `lib/blog-constants.ts`. |
| B3 | Convert 2–3 projects into case studies | P1 | Todo | Content | 2–3 weeks | Each should be 1k+ words with images. |
| B4 | Add ALT text to all images and semantic HTML fixes | P1 | Todo | Dev | 1 week | Use `next/image` alt attributes. |
| C1 | Create keyword map (8–12 keywords) and page targets | P2 | Todo | SEO/Content | 3–5 days | Prioritize mid-tail keywords. |
| C2 | Publish pillar post (2k–3k) and supporting posts | P2 | Todo | Content | 2–4 weeks | Topic cluster linking required. |
| D1 | Full Lighthouse & PageSpeed audit; prioritized fixes | P1 | Done | Dev | 2–3 days | LHCI run (local) completed — found image delivery issues, large network payloads, unminified CSS/JS, unused JS, missing source maps, LCP and TTI warnings. See notes in `SEO_EXECUTION_PLAN.md`. |
| D2 | Optimize images (WebP/AVIF), convert heavy assets | P1 | In Progress | Dev | 1–2 weeks | Replaced hero profile with optimized webp and explicit size. Continue converting large images and inline HTML images in blog content to optimized formats. |
| D3 | Use next/font or system fonts; preload critical fonts | P1 | Todo | Dev | 1 week | Reduce layout shifts. |
| D4 | Code-splitting & defer non-critical JS | P1 | In Progress | Dev | 1–3 weeks | Introduced client-only SpeedInsights wrapper; next step: identify large shared chunks and lazy-load heavy libraries (framer-motion, recharts) where appropriate. |
| E1 | Outreach: guest posts and link building plan | P2 | Todo | Outreach | 1–3 months | Track outreach targets and responses. |
| E2 | Create shareable assets (resume template, repo) | P2 | Todo | Content/Dev | 1–2 months | Publish on GitHub and link back. |
| F1 | Schedule weekly GSC checks and fixes | P3 | Todo | You | Weekly | Add calendar reminders. |
| F2 | Monthly Lighthouse audit and SEO report | P3 | Todo | Dev/You | Monthly | Export results and store in repo. |

## How to use
- Update the `Status` column as work begins and completes.
- Add comments under the relevant ID when blocked or when additional context is required.
- For larger items, link to a dedicated issue or PR in your repository.

## Quick filters
- P0: Must-do immediate technical fixes (crawlability, schema, canonical)
- P1: High-priority on-page and performance work
- P2: Content growth and outreach
- P3: Monitoring and ongoing checks
