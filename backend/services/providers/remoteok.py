import httpx
import re

from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


BASE_URL = "https://remoteok.com/api"


class RemoteOKProvider:

    name = "RemoteOK"

    # -----------------------------
    # Text Normalization
    # -----------------------------

    @staticmethod
    def normalize_text(value):

        if value is None:
            return ""

        if isinstance(value, list):
            value = " ".join(
                str(item)
                for item in value
            )

        return re.sub(
            r"\s+",
            " ",
            str(value).lower().strip()
        )

    # -----------------------------
    # Keyword Matching
    # -----------------------------

    @classmethod
    def keyword_matches(cls, job, keyword):

        keyword = cls.normalize_text(keyword)

        if not keyword:
            return True

        searchable_text = cls.normalize_text(" ".join([
            job.get("title", ""),
            job.get("company", ""),
            job.get("description", ""),
            job.get("location", ""),
            job.get("skills", "")
        ]))

        keywords = keyword.split()

        return all(
            word in searchable_text
            for word in keywords
            if len(word) > 1
        )

    # -----------------------------
    # Location Matching
    # -----------------------------

    @classmethod
    def location_matches(cls, job, location):

        location = cls.normalize_text(location)

        if not location:
            return True

        job_location = cls.normalize_text(
            job.get("location", "")
        )

        description = cls.normalize_text(
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

    # -----------------------------
    # Experience Matching
    # -----------------------------

    @classmethod
    def experience_matches(cls, job, experience):

        experience = cls.normalize_text(experience)

        if not experience:
            return True

        title = cls.normalize_text(
            job.get("title", "")
        )

        description = cls.normalize_text(
            job.get("description", "")
        )

        searchable_text = " ".join([
            title,
            description
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

            # Reject senior-level titles
            if any(
                term in title
                for term in senior_terms
            ):
                return False

            # Explicit fresher/entry-level jobs
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

            # Keep jobs with no clear experience requirement
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

    # -----------------------------
    # Search Jobs
    # -----------------------------

    async def search_jobs(
        self,
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

            if not isinstance(data, list):
                return []

            # First item contains API metadata
            for item in data[1:]:

                if not isinstance(item, dict):
                    continue

                title = (
                    item.get("position")
                    or item.get("title")
                    or ""
                ).strip()

                if not title:
                    continue

                company = (
                    item.get("company")
                    or item.get("companyName")
                    or "Unknown"
                )

                job_location = (
                    item.get("location")
                    or "Remote"
                )

                description = clean_html(
                    item.get("description")
                    or ""
                )

                tags = item.get("tags") or []

                if not isinstance(tags, list):
                    tags = [str(tags)]

                skills = [
                    str(tag).strip()
                    for tag in tags
                    if str(tag).strip()
                ]

                raw_job = {

                    "id": (
                        f"remoteok-{item.get('id')}"
                    ),

                    "title": title,

                    "company": company,

                    "location": job_location,

                    "salary": (
                        item.get("salary_min")
                        or "Not Mentioned"
                    ),

                    "employment_type": "Remote",

                    "description": description,

                    "skills": skills,

                    "apply_url": (
                        item.get("url")
                        or item.get("apply")
                        or ""
                    ),

                    "posted_date": (
                        item.get("date")
                        or ""
                    ),

                    "source": "RemoteOK",

                    "experience": "",

                    "remote": True

                }

                # -----------------------------
                # Apply Filters
                # -----------------------------

                if not self.keyword_matches(
                    raw_job,
                    keyword
                ):
                    continue

                if not self.location_matches(
                    raw_job,
                    location
                ):
                    continue

                if not self.experience_matches(
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
                "RemoteOK HTTP Error:",
                e
            )

        except Exception as e:

            print(
                "RemoteOK Error:",
                e
            )

        return jobs
# ---------------------------------
# Compatibility wrapper
# ---------------------------------

async def search_jobs(
    keyword: str = "",
    location: str = "",
    experience: str = ""
):
    provider = RemoteOKProvider()

    return await provider.search_jobs(
        keyword=keyword,
        location=location,
        experience=experience
    )