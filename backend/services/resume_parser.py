import re


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