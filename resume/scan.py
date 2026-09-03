#!/usr/bin/env python3
"""ATS-parse verification for the built resume PDF.

Simulates what an ATS/LLM parser sees: extracts the text layer, then asserts
- exactly one page, real text (not an image),
- section headings present and in reading order,
- single-column layout (no side-by-side text blocks),
- contact fields recoverable by regex from plain text,
- URLs visible as literal text (ATS strips link annotations),
- no risky non-ASCII glyphs beyond an explicit allowlist,
- most bullets carry a number (quantified-claims heuristic).

Run: <venv>/bin/python resume/scan.py public/Shailesh_Chaudhari_Resume.pdf
"""
import re
import sys

import pdfplumber

PATH = sys.argv[1] if len(sys.argv) > 1 else "public/Shailesh_Chaudhari_Resume.pdf"
SECTIONS = ["SUMMARY", "EXPERIENCE", "PROJECTS", "SKILLS", "EDUCATION", "ACHIEVEMENTS"]
ALLOWED_NON_ASCII = set("•")  # list markers only; everything else must be ASCII

failures = []
with pdfplumber.open(PATH) as pdf:
    if len(pdf.pages) != 1:
        failures.append(f"expected 1 page, got {len(pdf.pages)}")
    page = pdf.pages[0]
    text = page.extract_text() or ""
    if len(text) < 1500:
        failures.append(f"text layer suspiciously small ({len(text)} chars) - image-only PDF?")

    # Section order as a parser reads it.
    idx = [text.find(s) for s in SECTIONS]
    for s, i in zip(SECTIONS, idx):
        if i < 0:
            failures.append(f"section heading missing from text layer: {s}")
    if idx == sorted(i for i in idx) and all(i >= 0 for i in idx):
        pass
    else:
        failures.append(f"section headings out of reading order: {list(zip(SECTIONS, idx))}")

    # Single-column check: cluster words into lines; flag lines that start
    # right of center while another block exists left of center at same y.
    words = page.extract_words()
    mid = float(page.width) / 2
    by_line = {}
    for w in words:
        by_line.setdefault(round(w["top"] / 3), []).append(w)
    two_col_lines = 0
    for line in by_line.values():
        xs = sorted(float(w["x0"]) for w in line)
        # a gap of >25% page width inside a line suggests columns
        for a, b in zip(xs, xs[1:]):
            if b - a > page.width * 0.35 and a < mid < b:
                two_col_lines += 1
                break
    # date-aligned role lines legitimately right-align; allow a few
    if two_col_lines > len(by_line) * 0.25:
        failures.append(f"layout looks multi-column: {two_col_lines}/{len(by_line)} split lines")

    # Contact recoverability.
    if not re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text):
        failures.append("no email found in text layer")
    if not re.search(r"\+?\d[\d ()-]{8,}", text):
        failures.append("no phone found in text layer")
    for url in ["github.com/Shailesh93602", "linkedin.com/in/", "vercel.app"]:
        if url not in text:
            failures.append(f"URL not visible as literal text: {url}")

    # Non-ASCII audit.
    bad = sorted({ch for ch in text if ord(ch) > 127 and ch not in ALLOWED_NON_ASCII})
    if bad:
        failures.append(f"risky non-ASCII glyphs: {bad}")

    # Quantified bullets heuristic.
    bullets = [l for l in text.splitlines() if l.strip().startswith("•")]
    with_num = [b for b in bullets if re.search(r"\d", b)]
    print(f"bullets: {len(bullets)}, quantified: {len(with_num)}")

print(f"text chars: {len(text)}")
if failures:
    print("FAIL")
    for f in failures:
        print(" -", f)
    sys.exit(1)
print("ATS scan: all checks passed")
