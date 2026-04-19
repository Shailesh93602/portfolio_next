"use client";

import React from "react";
import { motion } from "framer-motion";

type Step = {
  y: number;
  from: number;
  to: number;
  label: string;
  sub: string;
  muted?: boolean;
};

const LEFT_LANE: Step[] = [
  {
    y: 110,
    from: 80,
    to: 240,
    label: "POST evt_abc123",
    sub: "Stripe-Signature header",
  },
  {
    y: 170,
    from: 240,
    to: 400,
    label: "constructEvent() HMAC",
    sub: "verify signature",
  },
  {
    y: 230,
    from: 240,
    to: 400,
    label: "SETNX stripe:event:evt_abc123",
    sub: "returns 1 (set)",
  },
  {
    y: 290,
    from: 240,
    to: 400,
    label: "run handler",
    sub: "fulfill order, send email",
  },
  { y: 350, from: 400, to: 240, label: "ok", sub: "handler success" },
  { y: 410, from: 240, to: 80, label: "200 OK", sub: "ack delivery" },
];

const RIGHT_LANE: Step[] = [
  {
    y: 110,
    from: 560,
    to: 720,
    label: "POST evt_abc123",
    sub: "same event id, new attempt",
  },
  {
    y: 170,
    from: 720,
    to: 880,
    label: "constructEvent() HMAC",
    sub: "verify signature",
  },
  {
    y: 230,
    from: 720,
    to: 880,
    label: "SETNX stripe:event:evt_abc123",
    sub: "returns 0 (exists)",
  },
  {
    y: 290,
    from: 720,
    to: 880,
    label: "skip handler",
    sub: "no side effects",
    muted: true,
  },
  {
    y: 410,
    from: 720,
    to: 560,
    label: "200 OK",
    sub: "ack duplicate, quietly",
  },
];

const COLS = [
  { x: 80, label: "Stripe" },
  { x: 240, label: "Edge /webhook" },
  { x: 400, label: "Redis + Handler" },
  { x: 560, label: "Stripe" },
  { x: 720, label: "Edge /webhook" },
  { x: 880, label: "Redis + Handler" },
];

function renderSteps(steps: Step[], prefix: string) {
  return steps.map((s, idx) => {
    const stroke = s.muted
      ? "hsl(var(--muted-foreground))"
      : "hsl(var(--primary))";
    const marker = s.muted ? "url(#arrow-muted)" : "url(#arrow-primary)";
    return (
      <g key={`${prefix}-${idx}`}>
        <line
          x1={s.from}
          y1={s.y}
          x2={s.to}
          y2={s.y}
          stroke={stroke}
          strokeWidth={1.5}
          strokeDasharray={s.muted ? "4 4" : undefined}
          markerEnd={marker}
        />
        <text
          x={(s.from + s.to) / 2}
          y={s.y - 8}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          className={s.muted ? "fill-muted-foreground" : "fill-foreground"}
        >
          {s.label}
        </text>
        <text
          x={(s.from + s.to) / 2}
          y={s.y + 14}
          textAnchor="middle"
          fontSize="9"
          className="fill-muted-foreground"
        >
          {s.sub}
        </text>
      </g>
    );
  });
}

const CARD =
  "relative overflow-hidden rounded-[2rem] border border-white/5 bg-card/60 p-8 backdrop-blur-xl md:p-12";
const GLOW_TOP =
  "pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[120px]";
const GLOW_BOTTOM =
  "pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary/10 blur-[120px]";
const GLOW_DESTRUCT =
  "pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-destructive/10 blur-[120px]";
const LABEL = "text-xs font-black uppercase tracking-[0.3em] text-primary/80";
const CODE_BOX =
  "overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-xs leading-relaxed text-muted-foreground";
