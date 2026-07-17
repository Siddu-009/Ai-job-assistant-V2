import httpx
import re

BASE_URL = "https://www.arbeitnow.com/api/job-board-api"


async def search_jobs(
    keyword="",
    location="",
    experience=""
):

    keyword = (keyword or "").strip().lower()
    location = (location or "").strip().lower()
    experience = (experience or "").strip().lower()

    jobs = []

    try:

        async with httpx.AsyncClient(timeout=30) as client:

            response = await client.get(BASE_URL)

        response.raise_for_status()

        data = response.json()

        for job in data.get("data", []):

            title = job.get("title", "")
            company = job.get("company_name", "")
            job_location = job.get("location", "")

            text = " ".join([
                job.get("title", ""),
                job.get("description", ""),
                str(job.get("skills", ""))
            ]).lower()

            '''# Keyword Filter
            if keyword and keyword not in title.lower():
                continue

            # Location Filter
            search_location = " ".join([
                str(job_location),
                str(job.get("description", "")),
            ]).lower()

            if location:
                if location.lower() not in search_location:
                    continue

            job_experience = ""

            match = re.search(r"(\d+)\+?\s*(years|year|yrs)", text)

            if match:
                job_experience = match.group(1)

            if experience:
                if job_experience and job_experience != experience:
                    continue'''

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

                "description": job.get("description", ""),

                "skills": ", ".join(
                    job.get("tags", [])
                ),

                "apply_url": job.get("url"),

                "posted_date": job.get("created_at"),

                "source": "Arbeitnow"

            })

    except Exception as e:

        print("Arbeitnow Error:", e)

    return jobs