/**
 * @jest-environment node
 */
import nextConfig from "../next.config";

describe("security headers (next.config.ts)", () => {
  it("every path refuses framing and type sniffing", async () => {
    const rules = await nextConfig.headers!();
    const all = rules.find((r) => r.source === "/:path*");
    expect(all).toBeDefined();
    const byKey = Object.fromEntries(
      all!.headers.map((h) => [h.key.toLowerCase(), h.value])
    );
    expect(byKey["content-security-policy"]).toMatch(/frame-ancestors 'none'/);
    expect(byKey["content-security-policy"]).toMatch(/object-src 'none'/);
    expect(byKey["x-frame-options"]).toBe("DENY");
    expect(byKey["x-content-type-options"]).toBe("nosniff");
    expect(byKey["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
