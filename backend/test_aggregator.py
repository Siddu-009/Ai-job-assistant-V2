import asyncio

from services.aggregator import search_jobs


async def main():

    jobs = await search_jobs("", "")

    print()

    print("=" * 60)

    print("TOTAL JOBS:", len(jobs))

    print("=" * 60)

    if jobs:

        print(jobs[0])


asyncio.run(main())