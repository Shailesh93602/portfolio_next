# OSS Contribution Plan — 2026-04-20

Goal: land **1-2 merged PRs before Jul 18, 2026** to clear the "has-OSS-PR" filter for Vercel / Supabase / Stripe applications. Each target repo has been scanned for concrete, shippable opportunities.

Repos cloned shallow to `~/Desktop/Coding/OSS/`: `shadcn-ui`, `supabase-js`, `stripe-node`. `vercel/next.js` surveyed via `gh` (clone was too large for local disk).

---

## Recommendation — ship this ONE first

**🎯 stripe/stripe-node Target 1 — `StripeSignatureVerificationError` step/cause fields**

- **Effort:** ~1.5 hr
- **Why this one:** perfect stack-match with `stripe-payments-demo`. You've already written the exact code that catches these errors in production. The PR is tiny (extend one class, add 3 error codes, update docs), low review risk, and the commit story is airtight: "I built a Stripe webhook receiver and hit this exact diagnostics gap — here's the fix."
- **Target:** Stripe (primary employer target)
- **First PR sentence:** _Add `step` and `cause` fields to `StripeSignatureVerificationError` to distinguish timestamp-tolerance failures from HMAC mismatches, enabling smarter retry logic in webhook handlers._

If it lands: proof-of-work for Stripe applications. If review takes too long, switch to shadcn starter (below) to guarantee a merge in parallel.

---

## Full target matrix (1 per repo)

### 1. shadcn-ui/ui

**Clone:** `~/Desktop/Coding/OSS/shadcn-ui`

**Target — Starter (0.5 hr):**
- **Files:** `apps/v4/examples/radix/data-table-demo.tsx:204`, `apps/v4/examples/base/data-table-demo.tsx:206`, `apps/v4/app/(app)/examples/tasks/components/data-table-toolbar.tsx:25`
- **Defect:** Filter `<Input>`s have placeholder but no `aria-label`. Placeholder alone fails WCAG 2.1 SC 4.1.2.
- **Why it matters:** These examples get copy-pasted into thousands of downstream apps.
- **First PR sentence:** _Add aria-label to data table filter inputs for WCAG 4.1.2 compliance._

**Medium (2 hr):** `alert.tsx` destructive description uses `text-destructive/90` ≈ 4.51:1 contrast — borderline AA. Files in `apps/v4/registry/*/ui/alert.tsx`.

**Reach (6 hr):** `separator.tsx` uses custom Tailwind variants `data-horizontal`/`data-vertical` that only work if `shadcn/tailwind.css` is imported. Replace with standard `data-[orientation=horizontal]` selectors for framework-agnostic behaviour.

---

### 2. supabase/supabase-js

**Clone:** `~/Desktop/Coding/OSS/supabase-js`

**Target — Starter (1.5 hr):**
- **File:** `packages/core/realtime-js/src/lib/transformers.ts:223-229`
- **Defect:** `toArray()` JSON-parses Postgres array columns with a fragile "wrap in `[...]` and `JSON.parse`" approach. Falls back to naive comma-split on failure — mangles quoted strings or escaped commas.
- **Why it matters (stack-match):** realtime-js powers DevTrack's `postgres_changes` subscription. Array columns with commas (e.g., `['socket,error', 'retry']`) silently corrupt.
- **First PR sentence:** _Replace naive JSON fallback in `toArray()` with a proper Postgres array parser handling quoted strings and escape sequences._

**Medium (5 hr):** `packages/core/realtime-js/src/lib/websocket-factory.ts:19-22,42-44` — `WebSocketLike` interface uses bare `any` in 4 event-handler slots. Replace with typed generics. Stack-matches the circuit-breaker/retry work in EduScale.

**Reach (10-12 hr):** Issue **#1599** (open, `realtime-js`) — premature `SUBSCRIBED` race condition. Events sent immediately after `SUBSCRIBED` are silently missed because logical replication initializes asynchronously. Needs a secondary readiness handshake. EduScale's Redlock + auto-renewal experience is exactly the pattern — high-signal but deep work.

---

### 3. stripe/stripe-node

**Clone:** `~/Desktop/Coding/OSS/stripe-node`

