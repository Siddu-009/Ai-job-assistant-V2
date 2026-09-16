import re

from services.skill_gap_analyzer import extract_skills


def normalize(text):
    if not text:
        return ""

    return re.sub(
        r"\s+",
        " ",
        text.lower()
    ).strip()


def contains_any(text, keywords):
    """
    Check whether any keyword exists in the text.
    """

    text = normalize(text)

    return any(
        keyword.lower() in text
        for keyword in keywords
    )


def calculate_ats_score(
    resume_text,
    job_description
):

    resume_text = resume_text or ""
    job_description = job_description or ""

    resume_lower = normalize(
        resume_text
    )

    job_lower = normalize(
        job_description
    )

    # ==================================================
    # SKILLS
    # ==================================================

    resume_skills = extract_skills(
        resume_text
    )

    jd_skills = extract_skills(
        job_description
    )

    matched = sorted(
        list(
            resume_skills.intersection(
                jd_skills
            )
        )
    )

    missing = sorted(
        list(
            jd_skills.difference(
                resume_skills
            )
        )
    )

    total_keywords = len(jd_skills)

    matched_count = len(matched)

    if total_keywords > 0:

        keyword_match_percentage = round(
            (
                matched_count /
                total_keywords
            ) * 100
        )

    else:

        keyword_match_percentage = 0


    # ==================================================
    # CONTACT INFORMATION
    # 10 POINTS
    # ==================================================

    contact_score = 0

    email_pattern = (
        r"[A-Za-z0-9._%+-]+@"
        r"[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    )

    phone_pattern = (
        r"(\+?\d[\d\s\-()]{8,})"
    )

    if re.search(
        email_pattern,
        resume_text
    ):

        contact_score += 5

    if re.search(
        phone_pattern,
        resume_text
    ):

        contact_score += 5


    # ==================================================
    # SUMMARY
    # 10 POINTS
    # ==================================================

    summary_score = 0

    summary_keywords = [
        "summary",
        "professional summary",
        "profile",
        "objective",
        "career objective"
    ]

    if contains_any(
        resume_text,
        summary_keywords
    ):

        summary_score = 10

    elif len(resume_text) > 100:

        summary_score = 5


    # ==================================================
    # SKILLS / JOB KEYWORD MATCH
    # 25 POINTS
    # ==================================================

    if total_keywords > 0:

        skills_score = round(
            (
                matched_count /
                total_keywords
            ) * 25
        )

    else:

        skills_score = 15


    # ==================================================
    # EXPERIENCE
    # 15 POINTS
    # ==================================================

    experience_keywords = [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "responsibilities"
    ]

    experience_score = 0

    if contains_any(
        resume_text,
        experience_keywords
    ):

        experience_score = 15

    elif len(resume_text) > 300:

        experience_score = 8


    # ==================================================
    # PROJECTS
    # 10 POINTS
    # ==================================================

    project_keywords = [
        "project",
        "projects",
        "project experience"
    ]

    projects_score = 0

    if contains_any(
        resume_text,
        project_keywords
    ):

        projects_score = 10

    elif len(resume_text) > 300:

        projects_score = 5


    # ==================================================
    # EDUCATION
    # 10 POINTS
    # ==================================================

    education_keywords = [
        "education",
        "b.tech",
        "btech",
        "bachelor",
        "degree",
        "university",
        "college",
        "diploma",
        "graduation"
    ]

    education_score = 0

    if contains_any(
        resume_text,
        education_keywords
    ):

        education_score = 10


    # ==================================================
    # CERTIFICATIONS
    # 5 POINTS
    # ==================================================

    certification_keywords = [
        "certification",
        "certifications",
        "certified",
        "certificate"
    ]

    certifications_score = 0

    if contains_any(
        resume_text,
        certification_keywords
    ):

        certifications_score = 5


    # ==================================================
    # ACTION VERBS
    # 15 POINTS
    # ==================================================

    action_verbs = [
        "managed",
        "developed",
        "designed",
        "implemented",
        "automated",
        "deployed",
        "configured",
        "optimized",
        "engineered",
        "created",
        "built",
        "maintained",
        "monitored",
        "provisioned",
        "administered",
        "integrated",
        "migrated",
        "improved",
        "reduced",
        "increased",
        "secured",
        "delivered",
        "implemented"
    ]

    action_verb_count = 0

    for verb in action_verbs:

        if re.search(
            r"\b"
            + re.escape(verb)
            + r"\b",
            resume_lower
        ):

            action_verb_count += 1


    if action_verb_count >= 6:

        action_verbs_score = 15

    elif action_verb_count >= 3:

        action_verbs_score = 10

    elif action_verb_count >= 1:

        action_verbs_score = 5

    else:

        action_verbs_score = 0


    # ==================================================
    # FINAL ATS SCORE
    # ==================================================

    ats_breakdown = {

        "contact": contact_score,

        "summary": summary_score,

        "skills": skills_score,

        "experience": experience_score,

        "projects": projects_score,

        "education": education_score,

        "certifications": certifications_score,

        "action_verbs": action_verbs_score

    }


    overall_score = sum(
        ats_breakdown.values()
    )

    overall_score = min(
        100,
        max(
            0,
            overall_score
        )
    )

    ats_score = overall_score


    # ==================================================
    # STRENGTHS
    # ==================================================

    strengths = []

    if contact_score >= 10:

        strengths.append(
            "Complete contact information is available."
        )

    elif contact_score >= 5:

        strengths.append(
            "Some contact information is available."
        )


    if summary_score >= 10:

        strengths.append(
            "Professional summary is present."
        )


    if skills_score >= 18:

        strengths.append(
            "Strong alignment between resume skills and job requirements."
        )


    if experience_score >= 15:

        strengths.append(
            "Professional experience section is available."
        )


    if projects_score >= 10:

        strengths.append(
            "Projects section is available."
        )


    if education_score >= 10:

        strengths.append(
            "Education information is available."
        )


    if certifications_score >= 5:

        strengths.append(
            "Relevant certifications are included."
        )


    if action_verbs_score >= 10:

        strengths.append(
            "Resume uses strong action verbs."
        )


    # ==================================================
    # WEAKNESSES
    # ==================================================

    weaknesses = []


    if contact_score < 10:

        weaknesses.append(
            "Resume is missing some contact information."
        )


    if summary_score < 10:

        weaknesses.append(
            "Professional summary is missing or incomplete."
        )


    if skills_score < 15:

        weaknesses.append(
            "Resume is missing several important job-related keywords."
        )


    if experience_score < 15:

        weaknesses.append(
            "Professional experience section is missing or incomplete."
        )


    if projects_score < 10:

        weaknesses.append(
            "Projects section is missing or incomplete."
        )


    if education_score < 10:

        weaknesses.append(
            "Education section is missing."
        )


    if action_verbs_score < 10:

        weaknesses.append(
            "Resume could use stronger action verbs."
        )


    # ==================================================
    # SUGGESTIONS
    # ==================================================

    suggestions = []


    if missing:

        suggestions.append(
            "Consider adding these keywords where applicable: "
            + ", ".join(
                missing[:10]
            )
        )


    if action_verbs_score < 10:

        suggestions.append(
            "Use stronger action verbs such as "
            "implemented, automated, designed and optimized."
        )


    suggestions.append(
        "Include measurable achievements such as percentages, "
        "time saved, cost reduction or performance improvements."
    )


    suggestions.append(
        "Use ATS-friendly section headings such as "
        "Summary, Skills, Experience, Projects and Education."
    )


    suggestions.append(
        "Keep formatting simple and avoid tables, graphics "
        "and unnecessary decorative elements."
    )


    suggestions = suggestions[:5]


    # ==================================================
    # VERDICT
    # ==================================================

    if ats_score >= 90:

        verdict = "Excellent ATS Match"

    elif ats_score >= 75:

        verdict = "Good ATS Match"

    elif ats_score >= 60:

        verdict = "Average ATS Match"

    elif ats_score >= 40:

        verdict = "Needs Improvement"

    else:

        verdict = "Low ATS Match"


    # ==================================================
    # FINAL RESPONSE
    # ==================================================

    return {

        "success": True,

        "analysis": {

            "overall_score": ats_score,

            "ats_score": ats_score,

            "verdict": verdict,

            "strengths": strengths,

            "weaknesses": weaknesses,

            "suggestions": suggestions,

            "ats_breakdown": ats_breakdown,

            "job_match": {

                "match_score": keyword_match_percentage,

                "matched_keywords": matched,

                "missing_keywords": missing,

                "matched_count": matched_count,

                "missing_count": len(missing),

                "total_keywords": total_keywords

            }

        }

    }