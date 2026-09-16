from typing import Any

from services.aggregator import search_jobs


async def search_live_jobs(
    keyword: str = "",
    location: str = "",
    experience: str = ""
) -> list[dict[str, Any]]:
    """
    Fetch live jobs from the job aggregator.

    Args:
        keyword: Job title, skill, or keyword.
        location: Required job location.
        experience: Experience level such as Fresher, Junior,
                    Mid-Level, or Senior.

    Returns:
        A list of job dictionaries.
    """

    keyword = (keyword or "").strip()
    location = (location or "").strip()
    experience = (experience or "").strip()

    try:
        jobs = await search_jobs(
            keyword=keyword,
            location=location,
            experience=experience
        )

        if not isinstance(jobs, list):
            return []

        return [
            job
            for job in jobs
            if isinstance(job, dict)
        ]

    except Exception as error:
        print(f"Live jobs search error: {error}")
        return []