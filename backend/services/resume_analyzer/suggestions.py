def generate_suggestions(data):

    suggestions = []

    if not data.get("summary"):
        suggestions.append(
            "Add a professional summary."
        )

    if not data.get("github"):
        suggestions.append(
            "Include your GitHub profile."
        )

    if not data.get("portfolio"):
        suggestions.append(
            "Add a portfolio website."
        )

    if not data.get("certifications"):
        suggestions.append(
            "Include relevant certifications."
        )

    return suggestions