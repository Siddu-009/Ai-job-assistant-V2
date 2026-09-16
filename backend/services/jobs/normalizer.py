from typing import Any, Dict, List


def _clean_text(value: Any) -> str:
    """Convert any value into clean text."""

    if value is None:
        return ""

    if isinstance(value, list):
        return ", ".join(
            str(item).strip()
            for item in value
            if item is not None
        )

    if isinstance(value, dict):
        return ", ".join(
            f"{key}: {val}"
            for key, val in value.items()
            if val is not None
        )

    return str(value).strip()


def normalize_job(job: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize one job into a consistent format."""

    if not isinstance(job, dict):
        return {}

    normalized = dict(job)

    normalized["id"] = _clean_text(
        job.get("id") or job.get("job_id")
    )

    normalized["title"] = _clean_text(
        job.get("title")
    )

    normalized["company"] = _clean_text(
        job.get("company") or job.get("company_name")
    )

    normalized["location"] = _clean_text(
        job.get("location")
    )

    normalized["description"] = _clean_text(
        job.get("description")
    )

    normalized["skills"] = _clean_text(
        job.get("skills") or job.get("tags")
    )

    normalized["experience"] = _clean_text(
        job.get("experience") or "Not Mentioned"
    )

    normalized["salary"] = _clean_text(
        job.get("salary") or "Not Mentioned"
    )

    normalized["employment_type"] = _clean_text(
        job.get("employment_type") or "Not Mentioned"
    )

    normalized["apply_url"] = _clean_text(
        job.get("apply_url") or job.get("url")
    )

    normalized["posted_date"] = _clean_text(
        job.get("posted_date") or job.get("created_at")
    )

    normalized["source"] = _clean_text(
        job.get("source") or "Unknown"
    )

    return normalized


def normalize_jobs(
    jobs: Any
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