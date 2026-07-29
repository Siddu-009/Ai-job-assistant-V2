def get_weaknesses(data):

    weaknesses = []

    if not data.get("summary"):
        weaknesses.append(
            "Professional summary is missing."
        )

    if not data.get("projects"):
        weaknesses.append(
            "Projects section is missing."
        )

    if not data.get("certifications"):
        weaknesses.append(
            "No certifications found."
        )

    if not data.get("achievements"):
        weaknesses.append(
            "Achievements section is empty."
        )

    return weaknesses