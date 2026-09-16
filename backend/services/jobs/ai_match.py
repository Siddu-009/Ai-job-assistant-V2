from services.jobs.role_mapper import expand_role
from services.jobs.location_ranker import expand_location


def calculate_ai_match(
    job,
    keyword="",
    location="",
    experience=""
):

    score = 0
    matched = []
    missing = []

    title = (job.title or "").lower()
    description = (job.description or "").lower()
    skills = " ".join(job.skills or []).lower()
    job_location = (job.location or "").lower()

    # -------------------------
    # Title Match (40)
    # -------------------------
    if keyword:

        keyword_lower = keyword.lower()

        if keyword_lower in title:
            score += 40
            matched.append(f"Title: {keyword}")

        else:

            found = False

            for role in expand_role(keyword):

                if role.lower() in title:
                    score += 40
                    matched.append(f"Title: {role}")
                    found = True
                    break

            if not found:
                missing.append(f"Title: {keyword}")

    # -------------------------
    # Description / Skills Match (20)
    # -------------------------
    if keyword:

        searchable = description + " " + skills

        for role in expand_role(keyword):

            if role.lower() in searchable:
                score += 20
                matched.append(f"Skill: {role}")
                break

    # -------------------------
    # Location Match (20)
    # -------------------------
    if location:

        for city in expand_location(location):

            if city.lower() in job_location:
                score += 20
                matched.append(f"Location: {city}")
                break

    # -------------------------
    # Remote Bonus (10)
    # -------------------------
    if job.remote:
        score += 10

    # -------------------------
    # Skills Available Bonus (10)
    # -------------------------
    if job.skills:
        score += 10

    # -------------------------
    # Fresher Penalty
    # -------------------------
    if experience:

        if experience.lower() == "fresher":

            senior_words = [
                "senior",
                "lead",
                "principal",
                "staff",
                "manager",
                "director",
                "architect"
            ]

            if any(word in title for word in senior_words):
                score -= 30

    score = max(0, min(score, 100))

    return {
        "score": score,
        "matched_skills": matched,
        "missing_skills": missing
    }