const REVEAL = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export default function StripeCaseStudy() {
  return (
    <div className="space-y-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-primary/80">
          Internal Design Doc
        </p>
        <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
          Webhook Idempotency, End to End
        </h3>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Stripe retries every webhook until it gets a 2xx. The only reason
          duplicate deliveries stay harmless is the eight lines of SETNX that
          sit between HMAC verification and the business handler. Here is what
          that looks like on the wire.
        </p>
      </div>

      {/* 1. SVG sequence diagram */}
      <motion.div {...REVEAL} className={CARD}>
        <div className={GLOW_TOP} />
        <div className="relative z-10 space-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="text-lg font-bold tracking-tight md:text-xl">
              Sequence: first delivery vs. duplicate retry
            </h4>
            <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground md:inline">
              /api/stripe/webhook
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 960 560"
              role="img"
              aria-label="Webhook sequence diagram comparing first delivery and duplicate retry paths"
              className="mx-auto block h-auto w-full min-w-[680px] max-w-[960px]"
            >
              <defs>
                <marker
                  id="arrow-primary"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
                </marker>
                <marker
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M0,0 L10,5 L0,10 z"
                    fill="hsl(var(--muted-foreground))"
                  />
                </marker>
              </defs>

              <text
                x="240"
                y="28"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                className="fill-foreground"
              >
                First delivery
              </text>
              <text
                x="720"
                y="28"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                className="fill-foreground"
              >
                Duplicate retry (2s later)
              </text>
              <line
                x1="480"
                y1="12"
                x2="480"
                y2="548"
                stroke="hsl(var(--border))"
                strokeDasharray="4 6"
              />

              {COLS.map((col) => (
                <g key={`${col.x}-${col.label}`}>
                  <rect
                    x={col.x - 60}
                    y={44}
                    width={120}
                    height={28}
                    rx={8}
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                  />
                  <text
                    x={col.x}
                    y={62}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    className="fill-foreground"
                  >
                    {col.label}
                  </text>
                  <line
                    x1={col.x}
                    y1={72}
                    x2={col.x}
                    y2={540}
                    stroke="hsl(var(--border))"
                  />
                </g>
              ))}

              {renderSteps(LEFT_LANE, "left")}
              {renderSteps(RIGHT_LANE, "right")}

              <rect
                x={40}
                y={480}
                width={880}
                height={52}
                rx={10}
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
              />
              <text
                x={480}
                y={502}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                className="fill-foreground"
              >
                Both paths return 200. Stripe stops retrying. The second
                delivery never touched the order.
              </text>
              <text
                x={480}
                y={520}
                textAnchor="middle"
                fontSize="10"
                className="fill-muted-foreground"
              >
                Idempotency key TTL: 86400s (24h) — covers Stripe&apos;s full
                retry window of 3 days with room for clock skew.
              </text>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 2. Duplicate event walkthrough */}
      <motion.div {...REVEAL} className={CARD}>
        <div className={GLOW_BOTTOM} />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className={LABEL}>Walkthrough</p>
            <h4 className="text-lg font-bold tracking-tight md:text-xl">
              Redis state, before and after
            </h4>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Trace the keys a real duplicate delivery produces. The store
              starts empty, the first webhook writes one key with a 24-hour TTL,
              and every subsequent retry of the same event bounces off that key.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-background/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Before first delivery
                </p>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  t=0.000s
                </span>
              </div>
              <pre className={CODE_BOX}>
                {`redis> KEYS stripe:event:*
(empty array)

redis> GET stripe:event:evt_abc123
(nil)`}
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                The store has never seen this event id.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  After first delivery
                </p>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                  t=0.041s
                </span>
              </div>
              <pre className={CODE_BOX}>
                {`redis> SETNX stripe:event:evt_abc123 1
(integer) 1

redis> EXPIRE stripe:event:evt_abc123 86400
(integer) 1

redis> TTL stripe:event:evt_abc123
(integer) 86400`}
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Key claimed. Handler runs, order fulfilled, 200 returned.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-background/80 to-card/60 p-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                t=2.113s
              </span>
              <p className="text-sm font-bold text-foreground">
                Duplicate retry arrives
              </p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                same evt_abc123, new delivery attempt
              </span>
            </div>
            <pre className={CODE_BOX}>
              {`redis> SETNX stripe:event:evt_abc123 1
(integer) 0           // already exists — we bail

redis> TTL stripe:event:evt_abc123
(integer) 86398       // same key, ~2s burned`}
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Why the handler is skipped:
              </span>{" "}
              SETNX returning 0 is our signal that this exact event id has been
              processed in the last 24 hours. We short-circuit, return 200, and
              Stripe stops retrying. No duplicate charge reconciliation, no
              double email, no phantom inventory decrement.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. The 4xx retry trap */}
      <motion.div {...REVEAL} className={CARD}>
        <div className={GLOW_DESTRUCT} />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className={LABEL}>The 4xx retry trap</p>
            <h4 className="text-lg font-bold tracking-tight md:text-xl">
              What breaks when you retry on every error
            </h4>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Retrying on transient failure is correct. Retrying on a Stripe 4xx
              is not — it turns a single declined card into four dashboard
              failures and four operator tickets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-destructive">
                  Naive retry (wrong)
                </p>
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-destructive">
                  anti-pattern
                </span>
              </div>
              <pre className={CODE_BOX}>
                {`for (let i = 0; i < 4; i++) {
  try {
    return await stripe.paymentIntents
      .create(params);
  } catch (err) {
    // Retry everything. What could go wrong?
    await sleep(backoff(i));
  }
}
throw new Error("out of retries");`}
              </pre>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
                {[
                  "Card declined (402) triggers 4 useless retries.",
                  "4 duplicate failed attempts show up in the Stripe dashboard.",
                  "Issuer fraud scoring climbs. Good cards start getting blocked.",
                  "Missing idempotency key means each retry could double charge.",
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-destructive">&bull;</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  What we do
                </p>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                  production
                </span>
              </div>
              <pre className={CODE_BOX}>
                {`async function withRetry(fn, { tries = 4 } = {}) {
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      const code = err?.statusCode ?? 0;
      // 4xx: Stripe said no. Stop.
      if (code >= 400 && code < 500) throw err;
      // 5xx or network: retry with backoff.
      if (i === tries - 1) throw err;
      await sleep(250 * 2 ** i);
    }
  }
}`}
              </pre>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <span className="font-semibold text-foreground">
                      Network error:
                    </span>{" "}
                    retry with exponential backoff.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <span className="font-semibold text-foreground">
                      5xx from Stripe:
                    </span>{" "}
                    retry — their side, probably transient.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    <span className="font-semibold text-foreground">
                      4xx from Stripe:
                    </span>{" "}
                    fail fast, surface to caller.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&bull;</span>
                  <span>
                    Every call carries an{" "}
                    <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-[11px]">
                      Idempotency-Key
                    </code>{" "}
                    header so retries are safe.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 text-center">
            <p className="text-sm font-semibold leading-relaxed text-foreground md:text-base">
              The decision: trust Stripe&apos;s 4xx responses. They already
              thought about it.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
