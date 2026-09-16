from typing import Any, Dict, List

from services.jobs.normalizer import normalize_job


def normalize_jobs(
    jobs: Any,
) -> List[Dict[str, Any]]:
    """Normalize a list of jobs safely."""

    if not isinstance(jobs, list):
        return []

    normalized_jobs = []

    for job in jobs:
        if not isinstance(job, dict):
            continue

        normalized_job_data = normalize_job(job)

        if not normalized_job_data.get("title"):
            continue

        normalized_jobs.append(normalized_job_data)

    return normalized_jobs