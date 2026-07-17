from services.live_jobs import search_live_jobs
from services.resume_matcher import (
    extract_resume_skills,
    match_job
)
from services.ats import calculate_ats_score

async def get_recommended_jobs(
    resume_text: str,
    keyword: str = "",
    location: str = ""
):

    resume_skills = extract_resume_skills(
        resume_text
    )

    jobs = await search_live_jobs(
        keyword,
        location
    )

    recommendations = []

    for job in jobs:

        result = match_job(
            job,
            resume_skills
        )

        job["score"] = result["score"]
        job["matched_skills"] = result["matched"]
        job["missing_skills"] = result["missing"]
        job["recommendation"] = result["recommendation"]

        # Calculate ATS score FIRST
        ats = calculate_ats_score(
            resume_text,
            job
        )

        job["ats_score"] = ats["score"]
        job["ats_missing"] = ats["missing"]

        # Now calculate the final AI score
        final_score = result["score"]

        if keyword:
            title = job.get("title", "").lower()
            if keyword.lower() in title:
                final_score += 25

        if location:
            loc = job.get("location", "").lower()
            if location.lower() in loc:
                final_score += 15

        final_score += ats["score"] * 0.3

        job["final_score"] = final_score

        recommendations.append(job)

        ats = calculate_ats_score(
            resume_text,
            job
        )

        job["ats_score"] = ats["score"]

        job["ats_missing"] = ats["missing"]

        recommendations.append(job)

    recommendations.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return recommendations[:20], resume_skills