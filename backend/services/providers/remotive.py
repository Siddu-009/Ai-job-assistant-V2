import httpx
import re

BASE_URL = "https://remotive.com/api/remote-jobs"


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
            company = job.get("company_name", "")
            job_location = job.get("candidate_required_location", "Remote")

            text = " ".join([
                job.get("title", ""),
                job.get("description", ""),
                str(job.get("tags", "")),
                str(job.get("category", ""))
            ]).lower()

            '''# Keyword filter
            if keyword and keyword not in title.lower():
                continue

            # Location filter
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
                "id": f"remotive-{job.get('id')}",
                "title": title,
                "company": company,
                "location": job_location,
                "salary": job.get("salary", "Not Mentioned"),
                "employment_type": job.get(
                    "job_type",
                    "Not Mentioned"
                ),
                "description": job.get("description", ""),
                "skills": "",
                "apply_url": job.get("url"),
                "posted_date": job.get("publication_date"),
                "source": "Remotive"
            })

    except Exception as e:

        print("Remotive Error:", e)

    return jobs