import re

SKILLS = [
    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "ansible",
    "linux",
    "python",
    "git",
    "github",
    "prometheus",
    "grafana",
    "helm",
    "argocd",
]


def extract_resume_skills(resume_text: str):
    resume = resume_text.lower()

    found = []

    for skill in SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", resume):
            found.append(skill)

    return found


def match_job(job, resume_skills):

    text = (
        str(job.get("title", "")) + " " +
        str(job.get("description", "")) + " " +
        str(job.get("skills", ""))
    ).lower()

    matched = []
    missing = []

    for skill in resume_skills:
        if skill in text:
            matched.append(skill)

    for skill in SKILLS:
        if skill not in matched and skill in text:
            missing.append(skill)

    score = 0

    if len(resume_skills) > 0:
        score = int((len(matched) / len(resume_skills)) * 100)

    recommendation = (
        "Excellent Match"
        if score >= 80 else
        "Good Match"
        if score >= 60 else
        "Needs Improvement"
    )

    return {
        "score": score,
        "matched": matched,
        "missing": missing,
        "recommendation": recommendation
    }