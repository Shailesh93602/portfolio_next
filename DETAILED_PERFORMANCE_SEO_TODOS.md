## Detailed Performance & SEO TODOs

Purpose
- Capture high-impact, prioritized, and actionable tasks derived from the recent Next.js portfolio audit (bundle analysis, metadata, images, fonts, client/server component split, and SEO schema).
- For each task: include a short contract, files to change, implementation steps, validation commands, acceptance criteria, and estimated effort.

How to use this file
- Pick tasks in priority order (P0 -> P1 -> P2). Each task is actionable and small enough to implement, test, and iterate.
- After implementing a task, run the verification commands (build/analyze + Lighthouse) and mark it Done.

Summary of priorities
- P0 — Critical: affects initial page load, LCP, or large shared bundles. Fix these first.
- P1 — High: meaningful impact on JS/CSS or SEO but lower immediate risk.
- P2 — Nice-to-have: incremental gains, content improvements, or documentation.

---

P0 — Immediate (highest impact)

1) Extract top modules from the large shared chunks and create per-module plan
- Contract: Produce an exact list of modules that compose the two ~50KB shared chunks reported by the build analyzer. Output the top 6 contributors (by bytes) and map them to source files/components.
- Files touched: none (analysis step). Optionally create a follow-up branch/PR per module.
- Steps:
  1. Generate production analyzer (already done) and open the client analyzer report: `.next/analyze/client.html`.
  2. Use the analyzer UI to inspect chunk contents and note module paths, or use source-map tools if you prefer CLI (productionBrowserSourceMaps is enabled).
  3. For each top module, decide: (a) dynamic import (lazy), (b) replace with CSS/inline SVG, or (c) swap for a lighter library.
- Validation:
  - Run `ANALYZE=true npm run build` then open `.next/analyze/client.html` and confirm the list.
  - Acceptance: a concrete list of the top 6 modules with recommended remediation for each.
- Est. effort: 15–30 min.

Commands:
```bash
ANALYZE=true npm run build
open .next/analyze/client.html
# optional: analyze a bundle file with source-map-explorer (requires installing it)
# npx source-map-explorer .next/static/chunks/<chunk>.js .next/static/chunks/<chunk>.js.map
```

2) Eliminate framer-motion from initial render path (site-wide sweep)
- Contract: Replace framer-motion usage in components that affect initial render (Hero, Navbar, Header, Footer, and any SSR/Server components rendered on first paint) with either CSS transitions or lazy/dynamic import of framer-motion.
- Files to change (examples):
  - `components/hero.tsx` (already done)
  - `components/navbar/index.tsx` (already done)
  - `components/header.tsx`
  - `components/footer.tsx`
  - `components/blog/blog-card.tsx`
  - `components/project-card.tsx`
  - `components/featured-projects.tsx`
  - other components that import `framer-motion`
- Steps:
  1. Find remaining framer-motion imports: search for "framer-motion".
  2. For components that are part of the first meaningful paint, remove framer-motion and implement simple CSS animations/transitions.
  3. For non-critical interactive animations, use dynamic import: `const Motion = dynamic(() => import('framer-motion'), { ssr: false })` and wire small wrappers so the component only loads it on interaction.
  4. Rebuild and re-run analyzer.
- Validation:
  - Acceptance: initial First Load JS shared by all decreases by at least 20–30 KB (or top framer-motion modules no longer present in the shared chunks).
  - Re-run `ANALYZE=true npm run build` and verify `.next/analyze/client.html` shows framer-motion code removed from initial chunks.
- Est. effort: 1–3 hours depending on number of uses.

3) Icon strategy: stop importing large icon libraries into shared bundle
- Contract: Replace broad imports from `lucide-react`, `react-icons`, or `@radix-ui/react-icons` that pull whole icon sets into the shared chunk. Use per-icon direct imports, inline optimized SVG, or a lightweight icon sprite.
- Files to change (examples):
  - `components/header.tsx`, `components/footer.tsx`, `components/theme-switcher.tsx`, `components/ui/*` components that import icons
