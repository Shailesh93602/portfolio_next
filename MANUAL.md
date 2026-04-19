# MANUAL.md — Tasks Requiring Your Action (Next 3 Months)

All tasks here require your credentials, accounts, original writing, or external actions.
Nothing here can be done by code alone.

See TODO.md for all code-executable tasks. See PLAN.md for strategic context.

---

## Priority Queue (in order — do these before applying anywhere)

| #   | Task                             | Time    | Unlocks                                     |
| --- | -------------------------------- | ------- | ------------------------------------------- |
| 2   | Verify 3 live project URLs       | 15 min  | Don't let Supabase pause during recruiter   |
| 3   | Google Analytics setup           | 30 min  | Shows you instrument your own products      |
| 4   | Write EduScale architecture post | 3–4 hrs | Highest ROI task — proves distributed depth |
| 5   | Deploy redis-battle-demo         | 1 hr    | Makes distributed demo publicly visible     |
| 6   | Write KhataGO fintech post       | 2–3 hrs | Required for Skydo and Stripe               |
| 7   | Write Postgres/RBAC post         | 3–4 hrs | Required for Supabase application           |
| 8   | Write Vercel/ISR post            | 2–3 hrs | Required for Vercel application             |
| 9   | Update resume PDF                | 30 min  | Must match portfolio                        |
| 10  | LinkedIn update                  | 1–2 hrs | Recruiters check this before GitHub         |
| 11  | One OSS PR merged                | ongoing | Required for Vercel; improves all profiles  |

---

### 2. Verify Live Project URLs — 15 min

Free-tier Supabase pauses after 7 days of inactivity. If a recruiter clicks your project
and sees "Error establishing DB connection," they don't investigate — they move on.

Do this check every 2 weeks. Add a calendar reminder.

| Project           | URL                                  | Fix if down                          |
| ----------------- | ------------------------------------ | ------------------------------------ |
| EduScale          | `https://eduscale.vercel.app`        | Supabase dashboard → Restore project |
| DevTrack          | `https://daily-dev-track.vercel.app` | Supabase dashboard → Restore project |
| KhataGO           | `https://khatago.vercel.app`         | Supabase dashboard → Restore project |
| CareerGlyph       | add URL once deployed                | Railway/Render restart               |
| redis-battle-demo | add URL once deployed (Task 6)       | Railway restart                      |

---

### 4. Write EduScale Architecture Blog Post — 3–4 hrs (highest ROI task)

**The stub is ready.** File: `content/blog/eduscale-redis-distributed-locks-real-time.mdx`

The code scaffolding, section headings, and `<!-- TODO: -->` prompts are written.
You only need to replace the `[FILL IN:]` placeholders.

**The sections that matter most:**

- "The Race Condition" — describe the exact scenario: two instances, same battle tick,
  both fire, score doubles. Be specific about which state was corrupted.
- "The Circuit Breaker" — paste the actual opossum config: timeout, errorThreshold,
  resetTimeout. What service does it wrap? What does the fallback return?
- "What Broke in Production" — one specific incident. The value is YOUR mistake, not a
  generic description. This is what separates your post from AI-generated content.
- "What I'd Do Differently" — genuine reflection, not "I'd add more tests."

**After filling in:**

```bash
# Tell Claude to run these:
npm run generate-blog-manifest
# Then uncomment the slug in lib/blog-data.ts BLOG_SLUGS
```

**Do not use ChatGPT to fill in the sections.** Interviewers recognize AI-generated posts.

---

### 5. Get One OSS Contribution Merged — Ongoing (target: by Jun 18)

"0 OSS merged PRs" is visible on your GitHub profile. One merged PR changes the conversation.

**Best targets for your stack:**

1. **shadcn/ui** (`shadcn-ui/ui`) — look for:
   - Missing ARIA attributes on existing components
   - TypeScript type improvements in components you use (Button, Card, Badge)
   - Documentation gaps in `apps/www/content/docs/`

2. **Supabase JS** (`supabase/supabase-js`) — high signal for Supabase applications
   - Missing TypeScript generics, edge case error handling

3. **Socket.io** — you know the internals now from redis-battle-demo
   - Documentation improvements, TypeScript types

**Process:**

1. Clone the repo, run tests locally (this alone eliminates 80% of contributors)
2. Find one specific bug or missing piece — not cosmetic
3. Smallest possible fix, well-tested
4. PR description: what was broken, why your fix is correct, link to the relevant code

---

## Month 2: May 18 – Jun 18, 2026

### 6. Deploy redis-battle-demo on Railway — 1 hr

Claude has added `railway.toml` and `REDIS_URL` support (TODO.md §2A).
You just need to provision it.

**Steps:**

3. Add Redis plugin (Railway provides managed Redis)
4. Set env vars: `REDIS_URL` = Railway Redis URL (auto-filled by plugin), `NODE_ENV=production`
5. Railway auto-assigns a URL — copy it
6. Tell Claude: "deploy URL is https://redis-battle-demo-xxx.railway.app"
   Claude will update the portfolio card `live:` field

