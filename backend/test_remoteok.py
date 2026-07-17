import asyncio

from services.providers.remoteok import search_jobs


async def main():

    jobs = await search_jobs("", "")

    print("Jobs Found:", len(jobs))

    if jobs:
        print(jobs[0])


asyncio.run(main())