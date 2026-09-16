import asyncio
import aiohttp

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


LEVER_COMPANIES = [

    # DevOps / Cloud
    "docker",
    "digitalocean",
    "circleci",
    "hashicorp",
    "elastic",
    "redis",
    "grafana",

    # AI
    "openai",
    "anthropic",
    "cohere",

    # Developer Tools
    "postman",
    "gitlab",
    "sourcegraph",
    "vercel",
    "clerk",
    "render",
    "planetscale",

    # SaaS
    "miro",
    "zapier",
    "mixpanel",
    "rippling",
    "segment",

    # Security
    "snyk",
    "1password",

    # Data
    "confluent",

]

BASE_URL = "https://api.lever.co/v0/postings/{company}?mode=json"


class LeverProvider(JobProvider):

    name = "Lever"

    async def fetch_company(
        self,
        session,
        company,
        keyword=""
    ):

        jobs = []

        try:

            async with session.get(
                BASE_URL.format(company=company)
            ) as response:

                if response.status != 200:
                    return jobs

                data = await response.json()

            for item in data:

                title = item.get("text", "")

                if not title:
                    continue

                if keyword:

                    searchable = " ".join([

                        title,

                        item.get("descriptionPlain", ""),

                        company,

                        item.get("categories", {}).get("team", "")

                    ]).lower()

                    if keyword.lower() not in searchable:
                        continue

                categories = item.get("categories", {})

                raw_job = {

                    "id": str(item.get("id", "")),

                    "title": title,

                    "company": company.title(),

                    "location": (
                        categories.get("location")
                        or "Unknown"
                    ),

                    "description": clean_html(
                        item.get("descriptionPlain", "")
                    ),

                    "apply_url": (
                        item.get("hostedUrl")
                        or ""
                    ),

                    "source": "Lever",

                    "salary": (
                        item.get("salary")
                        or "Not Mentioned"
                    ),

                    "experience": "",

                    "employment_type": (
                        categories.get("commitment")
                        or "Full Time"
                    ),

                    "remote": (
                        "remote"
                        in categories.get(
                            "location",
                            ""
                        ).lower()
                    ),

                    "country": "",

                    "posted_date": (
                        item.get("createdAt")
                        or ""
                    ),

                    "company_logo": "",

                    "company_url": (
                        item.get("applyUrl")
                        or ""
                    ),

                    "skills": []

                }

                jobs.append(
                    normalize_job(raw_job)
                )

        except Exception as e:

            print(f"Lever ({company}) Error: {e}")

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

                for company in LEVER_COMPANIES

            ]

            results = await asyncio.gather(*tasks)

            for result in results:

                jobs.extend(result)

        return jobs