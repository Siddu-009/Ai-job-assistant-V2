import re


def generate_ai_suggestions(data, job_match=None):

    suggestions = []

    personal = data.get("personal_info", {})

    # -----------------------------
    # Contact Information
    # -----------------------------

    if not personal.get("linkedin"):
        suggestions.append(
            "Add your LinkedIn profile."
        )

    if not personal.get("github"):
        suggestions.append(
            "Include your GitHub profile if you have technical projects."
        )

    if not personal.get("portfolio"):
        suggestions.append(
            "Add your portfolio website."
        )

    # -----------------------------
    # Summary
    # -----------------------------

    summary = data.get("summary", "")

    if len(summary.split()) < 40:
        suggestions.append(
            "Expand your professional summary with your experience, skills, and career goals."
        )

    # -----------------------------
    # Projects
    # -----------------------------

    for project in data.get("projects", []):

        descriptions = project.get("description", [])

        if len(descriptions) < 3:

            suggestions.append(
                f"Project '{project.get('name','Project')}' should contain at least three achievement points."
            )

    # -----------------------------
    # Experience
    # -----------------------------

    for exp in data.get("experience", []):

        descriptions = exp.get("description", [])

        has_number = False

        for line in descriptions:

            if re.search(r"\d+", line):
                has_number = True
                break

        if not has_number:

            company = exp.get("company", "your company")

            suggestions.append(
                f"Add measurable achievements for your experience at {company}."
            )

    # -----------------------------
    # Certifications
    # -----------------------------

    if not data.get("certifications"):

        suggestions.append(
            "Include relevant certifications."
        )

    # -----------------------------
    # Job Match Suggestions
    # -----------------------------

    if job_match:

        missing = job_match.get("missing_keywords", [])

        if missing:

            suggestions.append(
                "Consider adding these keywords where applicable: "
                + ", ".join(missing[:10])
            )

    return suggestions