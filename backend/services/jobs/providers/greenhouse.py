import asyncio
import aiohttp

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


GREENHOUSE_BOARDS = [

    # AI
    "openai",
    "anthropic",
    "cohere",
    "huggingface",

    # Cloud
    "cloudflare",
    "datadog",
    "digitalocean",
    "hashicorp",

    # DevOps
    "docker",
    "gitlab",
    "grafana",
    "elastic",
    "mongodb",
    "redis",

    # SaaS
    "stripe",
    "canva",
    "notion",
    "discord",
    "figma",
    "atlassian",
    "asana",
    "airtable",

    # Security
    "snyk",
    "wiz",
    "crowdstrike",
    "sentinelone",

    # Data
    "snowflake",
    "confluent",

    # Fintech
    "brex",
    "plaid",
    "coinbase",

    # Startups
    "rippling",
    "scaleai",
    "checkr",
    "mux",
    "webflow",

]

BASE_URL = "https://boards-api.greenhouse.io/v1/boards/{}/jobs"


class GreenhouseProvider(JobProvider):

    name = "Greenhouse"

    async def fetch_board(
        self,
        session,
        board,
        keyword=""
    ):

        jobs = []

        try:

            url = BASE_URL.format(board)

            async with session.get(url) as response:

                if response.status != 200:
                    return jobs

                data = await response.json()

            for item in data.get("jobs", []):

                title = item.get("title", "")

                if not title:
                    continue

                if keyword:

                    searchable = " ".join([

                        title,

                        item.get("content", ""),

                        board

                    ]).lower()

                    if keyword.lower() not in searchable:
                        continue

                metadata = item.get("metadata", [])

                employment_type = ""

                for meta in metadata:

                    name = meta.get("name", "").lower()

                    value = meta.get("value", "")

                    if "employment" in name or "job type" in name:

                        employment_type = value
                        break

                raw_job = {

                    "id": str(item.get("id", "")),

                    "title": title,

                    "company": board.title(),

                    "location": (
                        item.get("location", {})
                        .get("name", "Unknown")
                    ),

                    "description": clean_html(
                        item.get("content", "")
                    ),

                    "apply_url": (
                        item.get("absolute_url")
                        or ""
                    ),

                    "source": "Greenhouse",

                    "salary": (
                        item.get("salary")
                        or "Not Mentioned"
                    ),

                    "experience": "",

                    "employment_type": (
                        employment_type
                        or "Full Time"
                    ),

                    "remote": (
                        "remote"
                        in item.get(
                            "location",
                            {}
                        ).get(
                            "name",
                            ""
                        ).lower()
                    ),

                    "country": "",

                    "posted_date": (
                        item.get("updated_at")
                        or ""
                    ),

                    "company_logo": "",

                    "company_url": "",

                    "skills": []

                }

                jobs.append(
                    normalize_job(raw_job)
                )

        except Exception as e:

            print(f"Greenhouse ({board}) Error: {e}")

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

                self.fetch_board(
                    session,
                    board,
                    keyword
                )

                for board in GREENHOUSE_BOARDS

            ]

            results = await asyncio.gather(*tasks)

            for result in results:

                jobs.extend(result)

        return jobs