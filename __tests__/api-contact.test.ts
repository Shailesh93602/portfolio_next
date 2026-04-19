/**
 * @jest-environment node
 *
 * Tests for app/api/contact/route.ts
 * Mocks resend so no real email is ever sent.
 */
import { POST } from "@/app/api/contact/route";

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest
        .fn()
        .mockResolvedValue({ data: { id: "msg_123" }, error: null }),
    },
  })),
}));

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  const validBody = {
    fullName: "Test User",
    email: "test@example.com",
    phoneNumber: "+15555555555",
    subject: "Hello there",
    message: "This message is long enough to pass validation.",
  };

  beforeEach(() => {
    // Reset IP bucket between tests by faking a fresh IP
    jest.resetModules();
  });

  it("rejects malformed JSON with 400", async () => {
    const req = makeRequest("not json", { "x-forwarded-for": "1.1.1.1" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects invalid payload with 400 and details", async () => {
    const req = makeRequest(
      { ...validBody, email: "not-an-email" },
      { "x-forwarded-for": "2.2.2.2" }
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(Array.isArray(json.details)).toBe(true);
  });

  it("returns 503 with fallback:mailto when RESEND_API_KEY is missing", async () => {
    const original = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      const req = makeRequest(validBody, { "x-forwarded-for": "3.3.3.3" });
      const res = await POST(req);
      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.fallback).toBe("mailto");
    } finally {
      if (original !== undefined) process.env.RESEND_API_KEY = original;
    }
  });

  it("sends email and returns 200 when RESEND_API_KEY is set", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    try {
      const req = makeRequest(validBody, { "x-forwarded-for": "4.4.4.4" });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.ok).toBe(true);
    } finally {
      delete process.env.RESEND_API_KEY;
    }
  });

  it("rate limits the same IP after 5 submissions in an hour", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    const ip = "5.5.5.5";
    try {
      for (let i = 0; i < 5; i += 1) {
        const req = makeRequest(validBody, { "x-forwarded-for": ip });
        const res = await POST(req);
        expect(res.status).toBe(200);
      }
      const req = makeRequest(validBody, { "x-forwarded-for": ip });
      const res = await POST(req);
      expect(res.status).toBe(429);
    } finally {
      delete process.env.RESEND_API_KEY;
    }
  });
});
