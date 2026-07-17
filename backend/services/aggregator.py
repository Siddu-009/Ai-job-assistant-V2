import asyncio

from services.providers.arbeitnow import search_jobs as arbeitnow_jobs
from services.providers.remotive import search_jobs as remotive_jobs
from services.providers.remoteok import search_jobs as remoteok_jobs
from services.providers.himalayas import search_jobs as himalayas_jobs
from services.ranking import rank_jobs

from services.deduplicator import remove_duplicates


async def search_jobs(
    keyword="",
    location="",
    experience=""
):

    # Run all providers in parallel
    print(f"Keyword = '{keyword}'")
    print(f"Location = '{location}'")

    results = await asyncio.gather(
        arbeitnow_jobs(keyword, location, experience),
        remotive_jobs(keyword, location, experience),
        remoteok_jobs(keyword, location, experience),
        himalayas_jobs(keyword, location, experience),
        return_exceptions=True
    )

    all_jobs = []

    providers = [
        "Arbeitnow",
        "Remotive",
        "RemoteOK",
        "Himalayas"
    ]

    for provider, result in zip(providers, results):

        if isinstance(result, Exception):

            print(f"{provider} Error: {result}")

            continue

        print(f"{provider}: {len(result)} jobs")

        all_jobs.extend(result)

        filtered = []

        for job in all_jobs:

            score = 0

            text = " ".join([
                job.get("title", ""),
                job.get("description", ""),
                job.get("skills", "")
            ]).lower()

            if keyword:

                if keyword.lower() in text:
                    score += 60

            if location:

                if location.lower() in job.get("location","").lower():
                    score += 30

            job["search_score"] = score

            filtered.append(job)

        filtered.sort(
            key=lambda x: x["search_score"],
            reverse=True
        )

        all_jobs = filtered

    print(f"Total Jobs Before Filtering: {len(all_jobs)}")

    keyword = (keyword or "").strip().lower()
    location = (location or "").strip().lower()
    experience = (experience or "").strip().lower()

    filtered_jobs = []

    for job in all_jobs:

        score = 0

        title = str(job.get("title", "")).lower()

        description = str(job.get("description", "")).lower()

        skills = str(job.get("skills", "")).lower()

        location_text = str(job.get("location", "")).lower()

        # ---------- Keyword ----------

        if keyword:

            if keyword.lower() in title:
                score += 70

            elif keyword.lower() in description:
                score += 40

            elif keyword.lower() in skills:
                score += 30

        else:

            score += 10

        # ---------- Location ----------

        if location:

            if location.lower() in location_text:
                score += 30

        else:

            score += 10

        job["search_score"] = score

        filtered_jobs.append(job)

    print(f"Jobs After AI Ranking: {len(filtered_jobs)}")

    filtered_jobs.sort(
        key=lambda x: x["search_score"],
        reverse=True
    )

    all_jobs = filtered_jobs

    filtered_jobs = []

    for job in all_jobs:

        searchable = " ".join([
            str(job.get("title", "")),
            str(job.get("company", "")),
            str(job.get("description", "")),
            str(job.get("skills", "")),
        ]).lower()

        job_location = str(job.get("location", "")).lower()

        # Keyword filter
        if keyword and keyword not in searchable:
            continue

        # Location filter
        if (
            location
            and location not in job_location
            and "remote" not in job_location
            and "worldwide" not in job_location
        ):
            continue

        filtered_jobs.append(job)

    print(f"Jobs After Filtering: {len(filtered_jobs)}")

    # Remove duplicates AFTER filtering
    unique_jobs = remove_duplicates(filtered_jobs)

    print(f"Total Jobs After Deduplication: {len(unique_jobs)}")

    # Sort by latest job
    unique_jobs.sort(
        key=lambda job: (
            job.get("search_score", 0),
            str(job.get("posted_date") or "")
        ),
        reverse=True
    )

    print("Top 10 jobs after filtering:")

    for job in unique_jobs[:10]:
        print(job.get("title"), "-", job.get("location"))

    return unique_jobs