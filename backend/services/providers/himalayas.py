import httpx
import re

BASE_URL = "https://himalayas.app/jobs/api"


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

        for job in data.get("jobs", []):

            title = job.get("title", "")
            company = job.get("companyName", "")
            job_location = job.get("location", "Remote")

            text = " ".join([
                title,
                str(job.get("description", "")),
                str(job.get("requirements", "")),
                str(job.get("skills", ""))
            ]).lower()

            '''if keyword and keyword not in title.lower():
                continue

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

                "id": f"himalayas-{job.get('id')}",

                "title": title,

                "company": company,

                "location": job_location,

                "salary": job.get(
                    "salary",
                    "Not Mentioned"
                ),

                "employment_type": job.get(
                    "employmentType",
                    "Not Mentioned"
                ),

                "description": job.get(
                    "description",
                    ""
                ),

                "skills": ", ".join(
                    job.get("skills", [])
                ),

                "apply_url": job.get(
                    "applyUrl"
                ),

                "posted_date": job.get(
                    "publishedAt"
                ),

                "source": "Himalayas"

            })

    except Exception as e:

        print("Himalayas Error:", e)

    return jobs