import asyncio

from services.providers.remotive import search_jobs


async def main():

    jobs = await search_jobs(
        "",
        ""
    )

    print(f"Jobs Found : {len(jobs)}")

    if jobs:
        print(jobs[0])


asyncio.run(main())