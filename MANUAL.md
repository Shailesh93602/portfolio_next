# MANUAL.md — Tasks Requiring Your Action (Next 3 Months)

All tasks here require your credentials, accounts, external actions, or original writing.
Nothing here can be done by code alone.

See TODO.md for all code-executable tasks.

---

## Priority Queue (in order — do these before applying anywhere)

| #   | Task                                              | Time   | Unlocks                                      |
| --- | ------------------------------------------------- | ------ | -------------------------------------------- |
| 1   | Verify 3 live project URLs                        | 15 min | Don't let Supabase pause during recruiter    |
| 2   | Google Analytics setup                            | 30 min | Shows you instrument your own products       |
| 3   | Add 6 GitHub secrets for Supabase keep-alive cron | 10 min | Unblocks TODO 1E (auto keep-alive workflow)  |
| 4   | Deploy redis-battle-demo (Render or Fly)          | 1 hr   | Makes distributed demo publicly visible      |
| 5   | Deploy stripe-payments-demo (Render or Fly)       | 1 hr   | Stripe application needs a live artifact     |
| 6   | Apply EduScale middleware fix to Exavel copy      | 15 min | Production parity for second EduScale deploy |
| 7   | Update resume PDF                                 | 30 min | Must match portfolio                         |
| 8   | LinkedIn update                                   | 1–2 hr | Recruiters check this before GitHub          |
| 9   | One OSS PR merged                                 | ongoing| Required for Vercel; improves all profiles   |

---

### 1. Verify Live Project URLs — 15 min

Free-tier Supabase pauses after 7 days of inactivity. If a recruiter clicks your project
and sees "Error establishing DB connection," they don't investigate — they move on.

