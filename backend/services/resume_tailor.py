import re


def extract_keywords(job):

    text = " ".join([
        str(job.get("title", "")),
        str(job.get("description", "")),
        str(job.get("skills", ""))
    ])

    words = re.findall(r"[A-Za-z0-9+#.-]+", text.lower())

    keywords = []

    for word in words:

        if len(word) < 3:
            continue

        if word not in keywords:
            keywords.append(word)

    return keywords[:50]

def tailor_resume(resume_text, job):

    keywords = extract_keywords(job)

    improved_resume = resume_text.strip()

    improved_resume += "\n\n"

    improved_resume += "Relevant Skills:\n"

    for keyword in keywords[:20]:
        improved_resume += f"• {keyword}\n"

    return improved_resume