**Target — Starter (1.5 hr) ← RECOMMENDED FIRST PR:**
- **Files:** `src/Error.ts:225-238`, `src/Webhooks.ts:420-456`
- **Defect:** `StripeSignatureVerificationError` stores header + payload but exposes no `step` or `code` field, so callers can't tell "timestamp too old" (transient — maybe retry) from "HMAC mismatch" (permanent — wrong secret).
- **Why it matters (stack-match):** stripe-payments-demo implements exactly this retry-vs-reject decision. You already have the mental model.
- **First PR sentence:** _Add `step` and `cause` fields to `StripeSignatureVerificationError` to distinguish timestamp-tolerance failures from HMAC mismatches._

**Medium (5 hr):** `src/Webhooks.ts:237-239,283-285,391-398` + `README.md:394-432` — default `tolerance=0` (skips timestamp checks). Persistent TODO notes it should default to `DEFAULT_TOLERANCE=300`. Docs never mention it. Clarify docs + add deprecation warning + README example.

**Reach (10 hr):** Issue **#2661** — `StripeIdempotencyError` has no typed fields for the conflicting idempotency key, conflicting request ID, or retry guidance. Extend the type hierarchy. Directly stack-matches your SETNX idempotency work.

---

### 4. vercel/next.js

**Not cloned (too large). Survey via `gh` only.**

**Target — Starter (2 hr):** Issue **#53473** — `@next/next/no-html-link-for-pages` ESLint rule ignores custom `pageExtensions` (e.g., `.mdx`). Small plugin-file fix.

**Target — Medium (4-8 hr) ← PLAYWRIGHT DIFFERENTIATOR:**
- **Proposed:** new `examples/with-playwright-turbopack-e2e`
- **Why:** existing `examples/with-playwright` is bare-bones — no auth, no DB, no Turbopack specifics. You write Playwright daily at ContextQA; this is the skill Vercel hiring would quote.
- **Skeleton:**
  - `playwright.config.ts` (Turbopack build instructions, multi-project for auth-needed vs anon)
  - `app/(public)/` + `app/(protected)/` with a Server-Action-powered login
  - `prisma/schema.prisma` + `prisma/seed.ts` (sqlite for CI portability)
  - `tests/auth.spec.ts` + `tests/protected-route.spec.ts`
  - README explaining: when to use Turbopack dev vs next start, how to seed deterministically, how to mock external services
- **First PR sentence:** _Add comprehensive Playwright + Turbopack + Auth example demonstrating deterministic E2E patterns for App Router._

**Target — Reach (10+ hr):** Issue **#92867** — Turbopack path-based glob in `turbopack.rules` doesn't match `require.context` patterns. Touches bundler glob resolution. Reproducible repro exists.

**Bonus stack-match issues:** #71773 (Playwright testmode broke in 15), #67205 (Playwright + MSW TypeError), #92689 (App Router double-fetch chunks).

---

## Sequencing

Week of 2026-04-21:
1. Open `stripe-node` Target 1 PR. ~1.5 hr including tests + PR body.
2. In parallel, open `shadcn-ui` Target 1 PR (0.5 hr) as a hedge.

Week of 2026-04-28 (only if both above are stuck in review):
3. Open `supabase-js` Target 1 PR (1.5 hr, transformers.ts).

Next 6 weeks (only after one of the above lands):
4. Medium-scope PR from whichever upstream maintainer was responsive.
5. Write the `with-playwright-turbopack-e2e` example for `vercel/next.js` — keep this in-pocket until you have a merged PR under your belt in any of the other three; examples get merged but maintainers bias toward contributors with prior landings.

## Process reminders

- **Fork first, never push to the upstream clone.** `gh repo fork --remote`.
- **Ship the smallest coherent patch.** No drive-by cleanups, no "while I'm here" refactors.
- **PR body format:** What broke (1-2 sentences) / Why the fix (1-2 sentences) / Code refs (file:line) / Test plan (what you ran).
- **Link from `stripe-payments-demo`'s case study** to your merged Stripe PR once it lands — that's the portfolio loop.

## Not on this list (deliberately)

- Big framework (Nest, React, Vue) core — review queues are saturated, low odds of landing before Jul.
- Anything where the issue title says "design decision needed" / "discussion" — those stall.
- Docs typo PRs — they merge, but the signal is near-zero for hiring.
