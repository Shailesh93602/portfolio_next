/**
 * @jest-environment node
 *
 * GET /api/og renders share cards. Search Console listed two of them as
 * "Crawled - currently not indexed": crawl budget spent on images nobody
 * searches for. The card must still render (social previews need it) and
 * must tell search engines not to index it.
 */
import { NextRequest } from "next/server";

import { GET } from "@/app/api/og/route";

describe("GET /api/og", () => {
  it("returns a PNG marked noindex", async () => {
    const res = await GET(
      new NextRequest(
        "https://shaileshchaudhari.vercel.app/api/og?title=T&description=D&type=project"
      )
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
  });
});
