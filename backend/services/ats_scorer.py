import re

from services.ats_ai import extract_requirements


def normalize(text):
    return re.sub(r"\s+", " ", text.lower())


def exists(keyword, resume):

    keyword = normalize(keyword)

    resume = normalize(resume)

    return keyword in resume


def compare_list(items, resume):

    matched = []
    missing = []

    for item in items:

        if exists(item, resume):

            matched.append(item)

        else:

            missing.append(item)

    return matched, missing


def calculate_ats_score(resume_text, job_description):

    resume = normalize(resume_text)

    requirements = extract_requirements(job_description)

    matched = []
    missing = []

    sections = {}

    total_items = 0

    matched_items = 0

    categories = [

        "skills",
        "tools",
        "frameworks",
        "soft_skills",
        "certifications"

    ]

    for category in categories:

        values = requirements.get(category, [])

        m, ms = compare_list(values, resume)

        sections[category] = {

            "matched": m,

            "missing": ms

        }

        matched.extend(m)

        missing.extend(ms)

        total_items += len(values)

        matched_items += len(m)

    if total_items == 0:

        score = 0

    else:

        score = round((matched_items / total_items) * 100)

    recommendations = []

    for category in categories:

        if sections[category]["missing"]:

            recommendations.append(

                f"Improve {category.replace('_',' ')}"

            )

    if score >= 90:

        verdict = "Excellent ATS Match"

    elif score >= 75:

        verdict = "Good ATS Match"

    elif score >= 60:

        verdict = "Average ATS Match"

    else:

        verdict = "Needs Improvement"

    return {

        "success": True,

        "score": score,

        "ats_score": score,

        "verdict": verdict,

        "matched_skills": matched,

        "missing_skills": missing,

        "recommendations": recommendations,

        "analysis": sections,

        "requirements": requirements

    }
