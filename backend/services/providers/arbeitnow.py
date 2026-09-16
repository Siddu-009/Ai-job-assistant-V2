import re
import httpx

from services.normalizer import normalize_jobs


BASE_URL = "https://www.arbeitnow.com/api/job-board-api"


SENIOR_KEYWORDS = [
    "senior",
    "sr.",
    "lead",
    "principal",
    "staff",
    "architect",
    "manager",
    "director",
]


def normalize_text(value):
    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(
            str(item) for item in value
        ).lower()

    return str(value).lower().strip()


def detect_experience(title, description):
    """
    Detect experience level from job title and description.
    """
    text = " ".join([
        normalize_text(title),
        normalize_text(description),
    ])

    if any(
        keyword in text
        for keyword in SENIOR_KEYWORDS
    ):
        return "Senior"

    if any(
        keyword in text
        for keyword in [
            "junior",
            "entry level",
            "entry-level",
            "fresher",
            "graduate",
            "trainee",
            "intern",
        ]
    ):
        return "Fresher"

    year_match = re.search(
        r"\b([3-9]|[1-9][0-9])\+?\s*(?:years?|yrs?)\b",
        text
    )

    if year_match:
        years = int(year_match.group(1))

        if years >= 5:
            return "Senior"

        if years >= 2:
            return "Mid-Level"

    return "Not Mentioned"


def location_matches(job_location, requested_location):
    """
    Flexible location matching.

    Supports:
    Hyderabad
    Hyderabad, India
    Remote
    Worldwide
    """
    requested = normalize_text(
        requested_location
    )

    current = normalize_text(
        job_location
    )

    if not requested:
        return True

    remote_terms = [
        "remote",
        "worldwide",
        "anywhere",
        "global",
    ]

    if requested in remote_terms:
        return any(
            term in current
            for term in remote_terms
        )

    requested_words = re.sub(
        r"[^a-z0-9\s]",
        " ",
        requested
    ).split()

    current_words = re.sub(
        r"[^a-z0-9\s]",
        " ",
        current
    ).split()

    if requested in current:
        return True

    return all(
        word in current_words
        for word in requested_words
    )


def keyword_matches(title, description, skills, keyword):
    """
    Match keyword against title, description, and skills.
    """
    keyword = normalize_text(keyword)

    if not keyword:
        return True

    searchable = " ".join([
        normalize_text(title),
        normalize_text(description),
        normalize_text(skills),
    ])

    keyword_words = keyword.split()

    return (
        keyword in searchable
        or all(
            word in searchable
            for word in keyword_words
        )
    )


def experience_matches(
    title,
    description,
    detected_experience,
    requested_experience
):
    """
    Prevent senior-level jobs from appearing in fresher searches.
    """
    requested = normalize_text(
        requested_experience
    )

    if not requested:
        return True

    title_text = normalize_text(title)
    description_text = normalize_text(description)

    senior_job = (
        detected_experience == "Senior"
        or any(
            keyword in title_text
            for keyword in SENIOR_KEYWORDS
        )
    )

    if "fresh" in requested or "entry" in requested:
        if senior_job:
            return False

        senior_experience = re.search(
            r"\b(?:3|4|5|6|7|8|9|10)\+?\s*"
            r"(?:years?|yrs?)\b",
            description_text
        )

        if senior_experience:
            return False

        return True

    if "senior" in requested:
        return senior_job

    if "junior" in requested:
        return not senior_job

    return True


async def search_jobs(
    keyword="",
    location="",
    experience=""
):
    keyword = normalize_text(keyword)
    location = normalize_text(location)
    experience = normalize_text(experience)

    jobs = []

    try:
        async with httpx.AsyncClient(
            timeout=30,
            follow_redirects=True
        ) as client:
            response = await client.get(BASE_URL)
            response.raise_for_status()

        data = response.json()

        for job in data.get("data", []):
            title = job.get("title", "")
            company = job.get("company_name", "")
            job_location = job.get("location", "")

            description = job.get(
                "description",
                ""
            )

            tags = job.get("tags", [])

            if not isinstance(tags, list):
                tags = [str(tags)]

            skills = ", ".join(
                str(tag)
                for tag in tags
            )

            detected_experience = detect_experience(
                title,
                description
            )

            # Keyword filter
            if not keyword_matches(
                title,
                description,
                skills,
                keyword
            ):
                continue

            # Location filter
            if not location_matches(
                job_location,
                location
            ):
                continue

            # Experience filter
            if not experience_matches(
                title,
                description,
                detected_experience,
                experience
            ):
                continue

            jobs.append({
                "id": f"arbeit-{job.get('slug')}",

                "title": title,

                "company": company,

                "location": job_location,

                "salary": "Not Mentioned",

                "employment_type": job.get(
                    "employment_type",
                    "Not Mentioned"
                ),

                "description": description,

                "skills": skills,

                "experience": detected_experience,

                "apply_url": job.get("url"),

                "posted_date": job.get("created_at"),

                "source": "Arbeitnow",
            })

    except httpx.HTTPError as error:
        print(
            "Arbeitnow HTTP Error:",
            error
        )

    except Exception as error:
        print(
            "Arbeitnow Error:",
            error
        )

    return normalize_jobs(jobs)