from copy import deepcopy
from typing import Any

from services.live_jobs import search_live_jobs
from services.resume_matcher import (
    extract_resume_skills,
    match_job
)
from services.ats import calculate_ats_score


MAX_RECOMMENDATIONS = 20


def clean_text(value: Any) -> str:
    """
    Convert any value into clean lowercase text.
    """
    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(str(item) for item in value).lower().strip()

    if isinstance(value, dict):
        return " ".join(
            f"{key} {value}"
            for key, value in value.items()
        ).lower().strip()

    return str(value).lower().strip()


def normalize_search_value(value: str) -> str:
    """
    Normalize keyword and location input.
    """
    return " ".join(
        str(value or "").lower().split()
    ).strip()


def matches_keyword(job: dict, keyword: str) -> bool:
    """
    Check whether the keyword exists in relevant job fields.
    """
    keyword = normalize_search_value(keyword)

    if not keyword:
        return True

    searchable_text = " ".join([
        clean_text(job.get("title")),
        clean_text(job.get("company")),
        clean_text(job.get("description")),
        clean_text(job.get("skills")),
    ])

    return keyword in searchable_text


def matches_location(job: dict, location: str) -> bool:
    """
    Check the requested location against the job location.
    Remote jobs are accepted when the user searches for remote.
    """
    location = normalize_search_value(location)

    if not location:
        return True

    job_location = clean_text(job.get("location"))
    job_country = clean_text(job.get("country"))

    searchable_location = " ".join([
        job_location,
        job_country
    ]).strip()

    if location in searchable_location:
        return True

    # Handle common remote search terms
    remote_terms = {
        "remote",
        "work from home",
        "wfh",
        "anywhere"
    }

    if location in remote_terms:
        return any(
            term in searchable_location
            for term in remote_terms
        )

    return False


def get_job_unique_key(job: dict) -> str:
    """
    Generate a stable unique key for deduplication.
    Prefer job ID, then application URL.
    """
    job_id = clean_text(
        job.get("id") or job.get("job_id")
    )

    apply_url = clean_text(
        job.get("apply_url") or job.get("url")
    )

    title = clean_text(job.get("title"))
    company = clean_text(job.get("company"))

    if job_id:
        return f"id:{job_id}"

    if apply_url:
        return f"url:{apply_url}"

    return f"title:{title}|company:{company}"


def deduplicate_jobs(jobs: list[dict]) -> list[dict]:
    """
    Remove duplicate jobs using ID, URL, or title/company.
    """
    unique_jobs = {}
    result = []

    for job in jobs:
        if not isinstance(job, dict):
            continue

        key = get_job_unique_key(job)

        if key in unique_jobs:
            continue

        unique_jobs[key] = True
        result.append(job)

    return result


def safe_score(value: Any) -> float:
    """
    Convert a score into a safe number between 0 and 100.
    """
    try:
        score = float(value or 0)
    except (TypeError, ValueError):
        return 0.0

    return max(0.0, min(score, 100.0))


def get_text_match_bonus(
    job: dict,
    keyword: str,
    location: str
) -> float:
    """
    Add small bonuses for matching search filters.
    """
    bonus = 0.0

    keyword = normalize_search_value(keyword)
    location = normalize_search_value(location)

    title = clean_text(job.get("title"))
    job_location = clean_text(job.get("location"))

    if keyword and keyword in title:
        bonus += 10.0

    if location and location in job_location:
        bonus += 10.0

    return bonus


async def get_recommended_jobs(
    resume_text: str,
    keyword: str = "",
    location: str = ""
):
    """
    Generate resume-based job recommendations.

    Process:
    1. Extract skills from the resume.
    2. Fetch live jobs.
    3. Remove duplicates.
    4. Match jobs against resume skills.
    5. Calculate ATS score once.
    6. Calculate final recommendation score.
    7. Sort and return the top results.
    """

    if not resume_text or not str(resume_text).strip():
        return [], []

    keyword = normalize_search_value(keyword)
    location = normalize_search_value(location)

    # --------------------------------------------------
    # 1. Extract resume skills
    # --------------------------------------------------
    resume_skills = extract_resume_skills(
        str(resume_text)
    )

    if resume_skills is None:
        resume_skills = []

    # --------------------------------------------------
    # 2. Fetch live jobs
    # --------------------------------------------------
    jobs = await search_live_jobs(
        keyword=keyword,
        location=location
    )

    if not jobs:
        return [], resume_skills

    # --------------------------------------------------
    # 3. Remove duplicate jobs
    # --------------------------------------------------
    jobs = deduplicate_jobs(jobs)

    recommendations = []

    # --------------------------------------------------
    # 4. Process each job
    # --------------------------------------------------
    for original_job in jobs:

        if not isinstance(original_job, dict):
            continue

        # Do not modify the original provider object
        job = deepcopy(original_job)

        # Extra safety filtering
        if not matches_keyword(job, keyword):
            continue

        if not matches_location(job, location):
            continue

        try:
            # ------------------------------------------
            # Resume skill matching
            # ------------------------------------------
            match_result = match_job(
                job,
                resume_skills
            ) or {}

            skill_score = safe_score(
                match_result.get("score", 0)
            )

            matched_skills = match_result.get(
                "matched",
                []
            )

            missing_skills = match_result.get(
                "missing",
                []
            )

            recommendation = match_result.get(
                "recommendation",
                "Review this job against your skills."
            )

            # ------------------------------------------
            # ATS calculation - only once
            # ------------------------------------------
            ats_result = calculate_ats_score(
                str(resume_text),
                job
            ) or {}

            ats_score = safe_score(
                ats_result.get("score", 0)
            )

            ats_missing = ats_result.get(
                "missing",
                []
            )

            # ------------------------------------------
            # Final score
            # ------------------------------------------
            # Skill match: 70%
            # ATS compatibility: 30%
            base_score = (
                skill_score * 0.70
                + ats_score * 0.30
            )

            search_bonus = get_text_match_bonus(
                job,
                keyword,
                location
            )

            final_score = min(
                100.0,
                base_score + search_bonus
            )

            # ------------------------------------------
            # Add recommendation details
            # ------------------------------------------
            job["score"] = skill_score
            job["matched_skills"] = matched_skills
            job["missing_skills"] = missing_skills
            job["recommendation"] = recommendation

            job["ats_score"] = ats_score
            job["ats_missing"] = ats_missing

            job["final_score"] = round(
                final_score,
                2
            )

            recommendations.append(job)

        except Exception as error:
            print(
                "Job recommendation processing error:",
                error
            )

            # Skip only the problematic job
            continue

    # --------------------------------------------------
    # 5. Sort by final score
    # --------------------------------------------------
    recommendations.sort(
        key=lambda item: item.get(
            "final_score",
            0
        ),
        reverse=True
    )

    # --------------------------------------------------
    # 6. Final deduplication
    # --------------------------------------------------
    recommendations = deduplicate_jobs(
        recommendations
    )

    return (
        recommendations[:MAX_RECOMMENDATIONS],
        resume_skills
    )