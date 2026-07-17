from services.live_jobs import search_live_jobs
from services.ranking import rank_jobs


async def search(
    keyword="",
    location="",
    experience="",
    page=1,
    limit=20
):

    jobs = await search_live_jobs(keyword, location, experience)

    jobs = rank_jobs(jobs, keyword)

    total = len(jobs)

    start = (page - 1) * limit
    end = start + limit

    return {
        "jobs": jobs[start:end],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }