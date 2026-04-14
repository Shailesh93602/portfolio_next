# TODO — Portfolio Improvement Tracker

> Legend: ✅ Done · 🤖 Claude does it · 👤 You do it · ⏳ Blocked on your input

---

## 🤖 Claude's Tasks (automated — no action needed from you)

### Repo Cleanup

- [x] 🤖 Create PLAN.md
- [x] 🤖 Create TODO.md
- [x] 🤖 Create MANUAL.md
- [ ] 🤖 Delete clutter .md files: `BUG_REPORT_SUMMARY`, `CRITICAL_BUGS_ACTION_PLAN`, `IMPLEMENTATION_SUMMARY`, `POST_FIXES_TESTING_REPORT`, `TODO_FIXES`, `BLOG_SEO_PLAN`, `BLOG_TODO_IMPLEMENTATION`, `DETAILED_PERFORMANCE_SEO_TODOS`, `MONTHLY_SEO_REPORT_TEMPLATE`, `OUTREACH_TEMPLATES`, `SEO_EXECUTION_PLAN`, `SEO_TODO`, `SEO_TODOS`, `INTERVIEWER_REVIEW`
- [ ] 🤖 Delete `temp.ts`
- [ ] 🤖 Delete `robots-disallow.txt`, `robots-production.txt`
- [ ] 🤖 Remove duplicate `public/resume.pdf` (keep `Shailesh_Chaudhari_Resume.pdf`)

### Code Fixes

- [ ] 🤖 Fix `GA_MEASUREMENT_ID` → `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` in `app/layout.tsx`
- [ ] 🤖 Add null-check so GA script only loads when env var is set

### README

- [ ] 🤖 Rewrite `README.md` — accurate stack (Next.js 16), correct setup instructions, remove broken links

### Education Section

- [ ] ⏳ Add `Education` interface to `types/index.ts` (blocked on your college details — see MANUAL.md)
- [ ] ⏳ Add education data to `constants/index.ts`
- [ ] ⏳ Create `components/EducationSection/index.tsx`
- [ ] ⏳ Wire `EducationSection` into `app/about/AboutContent.tsx`

### Tests

- [ ] 🤖 Install `jest`, `@testing-library/react`, `@testing-library/jest-dom` and configure
- [ ] 🤖 Write unit tests for `lib/utils.ts`
- [ ] 🤖 Write unit tests for `app/api/blogs/route.ts`
- [ ] 🤖 Write basic smoke test for `components/hero.tsx`

---

## 👤 Your Tasks (manual — see MANUAL.md for exact steps)

### Priority 1 — Quick Wins (< 2 hours total)

- [ ] 👤 **Provide education details** for About page:
  - College/University name
  - Degree (e.g., B.Tech Computer Science)
  - Graduation year
  - CGPA (optional but recommended if ≥ 8.0)
  - Reply here or in MANUAL.md section 1

- [ ] 👤 **Set up Google Analytics** (30 min):
  - Create GA4 property → get Measurement ID (G-XXXXXXXX)
  - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` to Vercel env vars
  - Redeploy

- [ ] 👤 **Remove/replace `public/google5c16a36058a0e9e7.html`** — this Google Search Console verification file is a security exposure. Either keep it (if you need GSC) or delete it.

### Priority 2 — Portfolio Quality (2-5 hours)

- [ ] 👤 **Run Lighthouse on your live portfolio** and screenshot results:
  - URL: https://shaileshchaudhari.vercel.app
  - Save screenshot to `public/Images/lighthouse-score.png`

- [ ] 👤 **Write one deep technical blog post** — pick one:
  - Option A: "Building a Real-Time Battle Zone: Redis + Socket.io Inside EduScale"
  - Option B: "My First PR to Next.js — What I Learned Trying to Contribute to Open Source"
  - Add it to `lib/blog-data.ts` and `data/blog-manifest.json`

- [ ] 👤 **Verify all project live links still work**:
  - https://eduscale.vercel.app ← check
  - https://daily-dev-track.vercel.app ← check
  - https://khatago.vercel.app ← check

### Priority 3 — Nice to Have

- [ ] 👤 Add your GitHub activity to display open source contribution attempt in About page bio
- [ ] 👤 Consider adding a `projects/[slug]` detail page for EduScale and Vibe Testing with architecture diagrams

---

## Blocked Tasks (waiting on input)

| Task                   | Blocked on                  |
| ---------------------- | --------------------------- |
| Education section code | Your college/degree details |
| GA fix complete        | Your GA4 Measurement ID     |
| Performance metrics    | Lighthouse screenshots      |
| Deep blog post         | Your writing                |
