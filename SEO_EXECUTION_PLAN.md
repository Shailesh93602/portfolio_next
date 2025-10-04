## SEO Execution Plan for Shailesh Chaudhari's Portfolio

This document contains a step-by-step execution plan to improve organic visibility for brand keywords (e.g., "Shailesh Chaudhari", "Shaileshbhai") and competitive technical keywords (e.g., "full stack developer", "software engineer", "freelance software engineer"). Tasks are grouped into phases with acceptance criteria, owners, and an estimated timeline.

---

## Objectives (measurable)
- Rank #1 for brand queries: "Shailesh Chaudhari", "Shailesh", "Shaileshbhai" within 1–4 weeks.
- Achieve top 10 for 10 targeted mid-tail keywords (e.g., "hire full stack developer", "Next.js performance guide") within 3–9 months.
- Improve Core Web Vitals to Lighthouse performance score >= 90 and TTI / LCP improvements within 2–6 weeks.

---

## Phase A — Audit & Quick Wins (Days 0–7)
Goal: Fix high-impact technical issues and ensure the site is crawlable, indexable, and has consistent metadata.

Tasks:
- A1: Verify Google Search Console and Bing Webmaster access. Submit sitemap.xml and check indexing status. (Acceptance: verified domain in GSC, sitemap submitted) — Owner: You / Ops — ETA: 1 day
- A2: Add JSON-LD Person and WebSite schema to root layout and add BlogPosting schema to blog posts. (Acceptance: schema visible in page source, no schema errors in Rich Results test) — Owner: Dev — ETA: 1 day
- A3: Ensure canonical tags, OG/Twitter meta, and consistent title/description templates site-wide. (Acceptance: all major pages have canonical + OG tags) — Owner: Dev — ETA: 1–2 days
- A4: Check robots.txt for disallows and ensure sitemap reference exists. (Acceptance: robots.txt allows indexing of pages and references sitemap) — Owner: Dev/Ops — ETA: 1 day
- A5: Quick Lighthouse run; fix obvious image/font preload issues and large third-party scripts. (Acceptance: no critical render-blocking resources) — Owner: Dev — ETA: 1–3 days

---

## Phase B — On-Page SEO & Content Foundation (Weeks 1–4)
Goal: Create and optimize pages and structured content that target the prioritized keywords.

Tasks:
-- B1: (Deferred) Create a dedicated "Hire / Services" page targeting "hire full stack developer", "freelance software engineer" — previously planned but now deferred per request.
- B3: Convert 2–3 portfolio projects into SEO-optimized case studies (challenge, approach, results, images). (Acceptance: case studies are >=1000 words and linked from home) — Owner: Content — ETA: 2–3 weeks
- B4: Implement accessible semantic HTML (H1 per page, meaningful headings, ALT text). (Acceptance: automated accessibility scan shows improvements) — Owner: Dev — ETA: 1 week

---

## Phase C — Content Growth & Keyword Targeting (Months 1–6)
Goal: Publish pillar content and supporting cluster posts; target mid-tail and long-tail keywords.

Tasks:
- C1: Identify 8–12 target keywords and map them to pages (pillar + cluster). (Acceptance: keyword map completed) — Owner: SEO/Content — ETA: 3–5 days
- C2: Publish the pillar post (2k–3k words) on a primary topic (e.g., "Full Stack Development: What I build & how I work"). (Acceptance: published + internal links to related posts) — Owner: Content — ETA: 2–3 weeks
- C3: Publish 2–4 supporting long-tail posts per pillar. (Acceptance: published, each 1000–1800 words) — Owner: Content — ETA: ongoing (monthly cadence)
- C4: Optimize existing blog posts for target keywords and add structured data. (Acceptance: updated posts and re-index request in GSC) — Owner: Content/Dev — ETA: 2–4 weeks

---

## Phase D — Performance & Technical Maturity (Weeks 2–8)
Goal: Achieve excellent Core Web Vitals and reduce runtime JS and network overhead.

Tasks:
- D1: Full Lighthouse & PageSpeed audit; produce prioritized remediation list. (Acceptance: audit report) — Owner: Dev — ETA: 2–3 days
- D2: Implement image optimization (next/image), convert to WebP/AVIF, preload hero images. (Acceptance: decreased LCP and image payload) — Owner: Dev — ETA: 1–2 weeks
- D3: Use next/font (or system fonts) and preload critical fonts; minimize layout shifts. (Acceptance: CLS < 0.1) — Owner: Dev — ETA: 1 week
- D4: Code-splitting and remove or defer non-essential JS. (Acceptance: TBT reduced) — Owner: Dev — ETA: 1–3 weeks

---

## Phase E — Authority & Backlinks (Months 1–12)
Goal: Acquire high-quality links and mentions to build domain authority for competitive keywords.

Tasks:
- E1: Outreach plan: guest posts, case study pitches, and resource link building. (Acceptance: first 5+ quality backlinks) — Owner: Outreach — ETA: 1–3 months
- E2: Create shareable assets (free resume template, performance benchmark repo, interactive demo). (Acceptance: asset published and promoted) — Owner: Content/Dev — ETA: 1–2 months
- E3: Engage on platforms: GitHub (well-documented repos), LinkedIn articles, DEV.to, Hashnode. (Acceptance: 10+ posts/mentions across platforms) — Owner: You — ETA: ongoing

---

## Phase F — Monitoring, Testing & Iteration (Ongoing)
Goal: Measure impact, iterate on content and technical improvements, and scale successful tactics.

Tasks:
- F1: Weekly checks in Google Search Console for indexing issues and query performance. (Acceptance: no critical issues) — Owner: You — ETA: weekly
- F2: Monthly Lighthouse audit and SEO performance report (rank tracking, traffic, CTR changes). (Acceptance: monthly report) — Owner: Dev/You — ETA: monthly
- F3: Experiment with content formats (video, tutorials, interactive demos) and measure engagement uplift. (Acceptance: tracked via GA4 metrics) — Owner: Content — ETA: ongoing

---

## Acceptance criteria / Success metrics
- Brand keywords rank #1 in Google SERP for both exact match and name variants.
- Top 10 positions for at least 10 mid-tail target keywords within 6–12 months.
- Organic sessions growth month-over-month (20–50% in first 3 months depending on baseline).
- Core Web Vitals: Performance >= 90, CLS < 0.1, LCP < 2.5s (lab approximation) on desktop and mobile.

---

## Notes & assumptions
- This plan assumes you have admin control of your domain (for GSC verification) and can deploy changes to the Next.js site.
- Backlink acquisition timelines are estimates and depend on outreach success and content quality.
