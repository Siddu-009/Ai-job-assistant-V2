import re


def extract_resume_keywords(data):
    """
    Extract keywords from resume JSON.
    """

    keywords = set()

    # Skills
    for category in data.get("skill_categories", []):
        for skill in category.get("skills", []):
            keywords.add(skill.lower())

    # Projects
    for project in data.get("projects", []):
        for tech in project.get("tech_stack", []):
            keywords.add(tech.lower())

    # Experience descriptions
    for exp in data.get("experience", []):
        for line in exp.get("description", []):
            words = re.findall(r"[a-zA-Z0-9+#.-]+", line.lower())
            keywords.update(words)

    return keywords


def match_job_description(data, job_description):

    resume_keywords = extract_resume_keywords(data)

    jd_keywords = set(
        re.findall(r"[a-zA-Z0-9+#.-]+", job_description.lower())
    )

    # Remove very short words
    jd_keywords = {
        word
        for word in jd_keywords
        if len(word) > 2
    }

    matched = sorted(resume_keywords & jd_keywords)
    missing = sorted(jd_keywords - resume_keywords)

    score = 0

    if jd_keywords:
        score = round(
            (len(matched) / len(jd_keywords)) * 100
        )

    return {
        "match_score": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "matched_count": len(matched),
        "missing_count": len(missing),
        "total_keywords": len(jd_keywords),
    }