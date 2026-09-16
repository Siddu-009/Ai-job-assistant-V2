import httpx
import re

from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


BASE_URL = "https://himalayas.app/jobs/api"


# -----------------------------------
# Text Normalization
# -----------------------------------

def normalize_text(value):

    if value is None:
        return ""

    if isinstance(value, list):
        value = " ".join(
            str(item)
            for item in value
        )

    if isinstance(value, dict):
        value = " ".join(
            str(item)
            for item in value.values()
        )

    return re.sub(
        r"\s+",
        " ",
        str(value).lower().strip()
    )


# -----------------------------------
# Keyword Filtering
# -----------------------------------

def keyword_matches(job, keyword):

    keyword = normalize_text(keyword)

    if not keyword:
        return True

    searchable_text = normalize_text(" ".join([
        job.get("title", ""),
        job.get("company", ""),
        job.get("description", ""),
        job.get("location", ""),
        job.get("skills", ""),
        job.get("requirements", "")
    ]))

    return all(
        word in searchable_text
        for word in keyword.split()
        if len(word) > 1
    )


# -----------------------------------
# Location Filtering
# -----------------------------------

def location_matches(job, location):

    location = normalize_text(location)

    if not location:
        return True

    job_location = normalize_text(
        job.get("location", "")
    )

    description = normalize_text(
        job.get("description", "")
    )

    searchable_location = (
        f"{job_location} {description}"
    )

    if location in {
        "remote",
        "work from home",
        "wfh",
        "anywhere",
        "worldwide",
        "global"
    }:
        return (
            "remote" in searchable_location
            or "worldwide" in searchable_location
            or "anywhere" in searchable_location
            or "global" in searchable_location
        )

    location_aliases = {
        "india": ["india", "indian"],
        "hyderabad": ["hyderabad"],
        "bangalore": ["bangalore", "bengaluru"],
        "bengaluru": ["bangalore", "bengaluru"],
        "mumbai": ["mumbai", "bombay"],
        "delhi": ["delhi", "new delhi"],
        "pune": ["pune"],
        "chennai": ["chennai", "madras"],
        "usa": ["usa", "united states", "us"],
        "uk": ["uk", "united kingdom"],
        "canada": ["canada"]
    }

    terms = location_aliases.get(
        location,
        [location]
    )

    return any(
        term in searchable_location
        for term in terms
    )


# -----------------------------------
# Experience Filtering
# -----------------------------------

def experience_matches(job, experience):

    experience = normalize_text(experience)

    if not experience:
        return True

    title = normalize_text(
        job.get("title", "")
    )

    description = normalize_text(
        job.get("description", "")
    )

    requirements = normalize_text(
        job.get("requirements", "")
    )

    searchable_text = " ".join([
        title,
        description,
        requirements
    ])

    senior_terms = [
        "senior",
        "sr.",
        "sr ",
        "lead",
        "principal",
        "staff engineer",
        "architect",
        "manager",
        "director",
        "head of"
    ]

    fresher_terms = [
        "fresher",
        "freshers",
        "entry level",
        "entry-level",
        "junior",
        "graduate",
        "trainee",
        "intern",
        "internship",
        "no experience",
        "0-1 year",
        "0 to 1 year",
        "less than 1 year"
    ]

    if experience in {
        "fresher",
        "freshers",
        "entry level",
        "entry-level",
        "junior"
    }:

        # Reject clearly senior job titles
        if any(
            term in title
            for term in senior_terms
        ):
            return False

        # Accept explicit entry-level jobs
        if any(
            term in searchable_text
            for term in fresher_terms
        ):
            return True

        # Detect experience requirements
        years_match = re.search(
            r"(\d+)\s*(?:\+|or more)?\s*years?",
            searchable_text
        )

        if years_match:

            required_years = int(
                years_match.group(1)
            )

            return required_years <= 1

        # Keep jobs without clear experience information
        return True

    if experience in {
        "mid",
        "mid level",
        "mid-level",
        "intermediate"
    }:

        if any(
            term in title
            for term in senior_terms
        ):
            return False

        years_match = re.search(
            r"(\d+)\s*(?:\+|or more)?\s*years?",
            searchable_text
        )

        if years_match:

            required_years = int(
                years_match.group(1)
            )

            return 2 <= required_years <= 5

        return True

    if experience in {
        "senior",
        "experienced",
        "lead"
    }:

        return any(
            term in searchable_text
            for term in [
                "senior",
                "sr.",
                "lead",
                "principal",
                "staff",
                "manager",
                "5+ years",
                "6+ years",
                "7+ years",
                "8+ years"
            ]
        )

    return experience in searchable_text


# -----------------------------------
# Search Himalayas Jobs
# -----------------------------------

async def search_jobs(
    keyword="",
    location="",
    experience=""
):

    keyword = (keyword or "").strip()
    location = (location or "").strip()
    experience = (experience or "").strip()

    jobs = []

    try:

        headers = {
            "User-Agent": (
                "Mozilla/5.0 "
                "(compatible; AI-Job-Assistant/1.0)"
            )
        }

        async with httpx.AsyncClient(
            timeout=30,
            headers=headers,
            follow_redirects=True
        ) as client:

            response = await client.get(
                BASE_URL
            )

            response.raise_for_status()

            data = response.json()

        if not isinstance(data, dict):
            return []

        for job in data.get("jobs", []):

            if not isinstance(job, dict):
                continue

            title = (
                job.get("title")
                or ""
            ).strip()

            if not title:
                continue

            company = (
                job.get("companyName")
                or job.get("company")
                or "Unknown"
            )

            job_location = (
                job.get("location")
                or "Remote"
            )

            description = clean_html(
                job.get("description")
                or ""
            )

            requirements = (
                job.get("requirements")
                or ""
            )

            skills_data = (
                job.get("skills")
                or []
            )

            if isinstance(skills_data, list):

                skills = [
                    str(skill).strip()
                    for skill in skills_data
                    if str(skill).strip()
                ]

            else:

                skills = [
                    str(skills_data).strip()
                ]

            raw_job = {

                "id": (
                    f"himalayas-{job.get('id')}"
                ),

                "title": title,

                "company": company,

                "location": job_location,

                "salary": (
                    job.get("salary")
                    or "Not Mentioned"
                ),

                "employment_type": (
                    job.get("employmentType")
                    or "Not Mentioned"
                ),

                "description": description,

                "requirements": requirements,

                "skills": skills,

                "apply_url": (
                    job.get("applyUrl")
                    or job.get("url")
                    or ""
                ),

                "posted_date": (
                    job.get("publishedAt")
                    or ""
                ),

                "source": "Himalayas",

                "experience": "",

                "remote": True

            }

            # -----------------------------------
            # Apply Filters
            # -----------------------------------

            if not keyword_matches(
                raw_job,
                keyword
            ):
                continue

            if not location_matches(
                raw_job,
                location
            ):
                continue

            if not experience_matches(
                raw_job,
                experience
            ):
                continue

            normalized_job = normalize_job(
                raw_job
            )

            if normalized_job:
                jobs.append(normalized_job)

    except httpx.HTTPError as e:

        print(
            "Himalayas HTTP Error:",
            e
        )

    except Exception as e:

        print(
            "Himalayas Error:",
            e
        )

    return jobs