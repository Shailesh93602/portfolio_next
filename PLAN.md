# Portfolio Improvement Plan

**Goal:** Score 90+/100 as a Software Engineer candidate (Vercel or similar top-tier companies)  
**Current Score:** 74/100  
**Target Score:** 90/100  
**Date:** April 14, 2026

---

## Honest Gap Analysis

Before the plan, here's what we can and cannot fix:

| Gap                            | Fixable? | Approach                                             |
| ------------------------------ | -------- | ---------------------------------------------------- |
| No unit tests (-10)            | YES      | Add tests for utils, hooks, API routes               |
| Experience < 3 yrs (-8)        | NO       | Compensate with project depth & quality              |
| Education not visible (-5)     | YES      | Add EducationSection to About page                   |
| No open source (-5)            | PARTIAL  | Blog post about your Next.js PR attempt shows intent |
| GA placeholder / TODOs (-4)    | YES      | Fix in code, delete clutter files                    |
| Unverified metrics (-4)        | PARTIAL  | Add Lighthouse screenshots to projects               |
| Blog depth (-3)                | PARTIAL  | Write 1-2 strong technical deep dives                |
| No system design evidence (-3) | PARTIAL  | Expand project architecture descriptions             |

**Realistic ceiling after all fixes: ~90-92/100**  
The experience gap will always cost ~4-5 points — that's honest and unfakeable.

---

## Phase 1 — Repository Hygiene (Claude does this)

**Goal:** Make the repo itself look production-quality before any interviewer clones it.

- [ ] Delete 14 clutter `.md` files from root (keep only `README.md`, `PLAN.md`, `TODO.md`, `MANUAL.md`)
- [ ] Delete `temp.ts` (empty file)
- [ ] Delete `robots-disallow.txt`, `robots-production.txt` (non-standard leftover files)
- [ ] Fix `GA_MEASUREMENT_ID` placeholder → use `NEXT_PUBLIC_GA_MEASUREMENT_ID` env variable pattern
- [ ] Rewrite `README.md` → accurate, professional, reflects current stack (Next.js 16, not 13)
- [ ] Standardize resume: one file at `/public/Shailesh_Chaudhari_Resume.pdf`, remove duplicate `resume.pdf`

**Score impact: +3**

---

## Phase 2 — Missing Education Section (Claude does this, needs your data)

**Critical finding:** Despite your belief, education is NOT in the codebase anywhere. There is:

- No `Education` type in `types/index.ts`
- No education data in `constants/index.ts`
- No `EducationSection` component
- No education rendering in `AboutContent.tsx`

The About page shows: Experience → Achievements → Skills → Hobbies. No education.

**Plan:**

- [ ] Add `Education` interface to `types/index.ts`
- [ ] Add your education data to `constants/index.ts` (needs your input — see MANUAL.md)
- [ ] Create `components/EducationSection/index.tsx`
- [ ] Wire it into `AboutContent.tsx` between Experience and Achievements

**Score impact: +4**

---

## Phase 3 — Testing (Claude does this)

**Current state:** Zero test files. Playwright configured, Jest listed, but no `.test.ts` exists.

**Pragmatic approach:** Don't fake coverage. Write real, meaningful tests:

- [ ] Unit tests for `lib/utils.ts` functions
- [ ] Unit test for blog API route (`app/api/blogs/route.ts`)
- [ ] Unit test for `useStats` hook (mock fetch)
- [ ] Component smoke test for `Hero` and `ProjectCard`

**Score impact: +6** (can't fully close the -10 gap without comprehensive coverage, but shows discipline)

---

## Phase 4 — You Do This (see MANUAL.md for step-by-step)

### 4a. Google Analytics (1 hour)

- Create a GA4 property at analytics.google.com
- Add real `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel env vars
- This fixes the non-functional analytics placeholder

### 4b. Performance Proof (2-3 hours)

- Run Lighthouse on your live portfolio: https://shaileshchaudhari.vercel.app
- Screenshot scores and add to `/public/Images/lighthouse-score.png`
- Run Lighthouse on EduScale and KhataGO
- Reference the scores in project descriptions

### 4c. Write One Strong Technical Blog Post (3-5 hours)

The 17 existing blog posts are surface-level and were all written in a 2-week burst.
Write ONE deep technical post:

- **Suggested topic:** "Building a Real-Time Battle Zone: Redis Pub/Sub + Socket.io at <200ms" (EduScale)
- Or: "What I Learned Submitting My First PR to Next.js" (your contribution attempt)
  The second topic directly addresses the open source gap with honesty — which is better than silence.

### 4d. Add Lighthouse/Architecture Images to Projects (1 hour)

- Add a `metrics` field to EduScale and DevTrack project cards
- Link to real screenshots or dashboards

### 4e. Education Details (15 minutes)

Provide your college name, degree, graduation year, and CGPA (if good) so Claude can add them to the code.

---

## Phase 5 — Cannot Fix (accept and compensate)

### Experience Depth

You have ~2 years. Vercel typically wants 3-5 for mid+ roles.
**Compensation strategy:**

- Depth of EduScale and Vibe Testing architectures shows beyond-years maturity
- Chrome extensions = rare skill that stands out
- Be explicit in cover letter: "I know the experience bar, here's why I punch above it"

### Open Source Contributions

You tried the Next.js PR — that's real. Don't hide it.
**Compensation strategy:**

- Write the blog post about the attempt (shows proactive ecosystem engagement)
- Star/watch/discuss issues on Next.js, Prisma repos (visible on GitHub profile)
- Even commenting on issues with a well-researched response counts as contribution

---

## Score Projection

| Phase                 | Points Gained | Cumulative |
| --------------------- | ------------- | ---------- |
| Baseline              | —             | 74         |
| Phase 1 (hygiene)     | +3            | 77         |
| Phase 2 (education)   | +4            | 81         |
| Phase 3 (tests)       | +6            | 87         |
| Phase 4a (GA)         | +1            | 88         |
| Phase 4b (perf proof) | +2            | 90         |
| Phase 4c (deep blog)  | +2            | 92         |
| Phase 4d+4e (metrics) | +1            | 93         |
| Uncloseable gaps      | -4 to -6      | **~88-90** |

---

## What "10/10 Portfolio" Actually Means

A 10/10 portfolio for a SE role isn't about adding more content — it's about:

1. Every existing claim being verifiable (metrics, live links, GitHub links)
2. Code that runs first try, no dead config, no console errors
3. A README a stranger can follow to run it locally
4. Tests that pass in CI
5. Content that shows depth, not breadth

Less is more. Delete the noise, sharpen the signal.
