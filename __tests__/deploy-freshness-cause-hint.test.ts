/**
 * @jest-environment node
 *
 * scripts/deploy-freshness-decision.mjs — a failing row is ACTIONABLE: for an
 * app that can wedge its deploys on a failed migration it names that cause
 * class in one extra line. KhataGO's week-long outage had exactly that cause
 * and the daily check said none of it.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  CAUSE_HINTS,
  causeHint,
  decideFreshness,
} from "../scripts/deploy-freshness-decision.mjs";
import {
  HOUR,
  MAIN,
  MIN,
  SERVED,
  aheadBy,
  fakeProbes,
  iso,
  notFound,
  opts,
  privateHead,
  readableHead,
  serving,
  target,
} from "./helpers/deploy-freshness-fixtures";

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