- Steps:
  1. Find all imports from icon libraries:
     - `grep -R "from 'lucide-react'" -n` and similar for `react-icons`.
  2. For each icon, change to per-icon import pattern (if library supports it), or copy the minimal SVG into a small `icons/` folder and export a React component.
  3. Replace icons in footer/header/header-nav and theme toggle.
  4. Rebuild and analyze.
- Validation:
  - Acceptance: icon library code no longer appears in the top shared chunks; total JS decreases appropriately (measure with analyzer).
- Est. effort: 1–2 hours.

4) Convert remaining raw <img> usages and optimize images
- Contract: Convert any remaining inlined `<img>` markup that appears in blog data or components to `next/image` when images are part of content rendered by Next, and ensure explicit width/height, `decoding="async"`, `loading="lazy"` (for non-LCP), and modern formats (AVIF/WebP).
- Files to change:
  - `lib/blog-data.ts` (some fixes already done)
  - Components that still render `<img>` directly (search for `<img` occurrences)
- Steps:
  1. Audit `public/Images` and compress convert to AVIF/WebP with a tool like `squoosh` or `sharp` based scripts. Keep fallbacks if needed.
  2. Replace `<img>` with `Image` from `next/image` and add explicit sizes.
  3. Preload LCP image (hero/profile) in `app/layout.tsx` or `app/page.tsx` with `<link rel="preload" as="image" href="/path/to/lcp.avif">` and ensure `priority` set for next/image on that image.
- Validation:
  - Acceptance: LCP image served in modern format where supported; Lighthouse LCP improves; no remaining unoptimized `<img>` for hero/critical images.
- Est. effort: 30–90 min.

---

P1 — High priority

5) Audit and reduce client components (convert to server where possible)
- Contract: Find components that are currently client-only ("use client") but do not use client-only features (state/hooks/browser APIs) and convert them back to server components. This reduces client bundle size and tree-shakes dependencies.
- Files to check: `components/ui/*`, `components/blog/*`, `components/navbar/*`, `components/header.tsx` etc.
- Steps:
  1. Search for "use client" across the codebase and document each file.
  2. For each file: reason about whether it needs client behavior; if not, remove "use client" and adjust interactions to use progressive enhancement (e.g., use small client wrappers only where necessary).
  3. Rebuild and check bundle sizes.
- Validation:
  - Acceptance: measurable reduction in First Load JS and/or removal of large imports from client-bundles.
- Est. effort: 1–3 hours (depends on codebase size).

6) Dynamic import large feature components and pages
- Contract: Lazy load non-critical UI and feature modules (blog preview cards, project-card, featured-projects, heatmap, charts) using `dynamic()` or `React.lazy` + Suspense to ensure they load only when needed.
- Files to change:
  - `components/blog/blog-card.tsx` -> lazy in blog listing
  - `components/project-card.tsx` -> lazy for project grid
  - `components/featured-projects.tsx` -> lazy on homepage if below the fold
  - `components/github-contribution-heatmap.tsx` -> load client-only and dynamic
  - `components/stats-charts.tsx` (already dynamic) — confirm
- Steps:
  1. Identify components used below-the-fold or in lists.
  2. Wrap them with `const Comp = dynamic(() => import('./comp'), { ssr: false })` or use `{ssr: true, loading: () => <Skeleton />}` depending on need.
  3. Add lightweight placeholders/skeletons to avoid layout shift.
  4. Rebuild and analyze.
- Validation:
  - Acceptance: decreased initial bundle and improved Lighthouse "Reduce unused JS" metric.
- Est. effort: 1–4 hours across components.

