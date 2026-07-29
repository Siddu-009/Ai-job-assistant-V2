REQUIRED_FIELDS = [
    "personal_info",
    "summary",
    "skill_categories",
    "experience",
    "projects",
    "education",
]


def validate_resume(data):

    missing = []

    for field in REQUIRED_FIELDS:

        if field not in data:

            missing.append(field)

    return missing