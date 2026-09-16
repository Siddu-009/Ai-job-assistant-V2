
import asyncio
import re
from typing import Any

from services.providers.arbeitnow import (
    search_jobs as arbeitnow_jobs
)
from services.providers.remotive import (
    search_jobs as remotive_jobs
)
from services.providers.remoteok import (
    search_jobs as remoteok_jobs
)
from services.providers.himalayas import (
    search_jobs as himalayas_jobs
)


MAX_JOBS = 100


SENIOR_TITLE_TERMS = (
    "senior",
    "sr.",
    "sr ",
    "lead",
    "principal",
    "staff",
    "architect",
    "director",
    "head of",
)


FRESHER_TERMS = (
    "fresher",
    "entry level",
    "entry-level",
    "junior",
    "graduate",
    "trainee",
    "intern",
    "internship",
    "new graduate",
    "0-1 year",
    "0 to 1 year",
    "no experience",
)


SENIOR_EXPERIENCE_PATTERNS = (
    r"\b[3-9]\+?\s*years?\b",
    r"\b[3-9]\s*-\s*[0-9]+\s*years?\b",
    r"\b1[0-9]\+?\s*years?\b",
)


def normalize_text(value: Any) -> str:
    """Convert a value into normalized lowercase text."""

    if value is None:
        return ""

    if isinstance(value, list):
        value = " ".join(str(item) for item in value)

    elif isinstance(value, dict):
        value = " ".join(str(item) for item in value.values())

    return re.sub(
        r"\s+",
        " ",
        str(value).lower()
    ).strip()


def normalize_location(value: Any) -> str:
    """Normalize a location string."""

    value = normalize_text(value)

    return re.sub(
        r"[^a-z0-9\s]",
        " ",
        value
    ).strip()


def get_job_text(job: dict) -> str:
    """Build searchable job text."""

    fields = (
        "title",
        "company",
        "description",
        "skills",
        "experience",
        "requirements",
    )

    return " ".join(
        normalize_text(job.get(field))
        for field in fields
    )


def get_location_text(job: dict) -> str:
    """Build searchable location text."""

    fields = (
        "location",
        "city",
        "country",
        "work_location",
        "workplace",
    )

    return " ".join(
        normalize_location(job.get(field))
        for field in fields
    )


def location_matches(
    job: dict,
    requested_location: str
) -> bool:
    """
    Match the requested location.

    A blank location means all locations.
    Remote is only accepted for a remote search.
    """

    requested = normalize_location(
        requested_location
    )

    if not requested:
        return True

    job_location = get_location_text(job)

    if not job_location:
        return False

    remote_terms = (
        "remote",
        "worldwide",
        "anywhere",
        "work from anywhere",
        "global",
    )

    requested_is_remote = any(
        term in requested
        for term in remote_terms
    )

    if requested_is_remote:
        return any(
            term in job_location
            for term in remote_terms
        )

    if any(
        term in requested
        for term in remote_terms
    ):
        return False

    requested_words = requested.split()

    return (
        requested in job_location
        or all(
            word in job_location
            for word in requested_words
        )
    )


def keyword_matches(
    job: dict,
    keyword: str
) -> bool:
    """Match keyword against relevant job fields."""

    keyword = normalize_text(keyword)

    if not keyword:
        return True

    title = normalize_text(job.get("title"))
    company = normalize_text(job.get("company"))
    skills = normalize_text(job.get("skills"))
    description = normalize_text(job.get("description"))

    searchable = " ".join([
        title,
        company,
        skills,
        description,
    ])

    keyword_words = keyword.split()

    return (
        keyword in searchable
        or all(
            word in searchable
            for word in keyword_words
        )
    )


def get_experience_category(
    experience: str
) -> str:
    """Normalize experience selection."""

    value = normalize_text(experience)

    if not value:
        return ""

    if "fresh" in value:
        return "fresher"

    if "entry" in value:
        return "entry"

    if "junior" in value:
        return "junior"

    if "mid" in value:
        return "mid"

    if "senior" in value:
        return "senior"

    return value


def has_senior_title(
    job: dict
) -> bool:
    """Check senior-level terms in the job title only."""

    title = normalize_text(
        job.get("title")
    )

    return any(
        re.search(
            rf"\b{re.escape(term.strip())}\b",
            title
        )
        for term in SENIOR_TITLE_TERMS
    )


def has_senior_experience_requirement(
    job: dict
) -> bool:
    """
    Check explicit experience requirements.

    Only the experience and requirements fields are checked.
    This avoids rejecting a fresher job merely because its
    description mentions senior employees.
    """

    experience_text = " ".join([
        normalize_text(job.get("experience")),
        normalize_text(job.get("requirements")),
    ])

    return any(
        re.search(
            pattern,
            experience_text
        )
        for pattern in SENIOR_EXPERIENCE_PATTERNS
    )