7) Fonts: preload & subset critical fonts
- Contract: Preload only the fonts required for initial render and ensure the font CSS uses `font-display: swap`. Consider subsetted variable fonts for the site to reduce font bytes.
- Files to change:
  - `app/layout.tsx` (or head/metadata) to add link rel=preload
  - font CSS or tailwind config if custom fonts used
- Steps:
  1. Identify fonts used on first paint (hero and nav).
  2. Add `<link rel="preload" href="/fonts/xxx.woff2" as="font" type="font/woff2" crossorigin>` for only the critical fonts.
  3. Use a subset or variable font when possible.
  4. Check `font-display` in CSS.
- Validation:
  - Acceptance: reduced FOIT/CLS and improved Lighthouse fonts metrics.
- Est. effort: 30–90 min.

---

P2 — Medium / Lower priority

8) Improve metadataBase & canonical host wiring
- Contract: Ensure `metadataBase` is set from `SITE_URL` in `app/metadata.ts` and `app/layout.tsx` (already present but double-check during build). Add canonical tags and open graph image optimization.
- Steps:
  1. Confirm the SITE_URL env/constant is correct for production builds.
  2. Add canonical link tags in per-page metadata when required.
- Validation:
  - Acceptance: no metadataBase warning at build time; correct canonical URLs in page source.
- Est. effort: 15–30 min.

9) Content/SEO improvements (schema, internal linking). Note: /hire page was removed per request.
- Contract: Continue to expand per-post structured data (if blog author varies), add internal linking for high-value keywords (e.g., "full stack developer Shailesh Chaudhari") and target high-value pages with clear CTAs.
- Steps:
  1. Audit blog posts for H1/H2 usage and keyword presence.
  2. Expand JSON-LD where appropriate (BreadcrumbList, Organization if needed).
- Validation:
  - Acceptance: structured data tests pass (Rich Results Test); on-page headings include primary keywords.
- Est. effort: 1–6 hours (content work varies).

10) Build & CI checks: add automated analyzer runs and Lighthouse (LHCI) to CI
- Contract: Add a CI job that runs `npm run build`, `ANALYZE=true npm run build` (or a smaller analyzer job), and a Lighthouse audit (or LHCI) for the main pages to detect regressions automatically.
- Steps:
  1. Add a GitHub Actions workflow that runs on PR and pushes to main.
  2. Run build, export analyzer artifacts (as job artifacts), run LHCI to record performance metrics.
- Validation:
  - Acceptance: CI artifacts contain analyzer HTML and LHCI summaries; PRs fail if key thresholds are exceeded.
- Est. effort: 1–3 hours.

---

Quality gates and verification
- Always run these after each change:
```bash
npm run build
ANALYZE=true npm run build   # check .next/analyze/client.html
# Run a local Lighthouse audit or LHCI
npx lhci autorun --collect.collectUrl=http://localhost:3000 --upload.target=temporary-public-storage
```
- Minimum acceptance criteria for major tasks:
  - P0 tasks: decrease First Load JS by measurable bytes and remove the heavy module from the `shared by all` chunks.
  - LCP: improve or keep stable after image optimizations.
  - No new build errors or type errors.

Notes & edge cases
- Some visual animations removed for performance may reduce polish. Prefer to replace with lightweight CSS transitions.
- Dynamic-importing too aggressively can hurt UX (content not present until JS loads). Use skeletons and placeholders.
- On external image hosting or CDNs, verify CORS/headers for `next/image` when switching to AVIF/WebP.

Next immediate actions (what I recommend doing now)
1. Parse `.next/analyze/client.html` to extract the exact module list for the two large shared chunks (task #1). I can do this and produce a prioritized per-file remediation list.
2. Sweep remaining `framer-motion` imports and plan replacements/dynamic imports (task #2).

If you want, I can start with the analyzer parsing now and open a PR for the top 2–3 targeted code changes (for example: icon strategy + dynamic framer-motion import for blog cards).

---

Revision history
- 2025-10-04: Created by automated audit assistant; covers audit findings and prioritized todos for performance and SEO.
