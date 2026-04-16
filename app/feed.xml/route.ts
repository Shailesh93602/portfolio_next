import { NextResponse } from "next/server";
import { blogPosts } from "@/lib/blog-data";

const BASE_URL = "https://shaileshchaudhari.vercel.app";
const AUTHOR = "Shailesh Chaudhari";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = sorted
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const link = `${BASE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(AUTHOR)}</author>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(AUTHOR)} — Blog</title>
    <link>${BASE_URL}/blogs</link>
    <description>Technical articles on full-stack web development, distributed systems, and software engineering by ${escapeXml(AUTHOR)}.</description>
    <language>en-us</language>
    <managingEditor>${escapeXml("shailesh93602@gmail.com")} (${escapeXml(AUTHOR)})</managingEditor>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
