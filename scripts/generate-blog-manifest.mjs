import fs from "fs";
import path from "path";
import matter from "gray-matter";

// This script reads all MDX files in content/blog/ and outputs
// data/blog-manifest.json (slug + date) for next-sitemap.
// It falls back to parsing BLOG_SLUGS from lib/blog-data.ts if needed.

const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..");
const contentDir = path.join(repoRoot, "content", "blog");
const outDir = path.join(repoRoot, "data");
const outFile = path.join(outDir, "blog-manifest.json");

async function main() {
  try {
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

    const results = files
      .map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
        const { data } = matter(raw);
        return { slug, date: data.date ?? "" };
      })
      .sort((a, b) => a.slug.localeCompare(b.slug));

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2), "utf8");

    console.log(`Generated blog-manifest.json with ${results.length} entries`);
  } catch (err) {
    console.error("Failed to generate blog manifest:", err);
    process.exit(1);
  }
}

main();
