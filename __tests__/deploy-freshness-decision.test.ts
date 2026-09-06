/**
 * @jest-environment node
 *
 * scripts/deploy-freshness-decision.mjs — the decision behind the daily
 * "does live serve main?" job, run against a fake clock.
 *
 * The property under test is the grace window: a run minutes after a merge
 * sees a build in flight and must say `deploying` (exit 0, warning), while a
 * build that is missing anything older than the window is still a FAIL. The
 * window is anchored on the oldest change live is missing — NOT on main HEAD,
 * because an unrelated fresh commit must not excuse a week-old build. And a
 * private repository, having no commit times, has no window at all.
 *
 * The second property is that a failing row is ACTIONABLE: it says how long
 * live has been behind in the unit a reader thinks in ("live is 7d behind
 * main", not two shas), and for an app that can wedge its deploys on a failed
 * migration it names that cause class in one extra line. KhataGO's week-long
 * outage had exactly that cause and the daily check said none of it.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  CAUSE_HINTS,
  DEFAULT_GRACE_MINUTES,
  MAX_LAG_MS,
  causeHint,
  decideFreshness,
  formatAge,
  parseGraceMinutes,
  summarize,
} from "../scripts/deploy-freshness-decision.mjs";

const NOW = Date.parse("2026-09-05T12:00:00.000Z");
const GRACE_MS = 30 * 60_000;
const MIN = 60_000;
const HOUR = 60 * MIN;

const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();

const MAIN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const SERVED = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const target = {
  name: "site",
  url: "https://site.example/api/version",
  shaPath: ["sha"],
  repo: "owner/repo",
  routePath: "app/api/version/route.ts",
};

/** GitHub `commits/main`, committed `headAgo` ms before NOW. */
const readableHead = (headAgo: number) => ({
  status: 200,
  json: { sha: MAIN, commit: { committer: { date: iso(headAgo) } } },
});
const privateHead = { status: 404, json: { message: "Not Found" } };

const serving = (sha: string) => ({ status: 200, json: { sha } });
const notFound = { status: 404, json: null };

/** Probes that record whether they were consulted. */
function fakeProbes(answers: {
  route?: { status: number; lastCommitDate: string | null };
  compare?: { status: number; json: unknown };
}) {
  const calls = { route: 0, compare: 0 };
  return {
    calls,
    probes: {
      async route() {
        calls.route++;
        if (!answers.route) throw new Error("route probe not expected");
        return answers.route;
      },
      async compare() {
        calls.compare++;
        if (!answers.compare) throw new Error("compare probe not expected");
        return answers.compare;
      },
    },
  };
}

/** `compare/<served>...main`: main ahead by the given commits (ms ago each). */
const aheadBy = (commitAges: number[]) => ({
  status: 200,
  json: {
    status: "ahead",
    ahead_by: commitAges.length,
    commits: commitAges.map((ago) => ({
      commit: { committer: { date: iso(ago) } },
    })),
  },
});

const opts = { now: NOW, graceMs: GRACE_MS };

