import asyncio
import aiohttp
import re

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


class RemotiveProvider(JobProvider):

    name = "Remotive"

    URL = "https://remotive.com/api/remote-jobs"

    # -----------------------------
    # Text Normalization
    # -----------------------------

    @staticmethod
    def normalize_text(value):
        if value is None:
            return ""

        if isinstance(value, list):
            value = " ".join(str(item) for item in value)

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
            job.get("skills", ""),
            job.get("experience", "")
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

        country = cls.normalize_text(
            job.get("country", "")
        )

        searchable_location = (
            f"{job_location} {country}"
        )

        # Remote jobs can be considered for remote searches
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

        listed_experience = cls.normalize_text(
            job.get("experience", "")
        )

        searchable_text = " ".join([
            title,
            listed_experience,
            description
        ])

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
            "head of",
            "5+ years",
            "6+ years",
            "7+ years",
            "8+ years",
            "10+ years"
        ]

        if experience in {
            "fresher",
            "freshers",
            "entry level",
            "entry-level",
            "junior"
        }:
            # Reject clearly senior job titles
            if any(term in title for term in senior_terms):
                return False

            # Accept explicitly fresher/entry-level jobs
            if any(term in searchable_text for term in fresher_terms):
                return True

            # Reject clearly experienced job requirements
            years_match = re.search(
                r"(\d+)\s*(?:\+|or more)?\s*years?",
                searchable_text
            )

            if years_match:
                required_years = int(
                    years_match.group(1)
                )

                return required_years <= 1

            # Do not reject jobs without experience information
            return True

        if experience in {
            "mid",
            "mid level",
            "mid-level",
            "intermediate"
        }:
            if any(term in title for term in senior_terms):
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

        # Generic fallback
        return experience in searchable_text

    # -----------------------------
    # Search Jobs
    # -----------------------------

    async def search(
        self,
        keyword="",
        location="",
        experience=""
    ):

        jobs = []

        try:

            params = {}

            if keyword:
                params["search"] = keyword.strip()

            async with aiohttp.ClientSession() as session:

                async with session.get(
                    self.URL,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:

                    if response.status != 200:
                        print(
                            "Remotive API Error:",
                            response.status
                        )

                        return []

                    data = await response.json()

            for item in data.get("jobs", []):

                title = (
                    item.get("title") or ""
                ).strip()

                if not title:
                    continue

                candidate_location = (
                    item.get(
                        "candidate_required_location"
                    )
                    or "Remote"
                )

                raw_job = {

                    "id": str(
                        item.get("id", "")
                    ),

                    "title": title,

                    "company": item.get(
                        "company_name",
                        "Unknown"
                    ),

                    "location": candidate_location,

                    "description": clean_html(
                        item.get("description", "")
                    ),

                    "apply_url": (
                        item.get("url") or ""
                    ),

                    "source": "Remotive",

                    "salary": (
                        item.get("salary")
                        or "Not Mentioned"
                    ),

                    "experience": (
                        item.get("experience")
                        or ""
                    ),

                    "employment_type": (
                        item.get("job_type")
                        or "Full Time"
                    ),

                    "remote": True,

                    "country": candidate_location,

                    "posted_date": (
                        item.get("publication_date")
                        or ""
                    ),

                    "company_logo": (
                        item.get("company_logo_url")
                        or ""
                    ),

                    "company_url": (
                        item.get("company_website")
                        or ""
                    ),

                    "skills": [
                        str(skill).strip()
                        for skill in item.get(
                            "tags",
                            []
                        )
                        if str(skill).strip()
                    ]

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

        except asyncio.TimeoutError:
            print("Remotive Error: Request timed out")

        except aiohttp.ClientError as e:
            print(
                "Remotive Network Error:",
                e
            )

        except Exception as e:
            print(
                "Remotive Error:",
                e
            )

        return jobs