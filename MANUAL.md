# Manual Tasks — Things Only You Can Do

This file contains step-by-step instructions for tasks that require your credentials, personal info, or writing.

---

## Section 1 — Education Details (URGENT — needed to unblock code)

I need the following to add your education section to the About page:

```
University/College Name: ___________________
Degree: ___________________  (e.g., B.Tech in Computer Science)
Graduation Year: ___________________
CGPA/Percentage: ___________________ (only include if ≥ 8.0 CGPA or ≥ 75%)
Location: ___________________ (e.g., Gujarat, India)
Relevant Coursework (optional, 3-5 subjects): ___________________
```

Once you fill this in and tell me, I'll add the full Education section to the About page immediately.

---

## Section 2 — Google Analytics Setup (30 min)

Your portfolio currently has a `GA_MEASUREMENT_ID` placeholder that sends zero data.

**Steps:**
1. Go to https://analytics.google.com
2. Click **Admin** (gear icon, bottom left)
3. Click **Create** → **Account** → fill in "Shailesh Portfolio"
4. Under Account, click **Create Property** → name it "Portfolio"
5. Choose **Web** platform → enter `https://shaileshchaudhari.vercel.app`
6. Copy the **Measurement ID** that starts with `G-` (e.g., `G-ABC123XYZ`)
7. Go to your Vercel Dashboard → your portfolio project → **Settings** → **Environment Variables**
8. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-ABC123XYZ`
9. Redeploy (Vercel → Deployments → Redeploy latest)

The code is already fixed to use this env var — you just need the real value.

---

## Section 3 — Lighthouse Performance Audit (1 hour)

This replaces your unverified "<200ms latency" claims with real proof.

**Steps:**
1. Open Chrome → go to https://shaileshchaudhari.vercel.app
2. Open DevTools (F12) → **Lighthouse** tab
3. Select: Desktop, All categories → click **Analyze page load**
4. Screenshot the results (especially the colored score circles)
5. Save as `public/Images/lighthouse-portfolio.png`

Repeat for:
- https://eduscale.vercel.app → save as `public/Images/lighthouse-eduscale.png`
- https://khatago.vercel.app → save as `public/Images/lighthouse-khatago.png`

Then tell me your scores and I'll add them to the project cards.

---

## Section 4 — Write One Deep Technical Blog Post (3-5 hours)

Your 17 existing blog posts were written in 2 weeks and are surface-level. One genuinely deep post outweighs all 17.

**Recommended Option A: The EduScale Architecture Post**

Title: "Building a Real-Time Coding Battle Zone: Redis, Socket.io, and the Race to <200ms"

Structure:
```
1. Problem: why real-time matters in EdTech
2. Architecture decision: why Redis pub/sub over DB polling
3. The Socket.io room management pattern you used
4. How you hit <200ms (what you measured, what you optimized)
5. What broke in production and how you fixed it
6. What you'd do differently (Redis Streams vs pub/sub)
```

**Recommended Option B: The Open Source PR Post**

Title: "My First PR to Next.js — What Happens When a Junior Dev Opens an Issue"

This is actually a powerful post because:
- It shows you engage with the ecosystem, not just consume it
- It shows humility (PR not merged ≠ failure, it's learning)
- It shows you read framework source code
- Most candidates have never even tried

Structure:
```
1. The bug/issue you found in Next.js
2. How you navigated the Next.js source to find the right file
3. Your fix approach
4. The review feedback you got (if any)
5. Why it wasn't merged (feature flag? better approach existed? still open?)
6. What you learned about how Next.js internals work
```

Once written, add it to `lib/blog-data.ts` and `data/blog-manifest.json`.

---

## Section 5 — Verify Live Project Links (15 min)

Check these URLs manually and fix any that are down:

| Project | URL | Status |
|---------|-----|--------|
| EduScale | https://eduscale.vercel.app | Check |
| DevTrack | https://daily-dev-track.vercel.app | Check |
| KhataGO | https://khatago.vercel.app | Check |

If any are down: redeploy from Vercel dashboard or check if the Supabase/Postgres free tier paused the database (common on free plans after 7 days of inactivity).

---

## Section 6 — Google Search Console Verification File

You have `public/google5c16a36058a0e9e7.html` in your public folder. This is a GSC domain verification file.

**Decision:**
- If you use Google Search Console → keep it (it's working)
- If you don't use GSC → delete this file (it exposes your Google account association)

To check: Go to https://search.google.com/search-console → see if your property is verified.

---

## Section 7 — GitHub Profile Polish (30 min)

Your GitHub profile at https://github.com/shailesh93602 is what interviewers check after your portfolio.

**Quick wins:**
1. Pin your 6 best repos (EduScale, DevTrack, KhataGO + 3 others)
2. Add a profile README (create `shailesh93602/shailesh93602` repo)
3. Make sure EduScale, DevTrack, KhataGO repos have good READMEs with:
   - Live demo link
   - Screenshot/gif
   - Setup instructions
   - Tech stack badges

---

## Priority Order

1. **Right now:** Fill in Section 1 (education details) so I can write the code
2. **Today:** Section 2 (GA setup) — 30 min, huge signal for serious candidates
3. **This week:** Section 3 (Lighthouse) + Section 5 (verify links)
4. **This month:** Section 4 (deep blog post) — this is the highest-ROI writing you can do
5. **Optional:** Sections 6 and 7 — polish layer
