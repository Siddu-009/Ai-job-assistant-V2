import re


ACTION_VERBS = {
    "developed",
    "designed",
    "implemented",
    "managed",
    "optimized",
    "created",
    "built",
    "automated",
    "deployed",
    "configured",
    "maintained",
    "improved",
    "led",
    "migrated",
    "integrated",
    "secured",
    "tested",
    "monitored",
    "planned",
    "analyzed",
}


def calculate_ats_score(data):

    score = 0

    details = {}

    # -----------------------
    # Contact Information
    # -----------------------

    personal = data.get("personal_info", {})

    contact_score = 0

    if personal.get("name"):
        contact_score += 2

    if personal.get("email"):
        contact_score += 2

    if personal.get("phone"):
        contact_score += 2

    if personal.get("linkedin"):
        contact_score += 2

    if personal.get("location"):
        contact_score += 2

    score += contact_score

    details["contact"] = contact_score

    # -----------------------
    # Summary
    # -----------------------

    summary_score = 10 if data.get("summary") else 0

    score += summary_score

    details["summary"] = summary_score

    # -----------------------
    # Skills
    # -----------------------

    skill_score = 0

    skill_categories = data.get("skill_categories", [])

    total_skills = sum(
        len(category.get("skills", []))
        for category in skill_categories
    )

    if total_skills >= 20:
        skill_score = 20

    elif total_skills >= 10:
        skill_score = 15

    elif total_skills >= 5:
        skill_score = 10

    score += skill_score

    details["skills"] = skill_score

    # -----------------------
    # Experience
    # -----------------------

    exp_score = 0

    experiences = data.get("experience", [])

    if experiences:

        exp_score = 20

    score += exp_score

    details["experience"] = exp_score

    # -----------------------
    # Projects
    # -----------------------

    project_score = 0

    projects = data.get("projects", [])

    if len(projects) >= 2:

        project_score = 15

    elif len(projects) == 1:

        project_score = 10

    score += project_score

    details["projects"] = project_score

    # -----------------------
    # Education
    # -----------------------

    edu_score = 10 if data.get("education") else 0

    score += edu_score

    details["education"] = edu_score

    # -----------------------
    # Certifications
    # -----------------------

    cert_score = min(
        len(data.get("certifications", [])) * 2,
        10,
    )

    score += cert_score

    details["certifications"] = cert_score

    # -----------------------
    # Action Verbs
    # -----------------------

    verb_score = 0

    count = 0

    for exp in experiences:

        descriptions = exp.get("description", [])

        for line in descriptions:

            words = re.findall(r"\w+", line.lower())

            for word in words:

                if word in ACTION_VERBS:
                    count += 1

    if count >= 10:

        verb_score = 5

    elif count >= 5:

        verb_score = 3

    elif count >= 1:

        verb_score = 1

    score += verb_score

    details["action_verbs"] = verb_score

    return {
        "score": min(score, 100),
        "details": details,
    }