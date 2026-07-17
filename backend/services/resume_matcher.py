SKILLS = [
    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "linux",
    "jenkins",
    "git",
    "github",
    "helm",
    "ansible",
    "python",
    "java",
    "mysql",
    "postgresql",
    "redis",
    "mongodb",
    "prometheus",
    "grafana",
    "nginx",
    "apache",
]


def extract_resume_skills(resume_text: str):

    resume_text = (resume_text or "").lower()

    found = []

    for skill in SKILLS:
        if skill in resume_text:
            found.append(skill)

    return found


def match_job(job, resume_skills):

    text = " ".join([
        str(job.get("title", "")),
        str(job.get("description", "")),
        str(job.get("skills", "")),
    ]).lower()

    matched = []
    missing = []

    for skill in resume_skills:
        if skill in text:
            matched.append(skill)

    for skill in SKILLS:
        if skill in text and skill not in matched:
            missing.append(skill)

    total = len(matched) + len(missing)

    if total == 0:
        score = 50
    else:
        score = int((len(matched) / total) * 100)

    return {
        "score": score,
        "matched": matched,
        "missing": missing,
        "recommendation":
            "Great match!"
            if len(missing) == 0
            else
            "Learn " + ", ".join(missing[:3]) + " to improve your chances."
    }