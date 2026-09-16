from services.live_jobs import search_live_jobs
from services.ai_query_parser import parse_search
from services.ranking import rank_jobs


async def search(
    keyword="",
    location="",
    experience="",
    page=1,
    limit=20
):

    # AI understands the search
    search_data = await parse_search(
        keyword,
        location,
        experience
    )

    # Fetch jobs from providers
    jobs = await search_live_jobs(
        keyword,
        location,
        experience
    )

    # Rank jobs intelligently
    jobs = rank_jobs(
        jobs,
        search_data
    )

    total = len(jobs)

    start = (page - 1) * limit
    end = start + limit

    return {
        "jobs": jobs[start:end],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
        "search": search_data
    }