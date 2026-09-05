/**
 * deploy-freshness-decision.mjs
 *
 * The decision half of scripts/check-deploy-freshness.mjs, with no I/O of its
 * own: every fact arrives as an argument or through a probe the caller
 * supplies, and the clock is injected. That is what lets the unit tests pin
 * the six shapes that matter (fresh, deploying, stale, 404 inside and outside
 * the grace window, private) without a network and without waiting.
 *
 * THE GRACE WINDOW. A Vercel production build takes a few minutes, so for a
 * few minutes after a merge, live is legitimately behind main. Without a
 * window, a check that runs right after a merge fails on a deploy in flight:
 * the 404 rule trips the moment a PR adding /api/version lands, and a served
 * sha one commit behind reads as a defect. Inside the window those shapes are
 * reported as `deploying` — exit 0 with a warning — and outside it they are
 * failures exactly as before.
 *
 * WHAT THE WINDOW IS MEASURED FROM — and why not `main` HEAD. The obvious
 * anchor is the time of main's HEAD commit. It is wrong: any fresh commit to
 * main would then excuse an arbitrarily old build for the length of the
 * window. On 2026-09-05 at 15:29Z an unrelated commit landed on KhataGO main
 * while live was still the Aug 29 build; anchored on HEAD, the 15:34Z run
 * would have called that outage "deploying". So the window is anchored on the
 * OLDEST change live is missing:
 *   - served sha behind main → the oldest commit main has that live does not;
 *   - route 404 while main has it → the commit that put the route on main
 *     (the most recent commit touching the route file — an upper bound, so it
 *     can only ever be lenient by one edit, for one window).
 * A deploy that is missing nothing older than the window is in flight. One
 * that is missing something older is not.
 *
 * A private repository (this token gets 404 from the API) has no commit
 * times, so it has no grace window: its sha is "cannot verify (private)" and
 * its 404 fails from the declared `routeOnMainSince` date, exactly as before.
 */

export const DEFAULT_GRACE_MINUTES = 30;
export const MAX_LAG_MS = 24 * 60 * 60 * 1000;

/**
 * `FRESHNESS_GRACE_MINUTES` → milliseconds. Unset or empty means the default;
 * anything that is not a finite, non-negative number is a configuration error
 * and is refused rather than silently defaulted (a typo'd `30m` must not turn
 * into "no grace" or "default grace" without saying so).
 */
export function parseGraceMinutes(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return DEFAULT_GRACE_MINUTES;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(
      `FRESHNESS_GRACE_MINUTES must be a non-negative number of minutes, got ${JSON.stringify(raw)}`
    );
  }
  return n;
}

