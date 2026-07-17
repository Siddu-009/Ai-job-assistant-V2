from services.aggregator import search_jobs


async def search_live_jobs(
    keyword="",
    location="",
    experience=""
):
    return await search_jobs(
        keyword,
        location,
        experience
    )