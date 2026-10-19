import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AboutContent from "@/app/about/AboutContent";
import HomeContent from "@/app/HomeContent";

// Chrome does not count an opacity:0 element as painted, so an LCP candidate
// hidden in the server HTML waits for JS or an animation before it counts.
function hiddenAncestors(el: Element | null): string[] {
  const hits: string[] = [];
  for (let n = el; n; n = n.parentElement) {
    const style = (n.getAttribute("style") ?? "").replace(/\s/g, "");
    if (/(^|;)opacity:0(;|$)/.test(style)) hits.push(n.tagName);
  }
  return hits;
}

function parse(markup: string): Document {
  return new DOMParser().parseFromString(markup, "text/html");
}

describe("LCP candidates render visible from the first paint", () => {
  it("/about: the photo, heading and intro paragraph have no opacity:0 ancestor", () => {
    const doc = parse(renderToStaticMarkup(<AboutContent />));
    const img = doc.querySelector('img[alt="Shailesh Chaudhari"]');
    const h1 = doc.querySelector("h1");
    const intro = Array.from(doc.querySelectorAll("p")).find((p) =>
      p.textContent?.includes("At ContextQA I work on")
    );
    expect(img).not.toBeNull();
    expect(h1).not.toBeNull();
    expect(intro).toBeDefined();
    expect(hiddenAncestors(img)).toEqual([]);
    expect(hiddenAncestors(h1)).toEqual([]);
    expect(hiddenAncestors(intro ?? null)).toEqual([]);
  });

  it("/: the hero paragraph has no opacity:0 ancestor", () => {
    const doc = parse(renderToStaticMarkup(<HomeContent featuredPosts={[]} />));
    const hero = doc.querySelector("section h1")?.closest("div.space-y-6");
    const p = hero?.querySelector("p") ?? null;
    expect(p).not.toBeNull();
    expect(hiddenAncestors(p)).toEqual([]);
  });

  it("/: the hero's CSS entrance keyframes never start at opacity 0", () => {
    const read = (f: string) =>
      fs.readFileSync(path.join(process.cwd(), f), "utf8");
    const home = read("app/HomeContent.tsx");
    const css = read("app/globals.css");
    const names = Array.from(
      home.matchAll(/animate-\[([a-z-]+)_/g),
      (m) => m[1]
    );
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      const start = css.indexOf(`@keyframes ${name} {`);
      expect(start).toBeGreaterThan(-1);
      const body = css.slice(start, css.indexOf("\n  }\n", start));
      expect(body).not.toMatch(/opacity:\s*0(\.0*)?\s*;/);
    }
  });
});
