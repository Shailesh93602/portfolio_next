/**
 * migrate-blog.mjs — Blog MDX migration script
 * Run: node scripts/migrate-blog.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const srcPath = join(root, "lib", "blog-data.ts");
const outDir = join(root, "content", "blog");

mkdirSync(outDir, { recursive: true });

const src = readFileSync(srcPath, "utf8");

// ─── 1. Find blogPosts array body ─────────────────────────────────────────────
const arrayMarker = "export const blogPosts: BlogPost[] = [";
const markerIdx = src.indexOf(arrayMarker);
if (markerIdx === -1) throw new Error("Cannot find blogPosts array");

// Find the literal '= [' (skipping the '[]' in BlogPost[])
const arrOpenIdx = src.indexOf("= [", markerIdx) + 2; // land on '['
let arrayBodyStart = arrOpenIdx + 1; // char after '['
let arrayEnd = arrayBodyStart;
let depth = 0;
let inTL = false;

for (let i = arrayBodyStart; i < src.length; i++) {
  const ch = src[i];
  const prev = i > 0 ? src[i - 1] : "";
  if (!inTL) {
    if (ch === "`") { inTL = true; continue; }
    if (ch === "[" || ch === "{") { depth++; continue; }
    if (ch === "]" || ch === "}") {
      if (depth === 0) { arrayEnd = i; break; }
      depth--;
    }
  } else {
    // exit template literal on unescaped backtick
    if (ch === "`" && prev !== "\\") inTL = false;
  }
}

const arrayBody = src.slice(arrayBodyStart, arrayEnd);
console.log(`Array body: ${Math.round(arrayBody.length / 1024)}kB`);

// ─── 2. Split into post chunks ────────────────────────────────────────────────
function splitIntoPostChunks(body) {
  const chunks = [];
  let i = 0;
  while (i < body.length) {
    const start = body.indexOf("  {", i);
    if (start === -1) break;
    let d = 0;
    let inL = false;
    let end = start;
    for (let j = start; j < body.length; j++) {
      const ch = body[j];
      const pv = j > 0 ? body[j - 1] : "";
      if (!inL) {
        if (ch === "`") { inL = true; continue; }
        if (ch === "{") d++;
        else if (ch === "}") {
          d--;
          if (d === 0) { end = j + 1; break; }
        }
      } else {
        if (ch === "`" && pv !== "\\") inL = false;
      }
    }
    if (end > start) {
      chunks.push(body.slice(start, end));
      i = end;
    } else {
      i = start + 3;
    }
  }
  return chunks;
}

const postChunks = splitIntoPostChunks(arrayBody);
console.log(`Found ${postChunks.length} post chunks`);

// ─── 3. Parse each chunk ──────────────────────────────────────────────────────
function getStr(chunk, field) {
  const patterns = [
    new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "s"),
    new RegExp(`${field}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, "s"),
    new RegExp(`${field}:\\s*\\n\\s+"((?:[^"\\\\]|\\\\.)*)"`, "s"),
  ];
  for (const re of patterns) {
    const m = chunk.match(re);
    if (m) return m[1].replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
  }
  return "";
}

function getContent(chunk) {
  const marker = "content: `";
  const start = chunk.indexOf(marker);
  if (start === -1) return "";
  let i = start + marker.length;
  let out = "";
  let exprDepth = 0;
  while (i < chunk.length) {
    const ch = chunk[i];
    const nx = chunk[i + 1];
    const pv = chunk[i - 1] || "";
    if (exprDepth > 0) {
      if (ch === "{") exprDepth++;
      else if (ch === "}") exprDepth--;
      out += ch;
    } else {
      if (ch === "$" && nx === "{") { exprDepth++; out += ch; }
      else if (ch === "`" && pv !== "\\") break; // end of template literal
      else if (ch === "\\" && nx === "`") { out += "`"; i += 2; continue; }
      else out += ch;
    }
    i++;
  }
  return out;
}

function getArray(chunk, field) {
  // Careful: seoKeywords array can span many lines; match lazily up to first unindented ]
  const re = new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\](?:\\s*,|\\s*\\n\\s{0,4}[a-z])`, "");
  const m = chunk.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}

const posts = [];
for (const chunk of postChunks) {
  const slug = getStr(chunk, "slug");
  if (!slug) { console.warn("Chunk with no slug, skipping"); continue; }
  posts.push({
    slug,
    title: getStr(chunk, "title"),
    subtitle: getStr(chunk, "subtitle"),
    description: getStr(chunk, "description"),
    image: getStr(chunk, "image"),
    date: getStr(chunk, "date"),
    readTime: getStr(chunk, "readTime"),
    featured: /featured:\s*true/.test(chunk),
    tags: getArray(chunk, "tags"),
    seoKeywords: getArray(chunk, "seoKeywords"),
    content: getContent(chunk),
  });
}
console.log(`Parsed ${posts.length} posts`);

// ─── 4. Write MDX files ───────────────────────────────────────────────────────
const esc = (s) => String(s ?? "").replace(/"/g, '\\"');

for (const post of posts) {
  const tagsYaml = post.tags.map((t) => `  - "${esc(t)}"`).join("\n") || "  []";
  const kwYaml = post.seoKeywords.map((k) => `  - "${esc(k)}"`).join("\n") || "  []";
  const lines = [
    "---",
    `title: "${esc(post.title)}"`,
    ...(post.subtitle ? [`subtitle: "${esc(post.subtitle)}"`] : []),
    `description: "${esc(post.description)}"`,
    `image: "${esc(post.image)}"`,
    `date: "${esc(post.date)}"`,
    `readTime: "${esc(post.readTime)}"`,
    ...(post.featured ? ["featured: true"] : []),
    "tags:",
    tagsYaml,
    "seoKeywords:",
    kwYaml,
    "---",
    "",
    post.content,
  ];
  writeFileSync(join(outDir, `${post.slug}.mdx`), lines.join("\n"), "utf8");
  console.log(`  ${post.slug}.mdx  (${Math.round(post.content.length/1024)}kB)`);
}

// ─── 5. Write thin blog-data.ts ───────────────────────────────────────────────
const slugList = JSON.stringify(posts.map((p) => p.slug), null, 2);
const thin = `// Centralized blog data source \u2014 metadata only.
// Content lives in content/blog/<slug>.mdx (HTML body after frontmatter).
// To add a post: create the MDX file, add its slug to BLOG_SLUGS below.
// Generated by: node scripts/migrate-blog.mjs

import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    role: string;
    social: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  seoKeywords: string[];
  lastModified?: string;
}

export const BLOG_AUTHOR = {
  name: "Shailesh Chaudhari",
  avatar: "/Images/shailesh.webp",
  bio: "Software Engineer passionate about creating efficient, scalable, and user-friendly web applications. Expert in full-stack development with modern technologies and strong problem-solving skills.",
  role: "Full-Stack Developer & Problem Solver",
  social: {
    twitter: "https://twitter.com/shaileshwork",
    github: "https://github.com/Shailesh93602",
    linkedin: "https://linkedin.com/in/shaileshbhaichaudhari",
  },
};

// Slugs in publication order \u2014 add new slugs here when adding posts.
export const BLOG_SLUGS: string[] = ${slugList};

function loadPost(slug: string): BlogPost | null {
  try {
    const filePath = join(process.cwd(), "content", "blog", \`\${slug}.mdx\`);
    const raw = readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      subtitle: data.subtitle,
      description: data.description ?? "",
      content,
      image: data.image ?? "",
      author: BLOG_AUTHOR,
      date: data.date ?? "",
      readTime: data.readTime ?? "",
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      seoKeywords: data.seoKeywords ?? [],
      lastModified: data.lastModified,
    };
  } catch {
    return null;
  }
}

let _cache: BlogPost[] | null = null;
function getAllPosts(): BlogPost[] {
  if (!_cache) {
    _cache = BLOG_SLUGS.map(loadPost).filter(Boolean) as BlogPost[];
  }
  return _cache;
}

export const blogPosts: BlogPost[] = new Proxy([] as BlogPost[], {
  get(_, prop) {
    return (getAllPosts() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  getAllPosts().find((p) => p.slug === slug);

export const getRelatedPosts = (slug: string, limit = 3): BlogPost[] => {
  const post = getPostBySlug(slug);
  if (!post) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
};
`;
writeFileSync(srcPath, thin, "utf8");
console.log(`\nRewritten lib/blog-data.ts (${Math.round(thin.length/1024)}kB thin index)`);
console.log("Next: npm install gray-matter && npm run type-check");
