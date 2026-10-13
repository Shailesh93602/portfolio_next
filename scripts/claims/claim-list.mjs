/**
 * The claims scripts/check-project-claims.mjs verifies, and the helpers their
 * checks use. Data, not logic: each entry says where this portfolio states a
 * number (or a mechanism) and where the upstream truth lives.
 */

/**
 * Does `needle` appear inside the body of `methodSignature`?
 *
 * Bounded by the NEXT method declaration rather than by a character count, so
 * the check keeps meaning what it means when the method grows or is
 * reformatted. Class methods here are indented two spaces, which is what marks
 * the boundary.
 */
export function withinMethod(text, methodSignature, needle) {
  const start = text.indexOf(methodSignature);
  if (start === -1) return false;
  const after = text.slice(start + methodSignature.length);
  const nextMethod = after.search(
    /\n {2}(?:public |private |protected |static )*(?:async )?[A-Za-z_$][\w$]*\s*[(=]/
  );
  const body = nextMethod === -1 ? after : after.slice(0, nextMethod);
  return body.includes(needle);
}

/**
 * Each claim names where it can be checked and how.
 *
 * `pattern` runs against the upstream file and must capture the number the
 * upstream currently states. If the pattern stops matching, that is a failure
 * too — it means the upstream reworded and the claim is no longer verifiable,
 * which is exactly when a number starts drifting unnoticed.
 */
export const CLAIMS = [
  {
    what: "BALLAST test count",
    // What this portfolio says — one constant, rendered by the project card,
    // and held against the resume and llms.txt by claims-consistency.test.ts.
    // (It read 197 on three surfaces while the README said 202.)
    localFile: "claims",
    localPattern: /BALLAST_TEST_COUNT = (\d+)/,
    // Where the truth lives.
    repo: "Shailesh93602/ballast",
    path: "README.md",
    sourcePattern: /- \*\*(\d+) tests\*\*/,
  },
  // ── Home page prose ───────────────────────────────────────────────────
  //
  // These use `sourceMustMatch` rather than capturing a number: the claim is
  // that a MECHANISM exists, so the check is that the code implementing it is
  // still there.
  //
  // 🔴 EVERY ONE OF THESE POINTS AT A CALL SITE, NOT AT package.json. A
  // dependency being installed is not a feature being used — that is the exact
  // confusion that produced an unwired audit helper, an unwired retention job
  // and two unwired validation schemas elsewhere in this codebase. Checking the
  // manifest would let every one of these claims stay "true" while the code
  // that made it true was deleted.
  //
  // Verified against DevScale, the PUBLIC mirror of EduScale. The private repo
  // is unreachable to an unauthenticated cron; the mirror is re-synced after
  // every merge batch, so it is the right source for a daily check.
  {
    what: "home page: Redlock guards battle starts",
    localFile: "home",
    localPattern: /(Redlock) over Redis to prevent duplicate battle starts/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/repositories/battleRepository.ts",
    // Not merely "the file mentions a lock" — startBattle must still TAKE one.
    // Removing the lock from that one method is the change this claim is
    // about, and a file-wide search for "withBattleLock" would sail past it,
    // since two other methods also take it.
    //
    // Expressed as "inside startBattle's body" rather than as a character
    // window. My first attempt used /async startBattle[\s\S]{0,800}?/ and
    // reported this true claim as FALSE — the real distance is ~1270
    // characters. A magic number there does not encode the claim, it encodes
    // today's formatting, and it fails the moment someone adds a comment.
    sourceCheck: (text) =>
      withinMethod(text, "async startBattle", "withBattleLock"),
  },
  {
    what: "home page: socket.io Redis adapter",
    localFile: "home",
    localPattern: /(@socket\.io\/redis-adapter) for horizontal scaling/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/services/socket.ts",
    sourceMustMatch: /@socket\.io\/redis-adapter|createAdapter/,
  },
  {
    what: "home page: opossum circuit breaker",
    localFile: "home",
    localPattern: /(opossum) circuit breaker/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/utils/codeExecutor.ts",
    sourceMustMatch: /opossum/,
  },
  {
    what: "home page: prom-client /metrics endpoint",
    localFile: "home",
    localPattern: /(prom-client) \/metrics/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/main.ts",
    // The endpoint, not just the import — a metrics library with no route
    // exposed would make the claim false in the way that matters.
    sourceMustMatch: /['\`"]\/metrics['\`"][\s\S]{0,400}?register\.metrics\(\)/,
  },
  {
    what: "home page: 8 simultaneous deliveries, one stored row",
    localFile: "home",
    // Reworded 2026-09-05. This used to read "produce exactly one ledger
    // write", and the test it points at does not assert that: it counts
    // WhatsappMessage rows and 202s. A claim checker that verifies the NUMBER
    // against a test proving a DIFFERENT property is the subtlest way a true
    // number backs a false sentence. The ledger-level guarantee is the next
    // claim, with its own test.
    localPattern:
      /(\d+) simultaneous deliveries of one message collapse to one stored row/,
    repo: "Shailesh93602/KhataGO",
    path: "tests/integration/whatsapp-webhook.integration.test.ts",
    sourcePattern: /const CONCURRENCY = (\d+);/,
    // KhataGO is private, so an unauthenticated cron gets a 404 and this is
    // reported as UNVERIFIABLE rather than passing quietly. That is the point:
    // it makes the cost of the repo being private visible every day instead of
    // leaving one claim silently unchecked. It starts working by itself the
    // moment the repo goes public (MANUAL item 4).
    privateRepo: true,
  },
  {
    what: "home page: 8 concurrent executors, one ledger row",
    localFile: "home",
    localPattern:
      /(\d+) concurrent executors of one agent write step commit exactly one ledger row/,
    repo: "Shailesh93602/KhataGO",
    // "N concurrent executors of one planned write step produce ONE transaction
    // row and ONE result" — the tool's ledger write and the step's move to
    // DONE are one Postgres transaction, and the move is conditional.
    path: "tests/integration/agent-run.integration.test.ts",
    sourcePattern: /const CONCURRENCY = (\d+);/,
    privateRepo: true,
  },
  {
    what: "BALLAST ledger findings",
    localFile: "claims",
    localPattern: /BALLAST_LEDGER_FINDINGS = (\d+)/,
    repo: "Shailesh93602/ballast",
    path: "docs/LEDGER.md",
    // Counts the rows in the ledger's summary table.
    sourceCount: /^\| L\d+ /gm,
  },
  // The mutation numbers. Added 2026-09-20, after two blog posts were found
  // stating a score of "84.2%" that exists nowhere upstream while the project
  // page stated the real one — the same fact on two surfaces of this site,
  // disagreeing, with nothing watching either.
  {
    what: "BALLAST mutants generated",
    localFile: "claims",
    localPattern: /BALLAST_MUTANTS_TOTAL = (\d+)/,
    repo: "Shailesh93602/ballast",
    path: "docs/MUTATION.md",
    sourcePattern: /- Mutants generated: \*\*(\d+)\*\*/,
  },
  {
    what: "BALLAST mutants killed",
    localFile: "claims",
    localPattern: /BALLAST_MUTANTS_KILLED = (\d+)/,
    repo: "Shailesh93602/ballast",
    path: "docs/MUTATION.md",
    sourcePattern: /- Killed: \*\*(\d+)\*\*/,
  },
  {
    what: "KhataGO Gemini tool count",
    localFile: "claims",
    localPattern: /KHATAGO_TOOL_COUNT = (\d+)/,
    repo: "Shailesh93602/KhataGO",
    path: "lib/ai/tools.ts",
    // One `name: "..."` per declared function tool.
    sourceCount: /^\s*name: "/gm,
    // Private today (see the claim above); checks itself once public.
    privateRepo: true,
  },
  {
    what: "KhataGO eval count",
    localFile: "claims",
    localPattern: /KHATAGO_EVAL_COUNT = (\d+)/,
    repo: "Shailesh93602/KhataGO",
    path: "evals/cases.ts",
    // One `id: "..."` per fixture conversation. The same number is what
    // `npm run evals` reports as its case count under either engine.
    sourceCount: /^\s*id: "/gm,
    privateRepo: true,
  },
  // ── The projects this file did not cover ──────────────────────────────
  //
  // 🔴 EVERY FALSE CLAIM THE LAST AUDIT FOUND WAS IN A PROJECT THIS SCRIPT
  // DID NOT CHECK.
  //
  // It watched BALLAST, KhataGO and the home page. DevTrack, grounded,
  // idempotency-kit, promptproof and CodeSenseiSearch stated a dozen numbers
  // between them and nothing read any of them — so CodeSenseiSearch sat two
  // majors behind ("Next.js 14" against a repo on 16) and described a mock
  // dataset that had been deleted, and idempotency-kit advertised 13 tests
  // for a suite that runs 22. Coverage, not cleverness, is what this file was
  // missing.

  // DevTrack ---------------------------------------------------------------
  {
    what: "DevTrack API route count",
    localPattern: /route handlers \((\d+) API routes\)/,
    repo: "Shailesh93602/devtrack",
    // Counted from the repository TREE, because the claim is about how many
    // files exist — there is no single file that states it, and a number with
    // no upstream reading is exactly the kind this script exists to refuse.
    tree: /^app\/api\/.*\/route\.ts$/,
  },
  {
    what: "DevTrack dashboard queries issued in parallel",
    localPattern: /value: "(\d+) in parallel"/,
    repo: "Shailesh93602/devtrack",
    path: "lib/services/dashboard.ts",
    // The destructuring list in front of `Promise.all([` IS the count. Reading
    // the array would mean parsing nested calls; reading the names it binds is
    // the same number and survives reformatting.
    sourceExtract: (text) => {
      const m = text.match(/const \[([^\]]+)\] = \(await Promise\.all\(\[/);
      if (!m) return null;
      return String(
        m[1]
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean).length
      );
    },
  },
  {
    what: "DevTrack: the live feed is a postgres_changes subscription",
    localPattern:
      /(postgres_changes) subscription on the quoted PascalCase DailyLog table/,
    repo: "Shailesh93602/devtrack",
    path: "hooks/useRealtimeLogs.ts",
    // Presence-shaped: the claim is that the feed is a subscription rather than
    // polling. A `setInterval` refetch would still render a live-looking feed
    // and make the sentence false.
    sourceMustMatch: /postgres_changes/,
  },

  // grounded ---------------------------------------------------------------
  {
    what: "grounded total test count",
    localPattern: /Tests: Vitest — (\d+) tests/,
    repo: "Shailesh93602/grounded",
    tree: /^test\/.*\.test\.ts$/,
    countIn: /^\s*(?:it|test)(?:\.\w+)?\s*\(/gm,
  },
  {
    what: "grounded pgvector tests that skip without a database",
    localPattern: /the (\d+) pgvector tests skip/,
    repo: "Shailesh93602/grounded",
    path: "test/pgvector.test.ts",
    // Only the cases inside `describe.skipIf(!DB_URL)` skip. The file also
    // carries one case in the mirror-image `describe.skipIf(!!DB_URL)` block
    // that runs PRECISELY when the others do not, so a whole-file count would
    // say 10 and quietly make the sentence false.
    sourceExtract: (text) => {
      const gated = text.split(/describe\.skipIf\(!!DB_URL\)/)[0];
      const after = gated.slice(gated.indexOf("describe.skipIf(!DB_URL)"));
      return String((after.match(/^\s*it\(/gm) ?? []).length);
    },
  },

  // idempotency-kit --------------------------------------------------------
  {
    what: "idempotency-kit test count",
    // Was stated as 13 — the count when the card was written — against a suite
    // that runs 22 (7 in rateLimit.test.ts, 15 in idempotency.test.ts).
    localPattern: /Tests: Vitest \((\d+), deterministic\/offline\)/,
    repo: "Shailesh93602/idempotency-kit",
    tree: /^test\/.*\.test\.ts$/,
    countIn: /^\s*(?:it|test)(?:\.\w+)?\s*\(/gm,
  },

  // promptproof ------------------------------------------------------------
  {
    what: "promptproof test count",
    localPattern: /Tests: Vitest \((\d+), offline\)/,
    repo: "Shailesh93602/promptproof",
    tree: /^test\/.*\.test\.ts$/,
    countIn: /^\s*(?:it|test)(?:\.\w+)?\s*\(/gm,
  },

  // CodeSenseiSearch -------------------------------------------------------
  {
    what: "CodeSenseiSearch Next.js major",
    localFile: "claims",
    localPattern: /CODESENSEI_NEXT_MAJOR = (\d+)/,
    repo: "Shailesh93602/CodeSenseiSearch",
    path: "apps/web/package.json",
    sourcePattern: /"next":\s*"[\^~]?(\d+)\./,
  },
  {
    what: "CodeSenseiSearch NestJS major",
    localFile: "claims",
    localPattern: /CODESENSEI_NEST_MAJOR = (\d+)/,
    repo: "Shailesh93602/CodeSenseiSearch",
    path: "apps/api/package.json",
    sourcePattern: /"@nestjs\/common":\s*"[\^~]?(\d+)\./,
  },
  {
    what: "CodeSenseiSearch: chunking really walks the TypeScript AST",
    localPattern: /walking the (TypeScript compiler API)/,
    repo: "Shailesh93602/CodeSenseiSearch",
    path: "apps/api/src/workers/code-chunker.ts",
    // The distinction the card is MAKING is AST vs fixed-size. If the compiler
    // import goes, the chunker is character-based and the sentence is false.
    sourceMustMatch: /from 'typescript'|from "typescript"/,
  },
  {
    what: "CodeSenseiSearch: the UI calls the API, not a mock dataset",
    localPattern: /typed client rather than a (mock dataset)/,
    repo: "Shailesh93602/CodeSenseiSearch",
    path: "apps/web/src/lib/hooks/use-search.ts",
    // This claim replaced "search UI against a mock dataset", which had been
    // true and stopped being true when `mock-data.ts` was deleted. It can go
    // stale in the other direction just as easily.
    sourceMustMatch: /apiClient/,
  },

  // ── GeeksforGeeks ─────────────────────────────────────────────────────
  //
  // The site says "650+ problems solved on GeeksforGeeks" — the volume, and
  // only the volume. The "Institute Rank 1" half was dropped on 2026-09-06
  // (see lib/profile.ts), so the institute_rank field is no longer checked:
  // this file verifies what is claimed, and checking a number nothing states
  // is how a check goes stale without anyone noticing.
  //
  // The profile page is a Next.js app whose RSC payload embeds the profile
  // record as JSON — `"total_problems_solved":650` — so the field is matched
  // by its JSON key rather than by page structure. If GfG moves it, the claim
  // becomes UNVERIFIABLE (a warning that names the reason), not a failure: a
  // page redesign is not a false claim, and scraping the rendered HTML
  // instead would make this the flakiest check in the file.
  //
  // "650+" is a floor, so the comparison is `atLeast`: the upstream figure may
  // grow past the stated one without making the claim false. It is reported
  // when it does, so the number can be raised.
  {
    what: "GeeksforGeeks problems solved (stated as a floor)",
    localFile: "profile",
    localPattern: /problemsSolved: (\d+)/,
    url: "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
    // The JSON is string-escaped inside the RSC script tag, hence the optional
    // backslash before the closing quote.
    sourcePattern: /total_problems_solved\\?":(\d+)/,
    compare: "atLeast",
    fragile: true,
  },
];
