import re


def normalize(text):
    return str(text or "").lower().strip()


def calculate_match_score(job, search):

    score = 0

    title = normalize(job.get("title"))
    description = normalize(job.get("description"))
    skills = normalize(job.get("skills"))
    location = normalize(job.get("location"))

    # -------------------------
    # Role Matching
    # -------------------------

    primary_role = normalize(search.get("primary_role"))

    if primary_role:

        if primary_role in title:
            score += 50

        elif primary_role in description:
            score += 35

    # -------------------------
    # Related Roles
    # -------------------------

    for role in search.get("related_roles", []):

        role = normalize(role)

        if role in title:
            score += 25

        elif role in description:
            score += 15

    # -------------------------
    # Skills
    # -------------------------

    matched_skills = []

    missing_skills = []

    for skill in search.get("skills", []):

        s = normalize(skill)

        if s in skills or s in description:

            score += 6
            matched_skills.append(skill)

        else:

            missing_skills.append(skill)

    # -------------------------
    # Location
    # -------------------------

    search_location = normalize(search.get("location"))

    if search_location:

        if search_location in location:

            score += 20

    # -------------------------
    # Cap Score
    # -------------------------

    score = min(score, 100)

    job["match_score"] = score

    job["matched_skills"] = matched_skills

    job["missing_skills"] = missing_skills

    return job


def rank_jobs(jobs, search):

    ranked = []

    for job in jobs:

        ranked.append(

            calculate_match_score(
                job,
                search
            )

        )

    ranked.sort(

        key=lambda x: x["match_score"],

        reverse=True

    )

    return ranked