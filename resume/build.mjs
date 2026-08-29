// Resume build: resume.json -> resume.html -> public/Shailesh_Chaudhari_Resume.pdf + resume.txt
// Run from repo root: node resume/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const data = JSON.parse(
  readFileSync(new URL("./resume.json", import.meta.url))
);

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const c = data.contact;
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(data.name)} - Resume</title>
<style>
  @page { size: A4; margin: 10mm 14mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Helvetica, Arial, sans-serif; font-size: 9.3pt; line-height: 1.34; color: #111; }
  h1 { font-size: 16pt; }
  .headline { font-size: 10pt; color: #333; margin-top: 1px; }
  .contact { font-size: 8.8pt; color: #333; margin-top: 3px; }
  .contact a { color: #0b57a4; text-decoration: none; }
  h2 { font-size: 9.8pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #222; padding-bottom: 1px; margin: 8px 0 4px; }
  .role { display: flex; justify-content: space-between; align-items: baseline; margin-top: 5px; }
  .role b { font-size: 9.6pt; }
  .dates { font-size: 8.6pt; color: #444; white-space: nowrap; }
  ul { margin: 1px 0 0 2px; list-style: none; }
  li { margin-bottom: 1.5px; }
  .proj { margin-top: 4px; }
  .links a { color: #0b57a4; text-decoration: none; font-size: 8.6pt; }
  .tag { color: #444; font-size: 8.8pt; }
  .skills li { margin-bottom: 1px; }
</style>
</head>
<body>

<h1>${esc(data.name)}</h1>
<div class="headline">${esc(data.title)}</div>
<div class="contact">
  <a href="mailto:${c.email}">${c.email}</a> | ${esc(c.phone)} |
  <a href="https://${c.github}">${c.github}</a> |
  <a href="https://${c.linkedin}">${c.linkedin}</a> |
  <a href="https://${c.portfolio}">${c.portfolio}</a>
</div>

<h2>Summary</h2>
<div>${esc(data.summary)}</div>

<h2>Experience</h2>
${data.experience
  .map(
    (e) => `
<div class="role"><span><b>${esc(e.title)}</b>, ${esc(e.company)}</span><span class="dates">${esc(e.start)} - ${esc(e.end)}</span></div>
<ul>${e.bullets.map((b) => `<li>\u2022 ${esc(b)}</li>`).join("")}</ul>`
  )
  .join("")}

<h2>Projects</h2>
${data.projects
  .map(
    (p) => `
<div class="proj"><b>${esc(p.name)}</b> <span class="tag">- ${esc(p.tagline)}</span>
<span class="links">${p.links.map((l) => `<a href="https://${l}">${l}</a>`).join(" | ")}</span>
<ul>${p.bullets.map((b) => `<li>\u2022 ${esc(b)}</li>`).join("")}</ul>
</div>`
  )
  .join("")}

<h2>Skills</h2>
<ul class="skills">
${data.skills.map((s) => `  <li>\u2022 <b>${esc(s.label)}:</b> ${esc(s.items)}</li>`).join("\n")}
</ul>

<h2>Education</h2>
<ul class="skills">
${data.education.map((e) => `  <li>\u2022 ${esc(e)}</li>`).join("\n")}
</ul>

<h2>Achievements</h2>
<ul class="skills">
${data.achievements.map((a) => `  <li>\u2022 ${esc(a)}</li>`).join("\n")}
</ul>

</body>
</html>
`;

writeFileSync(new URL("./resume.html", import.meta.url), html);

// Plain-text version (the purest ATS fallback), generated from the same data.
const txt = [
  data.name,
  data.title,
  `${c.email} | ${c.phone} | ${c.github} | ${c.linkedin} | ${c.portfolio}`,
  "",
  "SUMMARY",
  data.summary,
  "",
  "EXPERIENCE",
  ...data.experience.flatMap((e) => [
    `${e.title}, ${e.company} (${e.start} - ${e.end})`,
    ...e.bullets.map((b) => `- ${b}`),
    "",
  ]),
  "PROJECTS",
  ...data.projects.flatMap((p) => [
    `${p.name} - ${p.tagline} (${p.links.join(", ")})`,
    ...p.bullets.map((b) => `- ${b}`),
    "",
  ]),
  "SKILLS",
  ...data.skills.map((s) => `- ${s.label}: ${s.items}`),
  "",
  "EDUCATION",
  ...data.education.map((e) => `- ${e}`),
  "",
  "ACHIEVEMENTS",
  ...data.achievements.map((a) => `- ${a}`),
].join("\n");
writeFileSync(new URL("./resume.txt", import.meta.url), txt + "\n");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(new URL("./resume.html", import.meta.url).href);
await page.pdf({
  path: "public/Shailesh_Chaudhari_Resume.pdf",
  format: "A4",
  printBackground: true,
});
await browser.close();
console.log(
  "built: resume.html, resume.txt, public/Shailesh_Chaudhari_Resume.pdf"
);
