# Resume source

`resume.html` is the single source of truth for the resume PDF the site serves at
`public/Shailesh_Chaudhari_Resume.pdf`.

**Edit → re-render → commit both files:**

```bash
# from the repo root
node -e "
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/resume/resume.html');
  await p.pdf({ path: 'public/Shailesh_Chaudhari_Resume.pdf', format: 'A4', printBackground: true });
  await b.close();
})();"
```

Rules (from `INTERVIEW_PREP/resume-lines.md`):

- Every number must be reproducible by a command you can name in the room.
- Conservative on ContextQA claims — "shipped and still in use", no company metrics.
- No Holdfast (cut), no demo projects, no claims the code doesn't back.
