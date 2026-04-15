# What's Left — Manual Tasks Only

Everything automatable has been done. This file lists only the tasks that need your credentials, accounts, or writing.

---

## What Was Automated (for reference)

- Education section wired into About page (BE IT, GEC Bhavnagar, 2020-2024, 7.99 CGPA)
- All robotic language removed across all pages
- Hire Me added to navbar
- Schema.org structured data on all 7 pages (Person, FAQ, Service, ProfilePage, etc.)
- llms.txt + llms-full.txt for AI crawlers (ChatGPT, Claude, Perplexity)
- GA script wired to env var (only fires when set)
- 48 unit tests passing (utils, blog API, constants, components)
- 34 E2E tests passing: navigation (desktop + mobile) + SEO schemas
- Full-page screenshots of all 7 pages × 3 viewports × 2 themes (42 total)
- Portfolio fake loading delay removed
- Contact form now builds a real mailto: URL with all fields pre-filled
- About page shows all sections by default (Experience, Education, Skills, etc.)
- Skip-to-main-content link added (WCAG 2.4.1 AA)
- Focus-visible indicators added (WCAG 2.4.7 AA)
- Navbar aria-labels added
- 5.7MB of dead/duplicate images removed from public/Images
- Production source maps disabled (reduces bundle size)
- AVIF + WebP image formats enabled in next.config.ts
- CLAUDE.md created for future sessions
- Google Search Console verified and live

---

## Remaining Tasks

### 1. Google Analytics — 30 min

1. Go to https://analytics.google.com
2. Create Account → Property → Data Stream (Web) → `https://shaileshchaudhari.vercel.app`
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`)
4. Vercel Dashboard → your project → Settings → Environment Variables
5. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (all environments)
6. Redeploy

---

### 2. Verify Live Project URLs — 15 min

Free-tier Supabase DBs pause after 7 days of inactivity.

| Project  | URL                                | Fix if down                   |
| -------- | ---------------------------------- | ----------------------------- |
| EduScale | https://eduscale.vercel.app        | Unpause in Supabase dashboard |
| DevTrack | https://daily-dev-track.vercel.app | Unpause in Supabase dashboard |
| KhataGO  | https://khatago.vercel.app         | Unpause in Supabase dashboard |

---

### 3. Write One Deep Technical Blog Post — 3–5 hrs (highest ROI)

Your 17 existing posts are all surface-level. One genuinely deep post does more for credibility than all of them combined.

**Best option — EduScale real-time architecture:**

> "Building Real-Time Coding Battles: Redis Pub/Sub + Socket.io at Under 200ms"

Structure that works:
1. The problem (why polling failed, what <200ms sync actually means)
2. Why Redis pub/sub over raw WebSockets or DB polling
3. How you structured Socket.io rooms (user rooms, battle rooms, reconnect logic)
4. The specific thing that got you under 200ms (what you tuned)
5. What broke in production (be honest — this makes it credible)
6. What you'd do differently (Redis Streams vs pub/sub?)

**Alternative — the Next.js PR attempt:**

> "My First PR to Next.js: What I Learned Submitting to a Framework"

Shows initiative, reading source code, getting feedback from core team, learning from it. Directly addresses the "no open source" gap with honesty.

After writing, add it to [`lib/blog-data.ts`](lib/blog-data.ts) and [`data/blog-manifest.json`](data/blog-manifest.json).

---

### 4. Lighthouse Screenshots — 1 hr (optional but useful)

1. Chrome → `https://shaileshchaudhari.vercel.app` → DevTools → Lighthouse → Desktop → Analyze
2. Screenshot → `public/Images/lighthouse-portfolio.png`
3. Repeat for EduScale → `public/Images/lighthouse-eduscale.png`

Share the scores and I'll add them to the project cards.

---

## Priority Order

| Priority   | Task                          | Time    |
| ---------- | ----------------------------- | ------- |
| Today      | Verify 3 live project URLs    | 15 min  |
| Today      | Google Analytics setup        | 30 min  |
| This month | Write deep blog post          | 3-5 hrs |
| Optional   | Lighthouse screenshots        | 1 hr    |
