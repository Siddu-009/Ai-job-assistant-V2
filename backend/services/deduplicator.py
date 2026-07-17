def remove_duplicates(jobs):

    unique_jobs = []
    seen = set()

    for job in jobs:

        title = (job.get("title") or "").strip().lower()
        company = (job.get("company") or "").strip().lower()
        location = (job.get("location") or "").strip().lower()

        key = f"{title}|{company}|{location}"

        if key not in seen:
            seen.add(key)
            unique_jobs.append(job)

    return unique_jobs