Do this check every 2 weeks until Task 3 lands (then it's automated).

| Project              | URL                                  | Fix if down                          |
| -------------------- | ------------------------------------ | ------------------------------------ |
| EduScale             | `https://eduscale.vercel.app`        | Supabase dashboard → Restore project |
| DevTrack             | `https://daily-dev-track.vercel.app` | Supabase dashboard → Restore project |
| KhataGO              | `https://khatago.vercel.app`         | Supabase dashboard → Restore project |
| CareerGlyph          | add URL once deployed                | Render/Fly restart                   |
| redis-battle-demo    | add URL once deployed (Task 4)       | Render/Fly restart                   |
| stripe-payments-demo | add URL once deployed (Task 5)       | Render/Fly restart                   |

---

### 3. Add 6 GitHub Secrets for Supabase Keep-Alive Workflow — 10 min

A GitHub Actions cron is being created in parallel that pings each Supabase project
daily so they never auto-pause. It needs these secrets.

URL: `https://github.com/Shailesh93602/portfolio_next/settings/secrets/actions`

Add all 6:

- `EDUSCALE_SUPABASE_URL`
- `EDUSCALE_SUPABASE_ANON_KEY`
- `DEVTRACK_SUPABASE_URL`
- `DEVTRACK_SUPABASE_ANON_KEY`
- `KHATAGO_SUPABASE_URL`
- `KHATAGO_SUPABASE_ANON_KEY`

Values live in each project's Supabase dashboard → Project Settings → API.

---

### 4. Deploy redis-battle-demo — 1 hr (Render.com free tier or Fly.io)

Railway free trial exhausted. Recommended: **Render.com** (simpler) or **Fly.io** (better for multi-instance demo).

**Render.com path:**

1. Create Web Service from `Shailesh93602/redis-battle-demo`
2. Add Redis (Render has free managed Redis)
3. Env: `REDIS_URL` = Render Redis URL, `NODE_ENV=production`
4. Copy the assigned URL
5. Tell Claude: "redis-battle-demo live at https://..." — Claude updates the portfolio card

**Fly.io path (needed if you want 2 instances for the distributed-lock visualization):**

1. `fly launch` in the repo (Dockerfile already present)
2. `fly redis create` → copy URL into `fly secrets set REDIS_URL=...`
3. `fly scale count 2` for two instances
4. Copy URL, report back

---

### 5. Deploy stripe-payments-demo — 1 hr

Same choice: Render.com or Fly.io.

1. Provision Node web service from `Shailesh93602/stripe-payments-demo`
2. Add managed Redis (webhook dedup needs it)
3. Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `REDIS_URL`, `NODE_ENV=production`
4. In Stripe Dashboard → Developers → Webhooks, add the deployed `/webhook` endpoint,
   copy the signing secret back into `STRIPE_WEBHOOK_SECRET`
5. Report URL to Claude for portfolio + README updates

---

### 6. Apply EduScale Middleware Fast-Path Fix to Exavel Copy — 15 min

The fast-path fix (skip `getUser()` for purely public routes) is applied to
`/Users/shaileshchaudhary/Desktop/Coding/EduScale/Frontend/src/utils/supabase/middleware.ts`.

Exavel has a fork of the same code that also needs it:

- File: `/Users/shaileshchaudhary/Desktop/Coding/Development/Exavel/EduScale/Frontend/src/utils/supabase/middleware.ts`
- Action: diff the two files, port the fast-path block into the Exavel copy
- Deploy: whatever deploy flow Exavel uses (Vercel/own infra — you know which)
- Verify: public pages load without the middleware timeout that originally motivated the fix

---

### 7. Update Resume PDF — 30 min

The portfolio links to `/Shailesh_Chaudhari_Resume.pdf`. Keep it in sync.

**Specific lines to update:**

- ContextQA: "~1,900 merged PRs (Vibe Testing extension), ~1,600 merged PRs (AxeTos)"
- EduScale: "@socket.io/redis-adapter, redlock, opossum (circuit breaker), prom-client"
- KhataGO: "WhatsApp Business API, Gemini AI OCR, Tally ERP XML, Redis webhook deduplication"
- Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
- Skills: add "Redis Cluster/Pub-Sub", "Socket.io", "Prometheus", "Circuit Breaker Pattern"

**After updating:**

1. Export as PDF — filename stays `Shailesh_Chaudhari_Resume.pdf`
2. Replace `public/Shailesh_Chaudhari_Resume.pdf`
3. Commit: `docs: update resume PDF`

---

### 8. LinkedIn Profile Update — 1–2 hrs

LinkedIn is the first thing recruiters check.

1. ContextQA: add "~1,900 merged PRs Vibe Testing; ~1,600 merged PRs AxeTos"
2. EduScale: "@socket.io/redis-adapter, redlock (distributed locks), opossum (circuit breaker),
   prom-client (Prometheus /metrics)"
3. KhataGO: "WhatsApp Business API, Google Gemini AI OCR, Tally ERP XML export,
   Redis-backed webhook deduplication"
4. Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
5. Featured: pin the EduScale portfolio detail page (since public blog is blocked)
6. Skills: add "Redis (Cluster, Pub/Sub)", "Socket.io", "Prometheus", "Stripe Webhooks"

---

### 9. Get One OSS Contribution Merged — Ongoing (target: by Jul 18)

"0 OSS merged PRs" is visible on your GitHub profile. One merged PR changes the conversation.

**Best targets for your stack:**

1. **shadcn/ui** (`shadcn-ui/ui`) — missing ARIA, type improvements, docs gaps
2. **Supabase JS** (`supabase/supabase-js`) — high signal for Supabase applications
3. **Socket.io** — you know internals now from redis-battle-demo

**Process:**

1. Clone, run tests locally (this alone eliminates 80% of contributors)
2. Find one specific bug — not cosmetic
3. Smallest possible fix, well-tested
4. PR description: what was broken, why the fix is correct, link to the relevant code

---

## Month 3: Jun 19 – Jul 19, 2026

### 10. Tailored Application Packets — 3 hrs total

For each of Stripe, Vercel, Supabase:

- One-page cover letter referencing their engineering blog (read 5 posts first)
- Resume variant emphasizing relevant projects (Stripe → stripe-payments-demo + KhataGO;
  Vercel → portfolio itself + Next.js demos; Supabase → DevTrack + CareerGlyph)
- Send via referral if possible (check LinkedIn for 1st/2nd connections)

---

## Application Readiness Checklist

**Before applying to any company, all items in that row must be done:**

| Company  | Required before applying                                                               |
| -------- | -------------------------------------------------------------------------------------- |
| Skydo    | KhataGO public, KhataGO case study page expanded, 3 live URLs green                    |
| Stripe   | stripe-payments-demo live, case study page expanded, resume updated                    |
| Vercel   | OSS PR merged, performance pass done, Vercel-aligned demo shipped, resume updated      |
| Supabase | Supabase-aligned demo shipped, DevTrack Realtime live, CareerGlyph RBAC case study up  |

---

## Add CodeSenseiSearch Screenshot — 15 min (when convenient)

The CodeSenseiSearch portfolio card uses a placeholder image.

1. Navigate to the live Swagger UI (`/api`)
2. Make a sample semantic search query
3. Screenshot the response
4. Save as `public/Images/codesensei-search.png`
5. Tell Claude: "update CodeSenseiSearch card image to /Images/codesensei-search.png"