**For two-instance demo (optional but impressive):**
Railway supports multiple replicas on the same service. Set replicas to 2.
The distributed lock visualization in the UI shows which instance won each tick.

---

### 7. Write KhataGO Fintech Post — 2–3 hrs

**The stub is ready.** File: `content/blog/khatago-webhook-deduplication-receipt-pipeline.mdx`

**Sections to fill:**

- "How Often Meta Sends Duplicates" — real numbers from your production logs
- "The Deduplication Middleware" — paste the actual Redis SET NX code with your TTL and why
- "The OCR Prompt" — paste the actual Gemini prompt you send, and a real Tally XML example output
- "Idempotency at Each Stage" — describe what happens if each Bull queue stage fires twice
- "What Broke" — one specific production incident (wrong amount recorded? duplicate transaction?)

---

### 8. Write Postgres/RBAC Post — 3–4 hrs

**The stub is ready.** File: `content/blog/postgres-rbac-eduscale-permissions.mdx`

**Sections to fill:**

- The specific pain point that triggered the RBAC refactor
- Paste the actual Prisma schema or SQL DDL for your roles/features/permissions tables
- Paste the actual permission check query + your index strategy (EXPLAIN ANALYZE output if you have it)
- Whether you used RLS anywhere — be honest if you didn't, explain the tradeoff

---

## Month 3: Jun 18 – Jul 18, 2026

### 9. Update Resume PDF — 30 min

The portfolio links to `/Shailesh_Chaudhari_Resume.pdf`. Update it to match what's now in
the portfolio, especially EduScale architecture depth, CareerGlyph, stripe-payments-demo.

**Specific lines to update:**

- ContextQA: "~1,900 merged PRs (Vibe Testing extension), ~1,600 merged PRs (AxeTos)"
- EduScale: "@socket.io/redis-adapter, redlock, opossum (circuit breaker), prom-client"
- KhataGO: "WhatsApp Business API, Gemini AI OCR, Tally ERP XML, Redis webhook deduplication"
- Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
- Skills: add "Redis Cluster/Pub-Sub", "Socket.io", "Prometheus", "Circuit Breaker Pattern"

**After updating:**

1. Export as PDF — filename must stay `Shailesh_Chaudhari_Resume.pdf`
2. Replace `public/Shailesh_Chaudhari_Resume.pdf`
3. `git add public/Shailesh_Chaudhari_Resume.pdf && git commit -m "docs: update resume PDF"`

---

### 10. LinkedIn Profile Update — 1–2 hrs

LinkedIn is the first thing recruiters check. It currently doesn't reflect the EduScale
architecture depth or KhataGO's real stack.

**Specific updates:**

1. ContextQA description: add "~1,900 merged PRs on Vibe Testing Chrome extension,
   ~1,600 merged PRs on AxeTos accessibility extension"
2. EduScale description: "@socket.io/redis-adapter, redlock (distributed locks),
   opossum (circuit breaker), prom-client (Prometheus /metrics)"
3. KhataGO description: "WhatsApp Business API, Google Gemini AI OCR, Tally ERP XML export,
   Redis-backed webhook deduplication"
4. Projects: add CareerGlyph, redis-battle-demo, stripe-payments-demo
5. Featured: pin the EduScale architecture post after it's published (Task 4)
6. Skills: add "Redis (Cluster, Pub/Sub)", "Socket.io", "Prometheus", "Stripe Webhooks"

---

### 11. Write Vercel/ISR Performance Post — 2–3 hrs

**The stub is ready.** File: `content/blog/nextjs-isr-edge-caching-performance.mdx`

**Before writing, run these measurements and fill them in:**

1. Run `pagespeed.web.dev` on `https://shaileshchaudhari.vercel.app`
   → fill in the LCP, INP, CLS values in the Core Web Vitals table
2. Run Lighthouse on the deployed site → record one specific finding
3. Measure AVIF vs WebP size for `public/Images/shailesh.webp` (use Squoosh or ImageOptim)
   → fill in the before/after size numbers

---

## Application Readiness Checklist

**Before applying to any company, all items in that row must be ✅:**

| Company  | Required before applying                                                      |
| -------- | ----------------------------------------------------------------------------- |
| Skydo    | KhataGO public ✅, KhataGO README ✅, KhataGO fintech post ✅, 3 live URLs ✅ |
| Stripe   | KhataGO post ✅, stripe-payments-demo live ✅, resume updated ✅              |
| Vercel   | OSS PR merged ✅, EduScale post ✅, Vercel/ISR post ✅, resume updated ✅     |
| Supabase | Postgres/RBAC post ✅, EduScale post ✅, DevTrack Realtime ✅                 |

---

## Add CodeSenseiSearch Screenshot — 15 min (when convenient)

The CodeSenseiSearch portfolio card uses a placeholder image. Once Claude deploys
it to Railway (TODO.md §2B):

1. Navigate to the live Swagger UI (`/api`)
2. Make a sample semantic search query
3. Screenshot the response
4. Save as `public/Images/codesensei-search.png`
5. Tell Claude: "update CodeSenseiSearch card image to /Images/codesensei-search.png"
