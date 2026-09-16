import asyncio
import time

from services.jobs.providers import PROVIDERS


REQUEST_TIMEOUT = 8


async def aggregate_jobs(
    keyword="",
    location="",
    experience=""
):

    tasks = [

        asyncio.wait_for(

            provider.search(
                keyword,
                location,
                experience
            ),

            timeout=REQUEST_TIMEOUT

        )

        for provider in PROVIDERS

    ]

    start_time = time.perf_counter()

    results = await asyncio.gather(
        *tasks,
        return_exceptions=True
    )

    elapsed = time.perf_counter() - start_time

    jobs = []

    for provider, result in zip(
        PROVIDERS,
        results
    ):

        if isinstance(result, Exception):

            print(
                f"{provider.name} failed: {result}"
            )

            continue

        print(
            f"{provider.name}: {len(result)} jobs"
        )

        jobs.extend(result)

    print(
        f"Total Jobs: {len(jobs)} "
        f"| Providers: {len(PROVIDERS)} "
        f"| Time: {elapsed:.2f}s"
    )

    return jobs