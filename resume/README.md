# Resume source

**`resume.json` is the single source of truth.** Everything else is compiled from it:

| Artifact                                | Built by                                            | Purpose                                                        |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `public/Shailesh_Chaudhari_Resume.pdf`  | `node resume/build.mjs`                             | What the site serves. Text-based, single-column, A4, one page. |
| `resume/Shailesh_Chaudhari_Resume.docx` | `python resume/build_docx.py` (needs `python-docx`) | For portals that parse DOCX best.                              |
| `resume/resume.txt`                     | `node resume/build.mjs`                             | Plain-text fallback for paste-into-form portals.               |
| `resume/resume.html`                    | `node resume/build.mjs`                             | Intermediate render input (gitignored).                        |

**Edit → rebuild → verify → commit:**

```bash
# from the repo root
node resume/build.mjs
python resume/set_metadata.py                                  # needs pypdf
python resume/scan.py public/Shailesh_Chaudhari_Resume.pdf   # needs pdfplumber
python resume/build_docx.py                                   # needs python-docx
```

`scan.py` simulates an ATS parse of the PDF: one page, real text layer, section
headings present and in reading order, single-column layout, contact fields
recoverable by regex, URLs visible as literal text, no risky non-ASCII glyphs,
bullets present in the text layer. It exits non-zero on any failure — run it
after every rebuild.

## ATS/AI-screener rules encoded here (researched 2026-08)

- **Single column, top-to-bottom** — parsers read in one pass; columns scramble order.
- Standard headings (SUMMARY / EXPERIENCE / PROJECTS / SKILLS / EDUCATION / ACHIEVEMENTS).
- Standard fonts (Helvetica/Arial in PDF, Calibri in DOCX); no icons, images, or tables.
- Bullets are **literal text** ("• "), not CSS markers — CSS markers don't exist in the text layer.
- URLs written out as visible text — ATS strips link annotations.
- Acronym + full term together where it matters (RBAC, DLQ, CI/CD).
- Digits, not number-words, in quantified claims.
- ASCII-only content (the bullet glyph is the one allowed exception).

## Content rules (from `INTERVIEW_PREP/resume-lines.md`)

- Every number must be reproducible by a command you can name in the room.
- Conservative on ContextQA claims — "shipped and still in use", no company metrics.
- No Holdfast (cut), no demo projects, no claims the code doesn't back.
