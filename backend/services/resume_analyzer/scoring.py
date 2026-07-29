SECTION_WEIGHTS = {
    "summary": 10,
    "skills": 20,
    "experience": 25,
    "projects": 20,
    "education": 10,
    "certifications": 5,
    "achievements": 5,
    "languages": 5,
}


def calculate_score(data):

    score = 0

    if data.get("summary"):
        score += 10

    if data.get("skill_categories") or data.get("skills"):
        score += 20

    if data.get("experience"):
        score += 25

    if data.get("projects"):
        score += 20

    if data.get("education"):
        score += 10

    if data.get("certifications"):
        score += 5

    if data.get("achievements"):
        score += 5

    if data.get("languages"):
        score += 5

    return min(score, 100)