import aiohttp
from typing import List

from services.jobs.models import Job
from services.jobs.normalizer import normalize_job
from services.jobs.providers.base import JobProvider
from services.jobs.html_cleaner import clean_html


class ArbeitnowProvider(JobProvider):

    name = "Arbeitnow"

    URL = "https://www.arbeitnow.com/api/job-board-api"

    async def search(
        self,
        keyword="",
        location="",
        experience=""
    ) -> List[Job]:

        jobs = []

        try:

            async with aiohttp.ClientSession() as session:

                async with session.get(self.URL) as response:

                    data = await response.json()

            for item in data.get("data", []):

                raw_job = {

                    "id": str(item.get("slug", "")),

                    "title": item.get("title", ""),

                    "company": item.get("company_name", ""),

                    "location": (
                        item.get("location")
                        or "Remote"
                        if item.get("remote")
                        else "Unknown"
                    ),

                    "description": clean_html(
                        item.get("description", "")
                    ),

                    "apply_url": (
                        item.get("url")
                        or item.get("job_url")
                        or ""
                    ),

                    "source": "Arbeitnow",

                    "remote": bool(item.get("remote", False)),

                    "salary": item.get(
                        "salary",
                        "Not Mentioned"
                    ),

                    "experience": item.get(
                        "experience",
                        ""
                    ),

                    "employment_type": item.get(
                        "employment_type",
                        "Full Time"
                    ),

                    "country": item.get(
                        "country",
                        ""
                    ),

                    "posted_date": item.get(
                        "created_at",
                        ""
                    ),

                    "company_logo": item.get(
                        "company_logo",
                        ""
                    ),

                    "company_url": item.get(
                        "company_url",
                        ""
                    ),

                    "skills": [
                        str(skill).strip()
                        for skill in item.get("tags", [])
                        if str(skill).strip()
                    ]

                }

                jobs.append(
                    normalize_job(raw_job)
                )

        except Exception as e:

            print(f"Arbeitnow Error: {e}")

        return jobs