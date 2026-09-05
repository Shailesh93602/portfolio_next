/**
 * Which commit is this deployment actually serving?
 *
 * WHY THIS EXISTS. KhataGO's production deploys failed for a week (from
 * 2026-08-30) and nothing noticed, because every daily check asserted status
 * codes — and the previous deploy kept answering 200 the whole time. A checker
 * can only catch "live is behind main" if live says what commit it is. This
 * portfolio, KhataGO and EduScale now all expose the same shape at
 * `GET /api/version`, and scripts/check-deploy-freshness.mjs compares each
 * against its repository's `main` every morning.
 *
 * WHERE THE VALUES COME FROM, IN ORDER.
 *
 *   1. Vercel's system env at RUNTIME (VERCEL_GIT_COMMIT_SHA / _REF,
 *      VERCEL_ENV) — present in functions when the project exposes them.
 *   2. The same variables BAKED AT BUILD by next.config.ts `env`. The build
 *      step always has them on Vercel, so this is the value that survives a
 *      project where runtime exposure is off. The build timestamp only exists
 *      here.
 *   3. `unknown`. Never a guess, never the request time.
 *
 * The baked reads below MUST stay literal `process.env.NAME` expressions: Next
 * substitutes exactly that syntax at build time, and a dynamic lookup would
 * silently read the (possibly empty) runtime environment instead.
 */

export const UNKNOWN = "unknown";

export type AppVersion = {
  sha: string;
  shortSha: string;
  ref: string;
  /** Build time, ISO-8601 — not request time. */
  deployedAt: string;
  env: string;
};

export type BakedBuildInfo = {
  sha?: string;
  ref?: string;
  env?: string;
  builtAt?: string;
};

export const BUILD_BAKED: BakedBuildInfo = {
  sha: process.env.APP_BUILD_GIT_SHA,
  ref: process.env.APP_BUILD_GIT_REF,
  env: process.env.APP_BUILD_VERCEL_ENV,
  builtAt: process.env.APP_BUILD_TIME,
};

type Env = Record<string, string | undefined>;

function first(...candidates: Array<string | undefined>): string {
  for (const c of candidates) {
    const v = c?.trim();
    if (v) return v;
  }
  return UNKNOWN;
}

export function resolveVersion(
  env: Env = process.env,
  baked: BakedBuildInfo = BUILD_BAKED
): AppVersion {
  const sha = first(env.VERCEL_GIT_COMMIT_SHA, baked.sha);
  return {
    sha,
    shortSha: sha === UNKNOWN ? UNKNOWN : sha.slice(0, 7),
    ref: first(env.VERCEL_GIT_COMMIT_REF, baked.ref),
    deployedAt: first(baked.builtAt),
    env: first(env.VERCEL_ENV, baked.env),
  };
}

/**
 * /api/version response headers. `no-store` because a cached answer defeats
 * the point — a version endpoint a CDN caches reports the OLD commit, the
 * exact blind spot this exists to remove. `noindex` because a JSON blob of a
 * commit hash is nothing a search engine should hold. (app/robots.ts already
 * disallows /api/, so Google never fetches this and never sees the tag; the
 * header covers whatever does fetch it, and costs nothing.)
 */
export function versionResponseHeaders(
  version: AppVersion = resolveVersion()
): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "X-App-Commit": version.sha,
  };
}
