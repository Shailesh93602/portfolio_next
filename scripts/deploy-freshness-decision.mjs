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

/**
 * One row of the report. `hint`, `unverifiable` and `deploying` are optional,
 * so the shape is declared once here rather than inferred per return — the
 * union TypeScript infers from the branches would make `r.hint` an error at
 * the call sites that must be free to read it.
 *
 * @typedef {object} FreshnessResult
 * @property {boolean} ok                  false fails the run
 * @property {string} verdict              the short label in the row
 * @property {string} detail               the row's sentence
 * @property {boolean} [unverifiable]      reported distinctly; never a pass
 * @property {boolean} [deploying]         behind, but inside the grace window
 * @property {string} [hint]               the cause class, on a stale FAIL
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
 * HOW LONG live has been behind, in the unit a reader thinks in. A week-long
 * outage has to read as a week: KhataGO's said "sha bbbbbbb ≠ sha aaaaaaa"
 * for seven days, which is true and tells nobody how bad it is. Minutes below
 * 90 minutes, hours below a day, whole days beyond that — the day boundary is
 * the same 24 hours that makes a lag a failure, so every FAIL reads in days.
 *
 * Returns null when there is nothing to measure — a repository this token
 * cannot read has no commit times, and a missing date must never print as
 * "NaNd" or, far worse, as "0m".
 */
export function formatAge(ms) {
  if (!Number.isFinite(ms)) return null;
  const clamped = Math.max(0, ms);
  if (clamped < 90 * 60_000) return `${Math.round(clamped / 60_000)}m`;
  if (clamped < 24 * 3_600_000) return `${(clamped / 3_600_000).toFixed(1)}h`;
  return `${Math.round(clamped / 86_400_000)}d`;
}

/** "live is 7d behind main", or the honest version when nothing is measurable. */
function behindFor(ms) {
  const age = formatAge(ms);
  return age
    ? `live is ${age} behind main`
    : "how far behind live is cannot be measured";
}

/**
 * THE CAUSE CLASS, not only the symptom. "live is 7d behind main" says what
 * is wrong; it does not say where to look. KhataGO's week had exactly one
 * cause and it was invisible from outside: a migration failed, which left
 * Prisma wedged (P3009) so every later build died on it — and
 * `prisma migrate status` would not name the failed migration.
 *
 * A target declares which class it can suffer (`migrations: "prisma"`) and
 * the sentence lives here once, rather than being written out per row. An app
 * with no database cannot wedge this way and gets no extra line.
 */
export const CAUSE_HINTS = {
  prisma:
    "likely cause: a failed migration blocks every deploy (P3009) — read the failed build's log, then " +
    "`SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL`",
};

/**
 * The hint for a target, or undefined when it declares none. An unknown kind
 * is a configuration error and is refused rather than dropped: silently
 * returning undefined would delete the one line this exists to print.
 */
export function causeHint(target) {
  const kind = target?.migrations;
  if (kind === undefined || kind === null) return undefined;
  const hint = CAUSE_HINTS[kind];
  if (!hint) {
    throw new Error(
      `unknown migrations kind ${JSON.stringify(kind)} on target ${target?.name}; ` +
        `known: ${Object.keys(CAUSE_HINTS).join(", ")}`
    );
  }
  return hint;
}

/**
 * A FAIL meaning "live is behind main" — the only shape that carries a hint.
 *
 * @returns {FreshnessResult}
 */
function stale(target, detail) {
  const hint = causeHint(target);
  return { ok: false, verdict: "FAIL", detail, ...(hint ? { hint } : {}) };
}

/**
 * The one line the job prints whether or not anything failed, so the run is
 * legible from the Actions list without opening the log: `3 of 4 apps serve
 * main`. A regression reads as a smaller number, which is the whole point.
 */
export function summarize(results) {
  const serving = results.filter(
    (r) => r.ok && !r.unverifiable && !r.deploying
  ).length;
  const counts = [
    ["stale", results.filter((r) => !r.ok).length],
    ["deploying", results.filter((r) => r.ok && r.deploying).length],
    ["unverifiable", results.filter((r) => r.ok && r.unverifiable).length],
  ].filter(([, n]) => n > 0);
  const tail = counts.length
    ? ` (${counts.map(([label, n]) => `${n} ${label}`).join(", ")})`
    : "";
  return `${serving} of ${results.length} apps serve main${tail}`;
}

/**
 * One target → { ok, verdict, detail, unverifiable?, deploying?, hint? }.
 *
 *   ok: false          fails the run.
 *   unverifiable: true reported distinctly, never counted as a pass.
 *   deploying: true    ok, with a warning: live is behind main by less than
 *                      the grace window, measured as described above.
 *   hint               one extra line naming the cause class, on the FAILs
 *                      that mean "live is behind main" and only for a target
 *                      that declares one (`migrations`).
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
 * @returns {Promise<FreshnessResult>}
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
              `${shape}; ${behindFor(sinceLanded)} — ${target.routePath} reached ` +
              `${target.repo} main (${short(mainSha)}) inside the ${graceLabel}: deploy in flight`,
          };
        }
        return stale(
          target,
          `${shape}; ${behindFor(sinceLanded)} — ${target.repo} has ${target.routePath} ` +
            `on main (${short(mainSha)}) and live serves a build from before it, ` +
            `outside the ${graceLabel}: a stale deploy`
        );
      }
      return {
        ok: true,
        verdict: "ok",
        detail: `${shape}; ${target.routePath} is not on main yet, so that is expected`,
      };
    }
    if (target.routeOnMainSince) {
      // No commit times to measure from, but the declared date is a real
      // LOWER bound: live is missing at least the change that landed then.
      // Said as a bound, never as the lag — KhataGO's true gap starts at the
      // first failed build, which a token that cannot read the repo cannot see.
      const since = formatAge(now - Date.parse(target.routeOnMainSince));
      return stale(
        target,
        `${shape}; ${target.repo} is private to this token, so the exact lag is unmeasurable — ` +
          `but the route has been on main since ${target.routeOnMainSince}, so live is ` +
          `${since ? `at least ${since} behind main` : "a build from before it"}: a stale deploy`
      );
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
  const summary =
    `live serves ${short(servedSha)}; main ${short(mainSha)} is ${aheadBy} commit(s) ahead — ` +
    `${behindFor(lagMs)} (measured from the oldest unserved commit)`;
  if (lagMs > maxLagMs) {
    return stale(target, `${summary} — over the ${hours(maxLagMs)}h window`);
  }
  if (lagMs <= graceMs) {
    return {
      ok: true,
      deploying: true,
      verdict: "deploying",
      detail: `${summary} — inside the ${graceLabel}, deploy in flight`,
    };
  }
  return {
    ok: true,
    verdict: "ok",
    detail: `${summary} — within the ${hours(maxLagMs)}h window`,
  };
}
