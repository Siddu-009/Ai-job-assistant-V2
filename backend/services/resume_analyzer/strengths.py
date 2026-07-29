def get_strengths(data):

    strengths = []

    if data.get("summary"):
        strengths.append(
            "Professional summary is present."
        )

    if len(data.get("experience", [])) >= 2:
        strengths.append(
            "Strong work experience."
        )

    if len(data.get("projects", [])) >= 2:
        strengths.append(
            "Good project portfolio."
        )

    if data.get("certifications"):
        strengths.append(
            "Relevant certifications included."
        )

    if data.get("languages"):
        strengths.append(
            "Languages section included."
        )

    return strengths