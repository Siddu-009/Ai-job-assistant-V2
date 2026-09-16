from services.jobs.role_mapper import expand_role
from services.jobs.location_ranker import expand_location


def filter_jobs(
    jobs,
    keyword="",
    location="",
    employment_type="",
    remote=None,
    company="",
    min_experience=None
):

    filtered = []

    roles = expand_role(keyword)
    locations = expand_location(location)

    for job in jobs:

        searchable = " ".join([
            job.title,
            job.company,
            job.description,
            " ".join(job.skills)
        ]).lower()

        # -----------------------
        # Role Filter
        # -----------------------
        print("=" * 80)
        print("Keyword:", keyword)
        print("Title:", job.title)
        print("Roles:", roles)
        matched = False

        title = job.title.lower()

        for role in roles:
            role_lower = role.lower()

            print(f"Checking: {role_lower} -> {title}")

            if role_lower in title:
                print("MATCH:", role_lower)
                matched = True
                break

        if not matched and keyword.lower() in title:
            print("MATCH:", keyword.lower())
            matched = True

        if not matched:
            print("SKIPPED:", job.title)
            continue

        # -----------------------
        # Location Filter
        # -----------------------

        if location:

            if not any(
                city.lower() in job.location.lower()
                for city in locations
            ):
                continue

        # -----------------------
        # Employment Type
        # -----------------------

        if employment_type:

            if employment_type.lower() not in job.employment_type.lower():
                continue

        # -----------------------
        # Remote Filter
        # -----------------------

        if remote is True:

            if not job.remote:
                continue

        # -----------------------
        # Company Filter
        # -----------------------

        if company:

            if company.lower() not in job.company.lower():
                continue

        # -----------------------
        # Experience Filter
        # -----------------------

        if (
            min_experience is not None
            and job.experience
        ):

            try:

                exp = int(job.experience)

                if exp < min_experience:
                    continue

            except Exception:
                pass

        filtered.append(job)

    return filtered