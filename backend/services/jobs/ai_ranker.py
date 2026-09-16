from services.jobs.role_mapper import expand_role
from services.jobs.location_ranker import expand_location


def rank_jobs(
    jobs,
    keyword="",
    location=""
):

    expanded_roles = expand_role(keyword)
    expanded_locations = expand_location(location)

    for job in jobs:

        score = 0

        searchable = (
            f"{job.title} "
            f"{job.description} "
            f"{' '.join(job.skills)}"
        ).lower()

        # -------------------------
        # Role Score (50)
        # -------------------------
        for role in expanded_roles:

            if role.lower() in searchable:
                score += 50
                break

        # -------------------------
        # Location Score (30)
        # -------------------------
        if location:

            job_location = job.location.lower()

            for city in expanded_locations:

                if city.lower() in job_location:
                    score += 30
                    break

        # -------------------------
        # Remote Bonus (10)
        # -------------------------
        if job.remote:
            score += 10

        # -------------------------
        # Skills Bonus (10)
        # -------------------------
        if job.skills:
            score += 10

        job.ai_score = min(score, 100)

    jobs.sort(
        key=lambda x: x.ai_score,
        reverse=True
    )

    return jobs