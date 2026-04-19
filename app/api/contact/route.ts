import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

import { CONTACT_INFO } from "@/lib/constants";

export const runtime = "nodejs";

const contactSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

// Simple in-memory rate limit: 5 submissions per IP per hour.
// In-memory is fine for a portfolio — the function is shared across requests on
// the same warm lambda, and cold starts reset the bucket (which is OK for a
// per-IP limit on a personal site — real abuse would come from many IPs).
const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: LIMIT - 1 };
  }
  if (bucket.count >= LIMIT) return { ok: false, remaining: 0 };
  bucket.count += 1;
  return { ok: true, remaining: LIMIT - bucket.count };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Try again in an hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        details: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  // Graceful fallback: if Resend isn't configured yet, tell the client to
  // fall back to mailto: rather than pretending the email went through.
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        fallback: "mailto",
        error:
          "Email service not configured. Opening your mail client instead.",
      },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";

    const phoneLine = data.phoneNumber ? `Phone: ${data.phoneNumber}\n` : "";
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [CONTACT_INFO.EMAIL],
      replyTo: data.email,
      subject: `[Portfolio Contact] ${data.subject}`,
      text: `Name: ${data.fullName}\nEmail: ${data.email}\n${phoneLine}\n${data.message}`,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { ok: true, remainingToday: rate.remaining },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact route error:", message);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
