import httpx
import re

BASE_URL = "https://remoteok.com/api"


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

        headers = {
            "User-Agent": "AI-Job-Assistant"
        }

        async with httpx.AsyncClient(
            timeout=30,
            headers=headers
        ) as client:

            response = await client.get(BASE_URL)

        response.raise_for_status()

        data = response.json()

        # First item is metadata
        for job in data[1:]:

            title = job.get("position", "") or job.get("title", "")
            company = job.get("companyName", "")
            job_location = job.get("location", "Remote")

            text = " ".join([
                title,
                str(job.get("description", "")),
                " ".join(job.get("tags", []))
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

                "id": f"remoteok-{job.get('id')}",

                "title": title,

                "company": company,

                "location": job_location,

                "salary": job.get(
                    "salary_min",
                    "Not Mentioned"
                ),

                "employment_type": "Remote",

                "description": job.get(
                    "description",
                    ""
                ),

                "skills": ", ".join(
                    job.get("tags", [])
                ),

                "apply_url": job.get(
                    "url"
                ),

                "posted_date": job.get(
                    "date"
                ),

                "source": "RemoteOK"

            })

    except Exception as e:

        print("RemoteOK Error:", e)

    return jobs