import asyncio

from services.providers.arbeitnow import search_jobs


async def main():

    jobs = await search_jobs(
        "python",
        ""
    )

    print(f"Jobs Found : {len(jobs)}")

    if jobs:

        print(jobs[0])


asyncio.run(main())