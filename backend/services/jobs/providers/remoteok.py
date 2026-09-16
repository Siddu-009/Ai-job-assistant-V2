import aiohttp

from services.jobs.providers.base import JobProvider
from services.jobs.normalizer import normalize_job
from services.jobs.html_cleaner import clean_html


class RemoteOKProvider(JobProvider):

    name = "RemoteOK"

    URL = "https://remoteok.com/api"

    async def search(
        self,
        keyword="",
        location="",
        experience=""
    ):

        jobs = []

        try:

            headers = {
                "User-Agent": "AI-Job-Assistant"
            }

            async with aiohttp.ClientSession(headers=headers) as session:

                async with session.get(self.URL) as response:

                    if response.status != 200:
                        print("RemoteOK:", response.status)
                        return []

                    data = await response.json()

            if isinstance(data, list):

                for item in data:

                    if not isinstance(item, dict):
                        continue

                    title = item.get("position") or item.get("title") or ""

                    if not title:
                        continue

                    if keyword:

                        searchable = " ".join([
                            title,
                            item.get("company", ""),
                            item.get("description", ""),
                            " ".join(item.get("tags", []))
                        ]).lower()

                        if keyword.lower() not in searchable:
                            continue

                    raw_job = {

                        "id": str(item.get("id", "")),

                        "title": title,

                        "company": item.get("company", "Unknown"),

                        "location": (
                            item.get("location")
                            or "Remote"
                        ),

                        "description": clean_html(
                            item.get("description", "")
                        ),

                        "apply_url": (
                            item.get("url")
                            or ""
                        ),

                        "source": "RemoteOK",

                        "salary": (
                            item.get("salary")
                            or "Not Mentioned"
                        ),

                        "experience": (
                            item.get("experience")
                            or ""
                        ),

                        "employment_type": (
                            item.get("employment_type")
                            or "Full Time"
                        ),

                        "remote": bool(
                            item.get("remote", True)
                        ),

                        "country": (
                            item.get("country")
                            or ""
                        ),

                        "posted_date": (
                            item.get("date")
                            or item.get("epoch")
                            or ""
                        ),

                        "company_logo": (
                            item.get("company_logo")
                            or item.get("logo")
                            or ""
                        ),

                        "company_url": (
                            item.get("company_url")
                            or ""
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

            print("RemoteOK Error:", e)

        return jobs