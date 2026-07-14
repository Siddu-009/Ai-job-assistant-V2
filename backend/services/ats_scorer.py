import re

from services.skill_gap_analyzer import extract_skills


def normalize(text):
    if not text:
        return ""
    return re.sub(r"\s+", " ", text.lower())


def calculate_ats_score(resume_text, job_description):

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    matched = sorted(
        list(resume_skills.intersection(jd_skills))
    )

    missing = sorted(
        list(jd_skills.difference(resume_skills))
    )

    if len(jd_skills) == 0:
        score = 0
    else:
        score = round(
            (len(matched) / len(jd_skills)) * 100
        )

    recommendations = []

    if missing:
        recommendations.append(
            "Add the missing technical skills where applicable."
        )

    if score < 75:
        recommendations.append(
            "Improve project descriptions using stronger action verbs."
        )

    recommendations.append(
        "Include measurable achievements."
    )

    recommendations.append(
        "Use ATS-friendly section headings."
    )

    recommendations.append(
        "Keep the resume concise and keyword optimized."
    )

    recommendations = recommendations[:5]

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

        "analysis": {
            "matched": matched,
            "missing": missing
        }

    }