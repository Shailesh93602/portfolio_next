/**
 * @jest-environment node
 *
 * GET /api/version and lib/version.ts.
 *
 * The property under test is not "it returns JSON". It is that a checker can
 * trust the answer: every field comes from the platform or reads `unknown`,
 * nothing is computed per request, and the response is neither cacheable nor
 * indexable. A version endpoint that a CDN caches reports the OLD commit —
 * the exact blind spot scripts/check-deploy-freshness.mjs exists to remove.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { GET } from "@/app/api/version/route";
import { resolveVersion, UNKNOWN, versionResponseHeaders } from "@/lib/version";

const SHA = "0538bcd9585f2a157d7dc8b338748f2bace16f47";

describe("resolveVersion", () => {
  it("reads Vercel's runtime system env and derives shortSha", () => {
    const v = resolveVersion(
      {
        VERCEL_GIT_COMMIT_SHA: SHA,
        VERCEL_GIT_COMMIT_REF: "main",
        VERCEL_ENV: "production",
      },
      { builtAt: "2026-09-05T10:00:00.000Z" }
    );
    expect(v).toEqual({
      sha: SHA,
      shortSha: "0538bcd",
      ref: "main",
      deployedAt: "2026-09-05T10:00:00.000Z",
      env: "production",
    });
  });

  it("falls back to the values baked at build when runtime env is absent", () => {
    const v = resolveVersion(
      {},
      {
        sha: SHA,
        ref: "main",
        env: "production",
        builtAt: "2026-09-05T10:00:00.000Z",
      }
    );
    expect(v.sha).toBe(SHA);
    expect(v.shortSha).toBe("0538bcd");
    expect(v.ref).toBe("main");
    expect(v.env).toBe("production");
  });

  it("prefers runtime env over the baked copy when both exist", () => {
    const v = resolveVersion(
      { VERCEL_GIT_COMMIT_SHA: SHA, VERCEL_GIT_COMMIT_REF: "main" },
      { sha: "f".repeat(40), ref: "stale-branch" }
    );
    expect(v.sha).toBe(SHA);
    expect(v.ref).toBe("main");
  });

  it("reports `unknown` — never a guess — when nothing is provided", () => {
    const v = resolveVersion({}, {});
    expect(v).toEqual({
      sha: UNKNOWN,
      shortSha: UNKNOWN,
      ref: UNKNOWN,
      deployedAt: UNKNOWN,
      env: UNKNOWN,
    });
  });

  it("treats empty and whitespace-only values as absent", () => {
    // next.config.ts bakes "" when the variable is missing locally; that must
    // not become an empty sha the checker then compares against main.
    const v = resolveVersion(
      { VERCEL_GIT_COMMIT_SHA: "  " },
      { sha: "", ref: "" }
    );
    expect(v.sha).toBe(UNKNOWN);
    expect(v.ref).toBe(UNKNOWN);
  });
});

describe("versionResponseHeaders", () => {
  it("is uncacheable, unindexable and carries the commit", () => {
    const h = versionResponseHeaders({
      sha: SHA,
      shortSha: "0538bcd",
      ref: "main",
      deployedAt: UNKNOWN,
      env: "production",
    });
    expect(h["Cache-Control"]).toBe("no-store");
    expect(h["X-Robots-Tag"]).toMatch(/noindex/);
    expect(h["X-App-Commit"]).toBe(SHA);
  });
});

describe("GET /api/version", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("serves the resolved version as JSON with the contract headers", async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = SHA;
    process.env.VERCEL_GIT_COMMIT_REF = "main";
    process.env.VERCEL_ENV = "production";
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-robots-tag")).toMatch(/noindex/);
    expect(res.headers.get("x-app-commit")).toBe(SHA);
    const body = await res.json();
    expect(body).toMatchObject({
      sha: SHA,
      shortSha: "0538bcd",
      ref: "main",
      env: "production",
    });
    // The field a checker reads must be a full 40-hex sha, never a short one.
    expect(body.sha).toMatch(/^[0-9a-f]{40}$/);
  });

  it("is declared dynamic so it is never pre-rendered into a stale answer", () => {
    // Read from disk: a `dynamic` export that was removed would still let
    // every test above pass while the built route served a build-time
    // snapshot of a value that is supposed to describe THIS deployment.
    const src = readFileSync(
      join(process.cwd(), "app", "api", "version", "route.ts"),
      "utf8"
    );
    expect(src).toMatch(/export const dynamic = "force-dynamic"/);
  });

  it("is baked by next.config.ts from Vercel's build-time git env", () => {
    const cfg = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(cfg).toMatch(
      /APP_BUILD_GIT_SHA:\s*process\.env\.VERCEL_GIT_COMMIT_SHA/
    );
    expect(cfg).toMatch(
      /APP_BUILD_GIT_REF:\s*process\.env\.VERCEL_GIT_COMMIT_REF/
    );
  });
});
