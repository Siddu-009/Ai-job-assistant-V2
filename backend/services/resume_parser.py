import re
import fitz
from docx import Document


def parse_resume(text):

    text = text or ""

    sections = {
        "summary": "",
        "skills": "",
        "projects": "",
        "education": "",
        "experience": ""
    }

    lower = text.lower()

    if "summary" in lower:
        sections["summary"] = text

    if "skill" in lower:
        sections["skills"] = text

    if "project" in lower:
        sections["projects"] = text

    if "education" in lower:
        sections["education"] = text

    if "experience" in lower:
        sections["experience"] = text

    return sections


# -----------------------------
# New functions
# -----------------------------

def extract_pdf_text(file):
    pdf = fitz.open(stream=file.read(), filetype="pdf")
    text = ""

    for page in pdf:
        text += page.get_text()

    return text


def extract_docx_text(file):
    document = Document(file)
    return "\n".join(p.text for p in document.paragraphs)


def get_resume_text(file=None, filename=None, pasted_text=None):

    if pasted_text:
        return pasted_text.strip()

    if file and filename.endswith(".pdf"):
        return extract_pdf_text(file)

    if file and filename.endswith(".docx"):
        return extract_docx_text(file)

    raise Exception("Unsupported file format")