REQUIRED_SECTIONS = [
    "summary",
    "skill_categories",
    "experience",
    "projects",
    "education",
]


def check_sections(data):

    missing = []

    for section in REQUIRED_SECTIONS:

        value = data.get(section)

        if not value:
            missing.append(section)

    return missing