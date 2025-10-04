import fs from 'fs';
import path from 'path';

// This script extracts slug and date fields from lib/blog-data.ts using a
// lightweight text parse and outputs data/blog-manifest.json for next-sitemap.

const repoRoot = path.resolve(new URL('.', import.meta.url).pathname, '..');
const blogDataPath = path.join(repoRoot, 'lib', 'blog-data.ts');
const outDir = path.join(repoRoot, 'data');
const outFile = path.join(outDir, 'blog-manifest.json');

function parseBlogData(tsText) {
    // Extract each object in the blogPosts array by capturing slug and date inside
    // the same object. This uses a non-greedy match to avoid consuming multiple
    // objects at once and is robust to embedded braces/strings inside content.
    const objectRegex = /\{[\s\S]*?slug:\s*['"]([^'\"]+)['"][\s\S]*?date:\s*['"]([^'\"]+)['"][\s\S]*?\}/gm;
    const results = [];
    let match;
    while ((match = objectRegex.exec(tsText)) !== null) {
        results.push({ slug: match[1], date: match[2] });
    }
    return results;
}

async function main() {
    try {
        const ts = fs.readFileSync(blogDataPath, 'utf8');
        const parsed = parseBlogData(ts);

        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2), 'utf8');

        // success
    } catch (err) {
        console.error('Failed to generate blog manifest:', err);
        process.exit(1);
    }
}

main();
