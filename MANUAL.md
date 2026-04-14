# Manual Tasks — Things Only You Can Do

Everything that can be automated has been done. This file contains only the tasks that require your credentials, personal information, or your writing.

---

## Section 1 — Education Details (URGENT — unblocks About page)

The Education section is wired into the About page but uses placeholder data. Provide:

```
University/College Name: ___________________
Degree:                  ___________________  (e.g., B.Tech in Computer Engineering)
Graduation Year:         ___________________  (e.g., 2020 - 2024)
CGPA/Percentage:         ___________________  (include only if ≥ 8.0 CGPA or ≥ 75%)
```

Then update [`constants/index.ts`](constants/index.ts) — replace `"YOUR_COLLEGE_NAME"` and adjust the other fields. That's the only file you need to change.

---

## Section 2 — Google Analytics (30 min)

The GA script is wired correctly and only activates when the env var is set.

1. Go to https://analytics.google.com
2. Create Account → Property → Data Stream (Web) → `https://shaileshchaudhari.vercel.app`
3. Copy the **Measurement ID** (`G-XXXXXXXXXX`)
4. Vercel Dashboard → your project → **Settings → Environment Variables**
5. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
6. Redeploy

---

## Section 3 — Google Search Console Verification (15 min)

The verification meta tag is wired to an env var.

1. Go to https://search.google.com/search-console
2. Add property → URL prefix → `https://shaileshchaudhari.vercel.app`
3. Choose **HTML tag** verification method
4. Copy only the `content="..."` value (not the whole tag)
5. Add to Vercel env vars: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = that value
6. Redeploy → click Verify in Search Console

Note: `public/google5c16a36058a0e9e7.html` is already there as a backup verification file.

---

## Section 4 — Run Playwright E2E Tests (after deploy)

The full E2E suite is in `e2e/` covering navigation, SEO schemas, and llms.txt.

To run locally against your dev server:
```bash
npx playwright install --with-deps chromium   # first time only
npm run test:e2e
```

To run with the interactive UI:
```bash
npm run test:e2e:ui
```

Expected: 16 tests across navigation + SEO suites passing.

---

## Section 5 — Write One Deep Technical Blog Post (highest ROI)

Your 17 existing posts are surface-level. One genuinely deep post outweighs all of them.

**Best option — your real experience:**

**Title:** "Building Real-Time Coding Battles: Redis Pub/Sub + Socket.io Inside EduScale"

Structure:
1. Why real-time matters (the UX problem you were solving)
2. Why Redis pub/sub over WebSocket-only or DB polling
3. How you structured the Socket.io rooms (user rooms, battle rooms)
4. The specific latency optimization that got you under 200ms
5. What broke in production (be honest — this makes it credible)
6. What you'd change (Redis Streams vs pub/sub?)

**Alternative — your Next.js PR attempt (directly addresses open source gap):**

**Title:** "My First PR to Next.js: What I Learned Submitting to a Framework"

This is better than silence because it shows you:
- Read framework source code
- Tried to contribute (initiative)
- Got feedback from core team (exposure to engineering bar)
- Learned something (growth)

Add the post to [`lib/blog-data.ts`](lib/blog-data.ts) and [`data/blog-manifest.json`](data/blog-manifest.json).

---

## Section 6 — Lighthouse Performance Proof (1 hour)

Replace the unverified "<200ms" claims with real Lighthouse screenshots.

1. Open Chrome → `https://shaileshchaudhari.vercel.app`
2. DevTools → Lighthouse → Desktop → Analyze
3. Screenshot the score circles → save as `public/Images/lighthouse-portfolio.png`
4. Repeat for `https://eduscale.vercel.app` → `public/Images/lighthouse-eduscale.png`

Then tell me the scores and I'll add them to the project cards.

---

## Section 7 — Verify Live Project URLs (15 min)

Free-tier Supabase/Postgres databases pause after 7 days of inactivity.

| Project | URL | Action if down |
|---------|-----|----------------|
| EduScale | https://eduscale.vercel.app | Unpause DB in Supabase dashboard |
| DevTrack | https://daily-dev-track.vercel.app | Unpause DB in Supabase dashboard |
| KhataGO | https://khatago.vercel.app | Unpause DB in Supabase dashboard |

---

## Priority Order

| Priority | Task | Time |
|----------|------|------|
| 🔴 Now | Fill in education details → update `constants/index.ts` | 5 min |
| 🟠 Today | Set up Google Analytics (Section 2) | 30 min |
| 🟠 Today | Verify all 3 live project URLs (Section 7) | 15 min |
| 🟡 This week | Google Search Console verification (Section 3) | 15 min |
| 🟡 This week | Run Playwright E2E tests locally (Section 4) | 30 min |
| 🟢 This month | Write the deep technical blog post (Section 5) | 3–5 hrs |
| 🟢 This month | Lighthouse screenshots (Section 6) | 1 hr |
