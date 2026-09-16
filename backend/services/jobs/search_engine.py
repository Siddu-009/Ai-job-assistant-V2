from services.jobs.aggregator import aggregate_jobs
from services.jobs.filter import filter_jobs
from services.jobs.deduplicate import remove_duplicates
from services.jobs.ai_ranker import rank_jobs
from services.jobs.ai_match import calculate_ai_match


class JobSearchEngine:

    async def search(

        self,

        keyword="",

        location="",

        experience="",

        employment_type="",

        remote=None,

        company="",

        page=1,

        limit=20,

        resume=None
    ):

        # Aggregate jobs
        jobs = await aggregate_jobs(
            keyword,
            location,
            experience
        )

        # Filter jobs
        jobs = filter_jobs(

            jobs,

            keyword,

            location,

            employment_type,

            remote,

            company,

            int(experience) if str(experience).isdigit() else None
        )

        # Remove duplicates
        jobs = remove_duplicates(jobs)

        if jobs:
            print(f"Unique Jobs: {len(jobs)}")

        # Rank jobs
        if jobs:

            jobs = rank_jobs(
                jobs,
                keyword,
                location
            )

        # AI Match
        for job in jobs:

            result = calculate_ai_match(
                job,
                keyword,
                location,
                experience
            )

            job.ai_score = result["score"]
            job.matched_skills = result["matched_skills"]
            job.missing_skills = result["missing_skills"]

        # Pagination

        page = max(page, 1)

        limit = max(1, min(limit, 100))

        total = len(jobs)

        start = (page - 1) * limit
        end = start + limit

        return {
            "success": True,
            "jobs": [
                job.to_dict()
                for job in jobs[start:end]
            ],
            "page": page,
            "total": total,
            "pages": (total + limit - 1) // limit
        }