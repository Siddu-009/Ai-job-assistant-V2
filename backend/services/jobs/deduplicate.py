def remove_duplicates(jobs):

    unique_jobs = {}

    for job in jobs:

        key = (
            job.title.strip().lower(),
            job.company.strip().lower()
        )

        if key not in unique_jobs:

            unique_jobs[key] = job
            continue

        existing = unique_jobs[key]

        # Keep longer description
        if len(job.description) > len(existing.description):
            existing.description = job.description

        # Keep salary if missing
        if (
            existing.salary == "Not Mentioned"
            and job.salary != "Not Mentioned"
        ):
            existing.salary = job.salary

        # Keep experience
        if (
            not existing.experience
            and job.experience
        ):
            existing.experience = job.experience

        # Keep company logo
        if (
            not existing.company_logo
            and job.company_logo
        ):
            existing.company_logo = job.company_logo

        # Keep company URL
        if (
            not existing.company_url
            and job.company_url
        ):
            existing.company_url = job.company_url

        # Keep apply URL
        if (
            not existing.apply_url
            and job.apply_url
        ):
            existing.apply_url = job.apply_url

        # Merge skills
        existing.skills = list(
            set(existing.skills + job.skills)
        )

        # Prefer remote if one source says remote
        existing.remote = existing.remote or job.remote

    return list(unique_jobs.values())