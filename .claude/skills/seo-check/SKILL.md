---
name: seo-check
description: Run the portfolio's SEO regression checks before pushing anything that touches metadata, structured data (lib/structured-data.ts, lib/profile.ts), robots, sitemap, llms.txt, page titles/H1s, constants/projects.ts or public copy in portfolio_next — or when asked "is the SEO still right?". Runs the Jest SEO suites, the Playwright meta/schema specs, Lighthouse (mobile + desktop, collect + assert only, never uploaded) and a JSON-LD check on the built or live site. Read-only: never pushes, never uploads reports, never edits code.
---

# seo-check (portfolio_next)

Paste numbers from the command output. Never estimate them. Label anything you did not run as NOT RUN.

## 1. Unit suites (seconds)

These are the same suites `.githooks/pre-push` runs on a push to `main` that touches SEO paths.

```bash
npx jest __tests__/seo-identity.test.ts __tests__/robots.test.ts \
  __tests__/sitemap-freshness.test.ts __tests__/llms-txt-consistency.test.ts \
  __tests__/no-hire-copy.test.ts __tests__/identity-claims.test.ts \
  __tests__/khatago-claims.test.ts __tests__/project-seo.test.tsx
```

## 2. Build and serve on a pinned port (3000 is often another app)

```bash
npm run build && (PORT=3230 npm run start &) && npx wait-on http://localhost:3230
curl -s http://localhost:3230/api/version   # confirm it is THIS repo answering
```

## 3. Rendered meta + schema

```bash
PLAYWRIGHT_PORT=3230 PLAYWRIGHT_NO_SERVER=1 npx playwright test \
  e2e/meta-and-schema.spec.ts e2e/seo.spec.ts --project=chromium
```

## 4. Lighthouse: collect + assert only

`.lighthouserc.js` sets `upload.target` to `temporary-public-storage`, which publishes every report at a public URL. Locally, never run `autorun` or a bare `upload`: both read that target. Always invoke the package as `npx @lhci/cli`; the bare `lhci` name on npm is a different, placeholder package.

```bash
for ff in desktop mobile; do
  LHCI_BASE_URL=http://localhost:3230 LHCI_FORM_FACTOR=$ff npx @lhci/cli collect && \
  LHCI_FORM_FACTOR=$ff npx @lhci/cli assert
done
```

SEO must be 1 and a11y at least 0.95 (errors). Report mobile LCP for / and /about (a warning, budget 3500 ms). To keep the HTML reports, write them to disk only: `npx @lhci/cli upload --target=filesystem --outputDir=.lighthouseci/reports` (gitignored).

## 5. JSON-LD sanity on / and /about

Local first, then live with `BASE=https://shaileshchaudhari.vercel.app`.

```bash
for p in / /about; do curl -s "${BASE:-http://localhost:3230}$p" | node -e '
let h="";process.stdin.on("data",d=>h+=d).on("end",()=>{
 const blocks=[...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const nodes=blocks.flatMap(b=>b["@graph"]??(Array.isArray(b)?b:[b]));
 const all=JSON.stringify(blocks), bad=[];
 const person=nodes.find(n=>n["@type"]==="Person")??nodes.map(n=>n.mainEntity).find(e=>e&&e["@type"]==="Person");
 if(!person) bad.push("no Person"); else if(person.name!=="Shailesh Chaudhari") bad.push("Person.name="+person.name);
 if(all.includes("\"seeks\"")) bad.push("seeks present (job-search signal)");
 if(all.includes("SearchAction")) bad.push("SearchAction present (retired)");
 const pp=nodes.find(n=>n["@type"]==="ProfilePage"); if(pp&&!(pp.mainEntity&&pp.mainEntity.name)) bad.push("ProfilePage.mainEntity has no name");
 if(/open to work|hire me|available for (new )?opportunities/i.test(h)) bad.push("job-search copy in HTML");
 console.log(process.argv[1], JSON.stringify({types:nodes.map(n=>n["@type"]),bad}));process.exitCode=bad.length?1:0})' "$p"; done
```

## 6. Live-only extras (skip if offline)

- `curl -sI https://shaileshchaudhari.vercel.app/google5c16a36058a0e9e7.html` must be 200 (Search Console verification).
- `curl -s https://shaileshchaudhari.vercel.app/api/version`: compare its sha with `git rev-parse origin/main`. "Merged" is not "live".

## 7. Report

A table: check · result · numbers pasted from output · VERIFIED/NOT RUN. Stop the server you started. Do not fix anything unless asked.
