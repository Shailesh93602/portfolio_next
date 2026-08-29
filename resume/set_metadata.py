#!/usr/bin/env python3
"""Stamp document metadata onto the built resume PDF (needs pypdf).

Run after build.mjs: <venv>/bin/python resume/set_metadata.py
"""
import json
from pathlib import Path

from pypdf import PdfReader, PdfWriter

HERE = Path(__file__).parent
data = json.loads((HERE / "resume.json").read_text())
pdf_path = HERE.parent / "public" / "Shailesh_Chaudhari_Resume.pdf"

reader = PdfReader(pdf_path)
writer = PdfWriter()
writer.append(reader)
writer.add_metadata(
    {
        "/Title": f"{data['name']} - Resume",
        "/Author": data["name"],
        "/Subject": data["title"],
        "/Keywords": ", ".join(s["items"] for s in data["skills"]),
    }
)
with open(pdf_path, "wb") as f:
    writer.write(f)
print("metadata stamped:", pdf_path.name)
