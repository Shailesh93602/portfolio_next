export const runtime = "nodejs";
// Never pre-rendered: the whole point is to report what THIS deployment is.
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { resolveVersion, versionResponseHeaders } from "@/lib/version";

/**
 * GET /api/version — public, no DB, no secrets.
 *
 * `{ sha, shortSha, ref, deployedAt, env }` for whatever build is answering,
 * `unknown` for anything the platform did not provide. Same shape as
 * KhataGO's and EduScale's, so one checker (scripts/check-deploy-freshness.mjs)
 * can compare all three live sites against their repositories' `main`
 * instead of trusting a 200 from a deploy that quietly stopped updating.
 * See lib/version.ts.
 */
export async function GET() {
  const version = resolveVersion();
  return NextResponse.json(version, {
    headers: versionResponseHeaders(version),
  });
}
