import aiohttp

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html
from services.jobs.providers.company_sources import SMARTRECRUITERS_COMPANIES


class SmartRecruitersProvider(JobProvider):

    name = "SmartRecruiters"

    async def search(
        self,
        keyword="",
        location="",
        experience=""
    ):

        jobs = []
        
        async with aiohttp.ClientSession() as session:
                # We'll fetch jobs here

            for company in SMARTRECRUITERS_COMPANIES:

                url = f"https://api.smartrecruiters.com/v1/companies/{company}/postings"

                try:

                    async with session.get(url) as response:

                        if response.status != 200:
                            continue

                        data = await response.json()

                        for posting in data.get("content", []):

                            jobs.append(
                                normalize_job(
                                    {
                                        "title": posting.get("name"),
                                        "company": company,
                                        "location": posting.get(
                                            "location",
                                            {}
                                        ).get(
                                            "city",
                                            ""
                                        ),
                                        "description": clean_html(
                                            posting.get(
                                                "jobAd",
                                                ""
                                            )
                                        ),
                                        "url": posting.get("ref"),
                                        "employment_type": posting.get(
                                            "typeOfEmployment",
                                            ""
                                        ),
                                        "source": self.name,
                                    }
                                )
                            )

                except Exception:
                    continue

            return jobs