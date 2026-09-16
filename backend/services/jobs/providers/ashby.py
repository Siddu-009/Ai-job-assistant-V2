import asyncio
import aiohttp

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html
from services.jobs.providers.company_sources import ASHBY_COMPANIES


BASE_URL = "https://jobs.ashbyhq.com/api/non-user-graphql"


class AshbyProvider(JobProvider):

    name = "Ashby"

    async def fetch_company(
        self,
        session,
        company,
        keyword=""
    ):

        jobs = []

        payload = {
            "operationName": "JobBoard",
            "variables": {
                "organizationHostedJobsPageName": company
            },
            "query": """
            query JobBoard($organizationHostedJobsPageName: String!) {
              jobBoardWithTeams(
                organizationHostedJobsPageName: $organizationHostedJobsPageName
              ) {
                jobs {
                  id
                  title
                  location
                  employmentType
                  descriptionHtml
                  applyUrl
                }
              }
            }
            """
        }

        try:

            async with session.post(
                BASE_URL,
                json=payload
            ) as response:

                if response.status != 200:
                    return jobs

                data = await response.json()

            board = (
                data.get("data", {})
                    .get("jobBoardWithTeams", {})
            )

            for item in board.get("jobs", []):

                title = item.get("title", "")

                if keyword:

                    searchable = (
                        title + " " +
                        clean_html(
                            item.get(
                                "descriptionHtml",
                                ""
                            )
                        )
                    ).lower()

                    if keyword.lower() not in searchable:
                        continue

                raw_job = {

                    "id": item.get("id"),

                    "title": title,

                    "company": company.title(),

                    "location": item.get(
                        "location",
                        "Unknown"
                    ),

                    "description": clean_html(
                        item.get(
                            "descriptionHtml",
                            ""
                        )
                    ),

                    "apply_url": item.get(
                        "applyUrl",
                        ""
                    ),

                    "employment_type": item.get(
                        "employmentType",
                        "Full Time"
                    ),

                    "salary": "Not Mentioned",

                    "experience": "",

                    "remote": "remote" in item.get(
                        "location",
                        ""
                    ).lower(),

                    "source": "Ashby",

                    "country": "",

                    "posted_date": "",

                    "company_logo": "",

                    "company_url": "",

                    "skills": []

                }

                jobs.append(
                    normalize_job(raw_job)
                )

        except Exception as e:

            print(f"Ashby ({company}) Error: {e}")

        return jobs

    async def search(
        self,
        keyword="",
        location="",
        experience=""
    ):

        jobs = []

        async with aiohttp.ClientSession() as session:

            tasks = [

                self.fetch_company(
                    session,
                    company,
                    keyword
                )

                for company in ASHBY_COMPANIES

            ]

            results = await asyncio.gather(*tasks)

            for result in results:

                jobs.extend(result)

        return jobs