from sqlalchemy.orm import Session

from services.jobs.aggregator import aggregate_jobs
from services.jobs.deduplicate import remove_duplicates
from services.jobs.repository import JobRepository


class JobIndexer:

    @staticmethod
    async def index_jobs(db: Session):

        print("Fetching jobs from providers...")

        jobs = await aggregate_jobs()

        print(f"Fetched {len(jobs)} jobs")

        jobs = remove_duplicates(jobs)

        print(f"{len(jobs)} jobs after deduplication")

        JobRepository.save_jobs(db, jobs)

        print("Jobs saved successfully")