export function dig(obj, path) {
  let cur = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

const hours = (ms) => (ms / 3_600_000).toFixed(1);
const minutes = (ms) => Math.max(0, Math.round(ms / 60_000));
const short = (sha) => (typeof sha === "string" ? sha.slice(0, 7) : "?");

/**
 * One target → { ok, verdict, detail, unverifiable?, deploying? }.
 *
 *   ok: false          fails the run.
 *   unverifiable: true reported distinctly, never counted as a pass.
 *   deploying: true    ok, with a warning: live is behind main by less than
 *                      the grace window, measured as described above.
 *
 * @param facts   { target, live: { status, json, error? }, head: { status, json } }
 *                `head` is the GitHub `commits/main` answer; 404 = unreadable.
 * @param probes  Lazy lookups, only called when the decision needs them:
 *                  route()   → { status, lastCommitDate }: `status` of
 *                              `contents/<routePath>?ref=main` (200 = present)
 *                              and the ISO date of the most recent commit on
 *                              main touching that path (or null).
 *                  compare() → the GitHub `compare/<served>...main` answer,
 *                              { status, json }.
 * @param opts    { now, graceMs, maxLagMs } — the clock and the windows.
 */
export async function decideFreshness(
  { target, live, head },
  probes,
  {
    now = Date.now(),
    graceMs = DEFAULT_GRACE_MINUTES * 60_000,
    maxLagMs = MAX_LAG_MS,
  } = {}
) {
  const servedSha = dig(live.json, target.shaPath);
  const graceLabel = `${minutes(graceMs)}m grace window`;

  // ── What does main say? ────────────────────────────────────────────────
  const repoReadable = head.status === 200;
  if (!repoReadable && head.status !== 404) {
    // Rate limit, outage. Not a false claim about the deploy; say so.
    return {
      ok: true,
      unverifiable: true,
      verdict: "skipped",
      detail: `GitHub API answered ${head.status} for ${target.repo}`,
    };
  }
  const mainSha = repoReadable ? head.json.sha : null;

  // ── Rule 3: the route is missing from live ─────────────────────────────
  if (live.status === 0) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `${target.url} unreachable (${live.error})`,
    };
  }
  if (live.status === 404 || servedSha === undefined) {
    const shape =
      live.status === 404
        ? "answers 404"
        : `answers ${live.status} with no sha at .${target.shaPath.join(".")}`;
    if (repoReadable) {
      const route = await probes.route();
      if (route.status === 200) {
        const landedAt = Date.parse(route.lastCommitDate ?? "");
        const sinceLanded = now - landedAt;
        if (Number.isFinite(sinceLanded) && sinceLanded <= graceMs) {
          return {
            ok: true,
            deploying: true,
            verdict: "deploying",
            detail:
              `${shape}; ${target.routePath} reached ${target.repo} main ${minutes(sinceLanded)}m ago ` +
              `(${short(mainSha)}) — inside the ${graceLabel}, deploy in flight`,
          };
        }
        const age = Number.isFinite(sinceLanded)
          ? `${hours(sinceLanded)}h ago`
          : "at an unknown time";
        return {
          ok: false,
          verdict: "FAIL",
          detail:
            `${shape}, but ${target.repo} has ${target.routePath} on main ` +
            `(${short(mainSha)}, landed ${age}, outside the ${graceLabel}) — ` +
            `live is serving a build from before the route: a stale deploy`,
        };
      }
      return {
        ok: true,
        verdict: "ok",
        detail: `${shape}; ${target.routePath} is not on main yet, so that is expected`,
      };
    }
    if (target.routeOnMainSince) {
      return {
        ok: false,
        verdict: "FAIL",
        detail:
          `${shape}; ${target.repo} is private to this token, but the route has been on ` +
          `main since ${target.routeOnMainSince} — live is a build from before it: a stale deploy`,
      };
    }
    return {
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
      detail: `${shape}; ${target.repo} is private and no route date is declared`,
    };
  }

  if (typeof servedSha !== "string" || !/^[0-9a-f]{40}$/.test(servedSha)) {
    // `unknown` means the build did not bake VERCEL_GIT_COMMIT_SHA. A
    // version endpoint that cannot name its commit is the blind spot again.
    return {
      ok: false,
      verdict: "FAIL",
      detail: `served sha is ${JSON.stringify(servedSha)} — not a commit; the build did not bake its git sha`,
    };
  }

  if (!repoReadable) {
    return {
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
      detail: `live serves ${short(servedSha)}; ${target.repo} is private to this token, so main is unknown`,
    };
  }

  // ── Rules 1 and 2: ancestry and lag ────────────────────────────────────
  if (servedSha === mainSha) {
    return {
      ok: true,
      verdict: "ok",
      detail: `live serves main HEAD ${short(servedSha)}`,
    };
  }

  const cmp = await probes.compare();
  if (cmp.status === 404) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `live serves ${short(servedSha)}, which is not a commit in ${target.repo}`,
    };
  }
  if (cmp.status !== 200) {
    return {
      ok: true,
      unverifiable: true,
      verdict: "skipped",
      detail: `GitHub compare answered ${cmp.status}`,
    };
  }
  const { status, ahead_by: aheadBy, commits = [] } = cmp.json;
  // base = served, head = main. "ahead" means main is ahead of served, i.e.
  // served IS an ancestor. "behind" / "diverged" mean it is not.
  if (status !== "ahead" && status !== "identical") {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `live serves ${short(servedSha)}, which is not an ancestor of main ${short(mainSha)} (${status})`,
    };
  }
  const dates = commits
    .map((c) => Date.parse(c?.commit?.committer?.date ?? ""))
    .filter((t) => Number.isFinite(t));
  // Oldest commit main has that live does not. If the list was truncated
  // (GitHub caps it at 250) fall back to main HEAD's own date — a lag that
  // deep is over the window either way.
  const oldest = dates.length
    ? Math.min(...dates)
    : Date.parse(head.json.commit.committer.date);
  const lagMs = now - oldest;
  const summary = `live serves ${short(servedSha)}; main ${short(mainSha)} is ${aheadBy} commit(s) ahead, oldest unserved is ${hours(lagMs)}h old`;
  if (lagMs > maxLagMs) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `${summary} — over the ${hours(maxLagMs)}h window`,
    };
  }
  if (lagMs <= graceMs) {
    return {
      ok: true,
      deploying: true,
      verdict: "deploying",
      detail: `${summary} (${minutes(lagMs)}m) — inside the ${graceLabel}, deploy in flight`,
    };
  }
  return {
    ok: true,
    verdict: "ok",
    detail: `${summary} — within the ${hours(maxLagMs)}h window`,
  };
}