describe("decideFreshness — the grace window", () => {
  it("fresh: served sha is main HEAD → ok, and no compare call is made", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      { target, live: serving(MAIN), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("deploying inside grace: one commit behind, merged 5 minutes ago → deploying, ok", async () => {
    const { probes } = fakeProbes({ compare: aheadBy([5 * MIN]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      deploying: true,
      verdict: "deploying",
    });
    expect(r.detail).toMatch(/inside the 30m grace window/);
  });

  it("stale outside grace: one commit behind for 25 hours → FAIL, regardless of a fresh HEAD", async () => {
    // main HEAD was committed 5 minutes ago, but the OLDEST unserved commit is
    // 25 hours old: a fresh commit must not reset the window.
    const { probes } = fakeProbes({ compare: aheadBy([5 * MIN, 25 * HOUR]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/over the 24\.0h window/);
  });

  it("behind, past grace but under 24h → ok (not deploying, not stale)", async () => {
    const { probes } = fakeProbes({ compare: aheadBy([2 * HOUR]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(2 * HOUR) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
    expect(r.detail).toMatch(/within the 24\.0h window/);
  });

  it("the grace boundary is inclusive: exactly 30 minutes is still deploying, 30m+1s is not", async () => {
    const at = async (ago: number) =>
      decideFreshness(
        { target, live: serving(SERVED), head: readableHead(ago) },
        fakeProbes({ compare: aheadBy([ago]) }).probes,
        opts
      );
    expect((await at(GRACE_MS)).verdict).toBe("deploying");
    expect((await at(GRACE_MS + 1000)).verdict).toBe("ok");
  });

  it("404 inside grace: the route reached main 3 minutes ago → deploying, ok", async () => {
    const { probes, calls } = fakeProbes({
      route: { status: 200, lastCommitDate: iso(3 * MIN) },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(3 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      deploying: true,
      verdict: "deploying",
    });
    expect(r.detail).toMatch(/answers 404/);
    expect(r.detail).toMatch(/live is 3m behind main/);
    expect(calls).toEqual({ route: 1, compare: 0 });
  });

  it("404 outside grace: the route has been on main for 8 hours → FAIL, even though HEAD is 4 minutes old", async () => {
    // KhataGO on 2026-09-05 15:34Z: an unrelated commit landed at 15:29Z while
    // live was still the Aug 29 build. Anchored on HEAD this would have read
    // "deploying". It is a stale deploy.
    const { probes } = fakeProbes({
      route: { status: 200, lastCommitDate: iso(8 * HOUR) },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(4 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/live is 8\.0h behind main/);
    expect(r.detail).toMatch(/outside the 30m grace window/);
    expect(r.detail).toMatch(/stale deploy/);
  });

  it("404 with no date for the route (API gave none) → FAIL: unknown age is not inside any window", async () => {
    const { probes } = fakeProbes({
      route: { status: 200, lastCommitDate: null },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(1 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/how far behind live is cannot be measured/);
  });

  it("404 while the route is not on main → ok, expected", async () => {
    const { probes } = fakeProbes({
      route: { status: 404, lastCommitDate: null },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(1 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.detail).toMatch(/not on main yet/);
  });

  it("private: a served sha with an unreadable repo → cannot verify (private), never a pass", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: privateHead },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
    });
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("private + 404 + declared route date → FAIL with no grace (there are no commit times to measure from)", async () => {
    // The KhataGO row as the Actions token sees it. `now` is one minute after
    // midnight on the declared date — a window anchored on the date would
    // pass it; there is no window here.
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      {
        target: { ...target, routeOnMainSince: "2026-09-05" },
        live: notFound,
        head: privateHead,
      },
      probes,
      { now: Date.parse("2026-09-05T00:01:00.000Z"), graceMs: GRACE_MS }
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/private to this token/);
    expect(r.detail).toMatch(/since 2026-09-05/);
    // A bound, not a claim: the true lag starts at the first failed build,
    // which a token that cannot read the repository cannot see.
    expect(r.detail).toMatch(/at least 1m behind main/);
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("private + 404 with no declared date → cannot verify (private)", async () => {
    const r = await decideFreshness(
      { target, live: notFound, head: privateHead },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
    });
  });

  it("a zero-minute window disables grace: one commit behind by 10s is ok-in-window, never deploying", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(10_000) },
      fakeProbes({ compare: aheadBy([10_000]) }).probes,
      { now: NOW, graceMs: 0 }
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
  });

  it("the defaults are 30 minutes of grace and a 24-hour lag window", () => {
    expect(DEFAULT_GRACE_MINUTES).toBe(30);
    expect(MAX_LAG_MS).toBe(24 * HOUR);
  });
});

describe("decideFreshness — the rules the window does not touch", () => {
  it("unreachable live site → FAIL, before any repository lookup", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      {
        target,
        live: { status: 0, json: null, error: "ECONNREFUSED" },
        head: readableHead(1 * MIN),
      },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/unreachable \(ECONNREFUSED\)/);
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("served sha `unknown` (build did not bake its sha) → FAIL, even inside grace", async () => {
    const r = await decideFreshness(
      { target, live: serving("unknown"), head: readableHead(1 * MIN) },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/did not bake its git sha/);
  });

  it("served sha not an ancestor of main (diverged) → FAIL, even inside grace", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(1 * MIN) },
      fakeProbes({
        compare: {
          status: 200,
          json: { status: "diverged", ahead_by: 1, commits: [] },
        },
      }).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/not an ancestor of main .* \(diverged\)/);
  });

  it("served sha unknown to the repository (compare 404) → FAIL", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(1 * MIN) },
      fakeProbes({ compare: { status: 404, json: null } }).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/not a commit in owner\/repo/);
  });

  it("GitHub API unavailable (non-200, non-404) → skipped and unverifiable, not a pass or a fail", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: { status: 403, json: null } },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "skipped",
    });
  });
});

describe("parseGraceMinutes (FRESHNESS_GRACE_MINUTES)", () => {
  it("unset or empty → the 30-minute default", () => {
    expect(parseGraceMinutes(undefined)).toBe(30);
    expect(parseGraceMinutes("")).toBe(30);
    expect(parseGraceMinutes("  ")).toBe(30);
  });

  it("a number of minutes, including 0 (grace off) and fractions", () => {
    expect(parseGraceMinutes("45")).toBe(45);
    expect(parseGraceMinutes("0")).toBe(0);
    expect(parseGraceMinutes("2.5")).toBe(2.5);
  });

  it("refuses anything that is not a non-negative number instead of silently defaulting", () => {
    for (const bad of ["30m", "abc", "-5", "NaN", "Infinity"]) {
      expect(() => parseGraceMinutes(bad)).toThrow(/FRESHNESS_GRACE_MINUTES/);
    }
  });
});

describe("formatAge — how long live has been behind, in a readable unit", () => {
  const MINUTE = 60_000;
  const DAY = 24 * HOUR;

  it("minutes below 90 minutes", () => {
    expect(formatAge(0)).toBe("0m");
    expect(formatAge(30 * MINUTE)).toBe("30m");
    expect(formatAge(89 * MINUTE)).toBe("89m");
  });

  it("hours from 90 minutes to a day", () => {
    expect(formatAge(90 * MINUTE)).toBe("1.5h");
    expect(formatAge(8 * HOUR)).toBe("8.0h");
    expect(formatAge(23 * HOUR + 59 * MINUTE)).toBe("24.0h");
  });

  it("days from a day up — a week-long outage reads as a week", () => {
    // The whole point: KhataGO was seven days stale and the check said
    // "sha mismatch". 168 hours is a true and useless way to print that.
    expect(formatAge(7 * DAY)).toBe("7d");
    expect(formatAge(DAY)).toBe("1d");
    expect(formatAge(31 * HOUR)).toBe("1d");
    expect(formatAge(30 * DAY)).toBe("30d");
  });

  it("the day boundary is the 24h lag window, so every FAIL reads in days", () => {
    expect(formatAge(MAX_LAG_MS - 1)).toMatch(/h$/);
    expect(formatAge(MAX_LAG_MS)).toBe("1d");
  });

  it("null when there is nothing to measure — never NaN, and never a false 0m", () => {
    // The private-repo shape: no commit times, so no age. Printing "0m" there
    // would say the opposite of the truth.
    expect(formatAge(NaN)).toBeNull();
    expect(formatAge(undefined)).toBeNull();
    expect(formatAge(null)).toBeNull();
    expect(formatAge(Infinity)).toBeNull();
    expect(formatAge("8h")).toBeNull();
  });

  it("clamps a negative age (clock skew) to zero rather than printing '-3m'", () => {
    expect(formatAge(-3 * MINUTE)).toBe("0m");
  });
});

describe("the cause class on a failing row", () => {
  const withPrisma = { ...target, migrations: "prisma" };

  it("an app with migrations gets one hint line naming the P3009 wedge", () => {
    expect(causeHint(withPrisma)).toBe(CAUSE_HINTS.prisma);
    expect(CAUSE_HINTS.prisma).toMatch(/P3009/);
    expect(CAUSE_HINTS.prisma).toMatch(/_prisma_migrations/);
    expect(CAUSE_HINTS.prisma).toMatch(
      /finished_at IS NULL AND rolled_back_at IS NULL/
    );
  });

  it("an app with no database declares nothing and gets no line", () => {
    expect(causeHint(target)).toBeUndefined();
    expect(causeHint(undefined)).toBeUndefined();
  });

  it("an unknown kind is refused, not silently dropped", () => {
    // Dropping it would delete the one line this exists to print, and the row
    // would look exactly like a correctly-configured one.
    expect(() => causeHint({ ...target, migrations: "drizzle" })).toThrow(
      /unknown migrations kind "drizzle"/
    );
  });

  it("every kind the real target list declares exists in CAUSE_HINTS", () => {
    // A static read of the runner, because importing it would run the checks.
    const src = readFileSync(
      path.join(__dirname, "..", "scripts", "check-deploy-freshness.mjs"),
      "utf8"
    );
    const declared: string[] = [];
    const pattern = /migrations:\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(src)) !== null) declared.push(m[1]);
    expect(declared.length).toBeGreaterThan(0);
    for (const kind of declared) expect(CAUSE_HINTS).toHaveProperty(kind);
  });

  it("carried by a stale sha FAIL, with the age in the same row", async () => {
    const r = await decideFreshness(
      {
        target: withPrisma,
        live: serving(SERVED),
        head: readableHead(5 * MIN),
      },
      fakeProbes({ compare: aheadBy([5 * MIN, 7 * 24 * HOUR]) }).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/live is 7d behind main/);
    expect(r.hint).toBe(CAUSE_HINTS.prisma);
  });

  it("carried by a stale 404 FAIL", async () => {
    const r = await decideFreshness(
      { target: withPrisma, live: notFound, head: readableHead(4 * MIN) },
      fakeProbes({ route: { status: 200, lastCommitDate: iso(7 * 24 * HOUR) } })
        .probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/live is 7d behind main/);
    expect(r.hint).toBe(CAUSE_HINTS.prisma);
  });

  it("carried by the private + declared-date FAIL (the live KhataGO row)", async () => {
    const r = await decideFreshness(
      {
        target: { ...withPrisma, routeOnMainSince: "2026-08-29" },
        live: notFound,
        head: privateHead,
      },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    // NOW is 2026-09-05T12:00Z; the route landed 7.5 days earlier.
    expect(r.detail).toMatch(/at least 8d behind main/);
    expect(r.hint).toBe(CAUSE_HINTS.prisma);
  });

  it("NOT carried by a passing, deploying or unverifiable row", async () => {
    const fresh = await decideFreshness(
      { target: withPrisma, live: serving(MAIN), head: readableHead(5 * MIN) },
      fakeProbes({}).probes,
      opts
    );
    const deploying = await decideFreshness(
      {
        target: withPrisma,
        live: serving(SERVED),
        head: readableHead(5 * MIN),
      },
      fakeProbes({ compare: aheadBy([5 * MIN]) }).probes,
      opts
    );
    const priv = await decideFreshness(
      { target: withPrisma, live: serving(SERVED), head: privateHead },
      fakeProbes({}).probes,
      opts
    );
    expect(fresh.hint).toBeUndefined();
    expect(deploying.hint).toBeUndefined();
    expect(priv.hint).toBeUndefined();
  });

  it("NOT carried by a FAIL that is not 'behind main' — a wrong build is not a wedged migration", async () => {
    const unreachable = await decideFreshness(
      {
        target: withPrisma,
        live: { status: 0, json: null, error: "ETIMEDOUT" },
        head: readableHead(1 * MIN),
      },
      fakeProbes({}).probes,
      opts
    );
    const diverged = await decideFreshness(
      {
        target: withPrisma,
        live: serving(SERVED),
        head: readableHead(1 * MIN),
      },
      fakeProbes({
        compare: {
          status: 200,
          json: { status: "diverged", ahead_by: 1, commits: [] },
        },
      }).probes,
      opts
    );
    expect(unreachable).toMatchObject({ ok: false });
    expect(unreachable.hint).toBeUndefined();
    expect(diverged).toMatchObject({ ok: false });
    expect(diverged.hint).toBeUndefined();
  });

  it("a deploying row still says how far behind it is", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(6 * MIN) },
      fakeProbes({ compare: aheadBy([6 * MIN]) }).probes,
      opts
    );
    expect(r).toMatchObject({ verdict: "deploying" });
    expect(r.detail).toMatch(/live is 6m behind main/);
  });
});

describe("summarize — the line the job prints even when nothing fails", () => {
  const ok = { ok: true };
  const deploying = { ok: true, deploying: true };
  const unverifiable = { ok: true, unverifiable: true };
  const failed = { ok: false };

  it("all green: N of N, with no parenthetical", () => {
    expect(summarize([ok, ok, ok])).toBe("3 of 3 apps serve main");
  });

  it("names what the rest are, so a regression is visible from the Actions list", () => {
    expect(summarize([ok, failed, deploying, unverifiable])).toBe(
      "1 of 4 apps serve main (1 stale, 1 deploying, 1 unverifiable)"
    );
  });

  it("today's real shape: three serving, KhataGO stale", () => {
    expect(summarize([ok, failed, ok, ok])).toBe(
      "3 of 4 apps serve main (1 stale)"
    );
  });

  it("a deploying or unverifiable row is not counted as serving main", () => {
    // "cannot verify" was never a pass; neither is "not there yet".
    expect(summarize([deploying, unverifiable])).toBe(
      "0 of 2 apps serve main (1 deploying, 1 unverifiable)"
    );
  });

  it("no targets → 0 of 0, not a crash", () => {
    expect(summarize([])).toBe("0 of 0 apps serve main");
  });
});