def experience_matches(
    job: dict,
    requested_experience: str
) -> bool:
    """Apply experience-level filtering."""

    requested = get_experience_category(
        requested_experience
    )

    if not requested:
        return True

    title = normalize_text(
        job.get("title")
    )

    experience_text = " ".join([
        normalize_text(job.get("experience")),
        normalize_text(job.get("requirements")),
    ])

    # Fresher, entry, and junior searches
    if requested in (
        "fresher",
        "entry",
        "junior",
    ):
        if has_senior_title(job):
            return False

        if has_senior_experience_requirement(job):
            return False

        # If an explicit experience value exists,
        # require an entry-level indication.
        if experience_text:
            has_entry_term = any(
                term in experience_text
                for term in FRESHER_TERMS
            )

            has_numeric_requirement = bool(
                re.search(
                    r"\b[0-9]+\s*-\s*[0-9]+\s*years?\b",
                    experience_text
                )
            )

            if not has_entry_term and not has_numeric_requirement:
                return False

        return True

    # Senior search
    if requested == "senior":
        return (
            has_senior_title(job)
            or bool(
                re.search(
                    r"\b[5-9]\+?\s*years?\b",
                    experience_text
                )
            )
        )

    # Mid-level search
    if requested == "mid":
        return (
            "mid" in title
            or "intermediate" in experience_text
            or bool(
                re.search(
                    r"\b[2-5]\s*-\s*[0-9]+\s*years?\b",
                    experience_text
                )
            )
        )

    return True


def get_unique_key(
    job: dict
) -> str:
    """Create a stable deduplication key."""

    job_id = normalize_text(
        job.get("id") or job.get("job_id")
    )

    apply_url = normalize_text(
        job.get("apply_url") or job.get("url")
    )

    title = normalize_text(
        job.get("title")
    )

    company = normalize_text(
        job.get("company")
    )

    if job_id:
        return f"id:{job_id}"

    if apply_url:
        return f"url:{apply_url}"

    return f"title:{title}|company:{company}"


def remove_duplicate_jobs(
    jobs: list[dict]
) -> list[dict]:
    """Remove duplicate jobs without relying on another module."""

    seen = set()
    unique_jobs = []

    for job in jobs:
        if not isinstance(job, dict):
            continue

        key = get_unique_key(job)

        if key in seen:
            continue

        seen.add(key)
        unique_jobs.append(job)

    return unique_jobs


def calculate_search_score(
    job: dict,
    keyword: str,
    location: str,
    experience: str
) -> int:
    """Calculate search relevance score."""

    score = 0

    keyword = normalize_text(keyword)
    location = normalize_location(location)

    title = normalize_text(
        job.get("title")
    )

    skills = normalize_text(
        job.get("skills")
    )

    description = normalize_text(
        job.get("description")
    )

    job_location = get_location_text(job)

    # Keyword relevance
    if keyword:
        if keyword in title:
            score += 60

        elif keyword in skills:
            score += 40

        elif keyword in description:
            score += 20

    # Location relevance
    if location and location in job_location:
        score += 30

    # Experience relevance
    requested = get_experience_category(
        experience
    )

    experience_text = " ".join([
        normalize_text(job.get("title")),
        normalize_text(job.get("experience")),
        normalize_text(job.get("requirements")),
    ])

    if requested in (
        "fresher",
        "entry",
        "junior",
    ):
        if any(
            term in experience_text
            for term in FRESHER_TERMS
        ):
            score += 20

    elif requested == "senior":
        if has_senior_title(job):
            score += 20

    return score


async def search_jobs(
    keyword: str = "",
    location: str = "",
    experience: str = ""
) -> list[dict]:
    """
    Fetch jobs from all providers, filter duplicates,
    apply search filters, and return ranked jobs.
    """

    keyword = normalize_text(keyword)
    location = normalize_text(location)
    experience = normalize_text(experience)

    print(
        f"Keyword='{keyword}', "
        f"Location='{location}', "
        f"Experience='{experience}'"
    )

    provider_results = await asyncio.gather(
        arbeitnow_jobs(
            keyword,
            location,
            experience
        ),
        remotive_jobs(
            keyword,
            location,
            experience
        ),
        remoteok_jobs(
            keyword,
            location,
            experience
        ),
        himalayas_jobs(
            keyword,
            location,
            experience
        ),
        return_exceptions=True
    )

    provider_names = (
        "Arbeitnow",
        "Remotive",
        "RemoteOK",
        "Himalayas",
    )

    all_jobs = []

    for provider_name, result in zip(
        provider_names,
        provider_results
    ):
        if isinstance(result, Exception):
            print(
                f"{provider_name} error: {result}"
            )
            continue

        if not isinstance(result, list):
            print(
                f"{provider_name}: invalid response"
            )
            continue

        print(
            f"{provider_name}: {len(result)} jobs"
        )

        all_jobs.extend(result)

    print(
        f"Total jobs before filtering: "
        f"{len(all_jobs)}"
    )

    all_jobs = remove_duplicate_jobs(
        all_jobs
    )

    filtered_jobs = []

    for job in all_jobs:
        if not keyword_matches(
            job,
            keyword
        ):
            continue

        if not location_matches(
            job,
            location
        ):
            continue

        if not experience_matches(
            job,
            experience
        ):
            continue

        job["search_score"] = calculate_search_score(
            job,
            keyword,
            location,
            experience
        )

        filtered_jobs.append(job)

    filtered_jobs.sort(
        key=lambda job: (
            job.get("search_score", 0),
            str(
                job.get("posted_date") or ""
            )
        ),
        reverse=True
    )

    print(
        f"Jobs after filtering: "
        f"{len(filtered_jobs)}"
    )

    return filtered_jobs[:MAX_JOBS]