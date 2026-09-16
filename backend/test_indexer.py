import asyncio

from database import SessionLocal
from services.jobs.indexer import JobIndexer


async def main():

    db = SessionLocal()

    try:
        await JobIndexer.index_jobs(db)
    finally:
        db.close()


asyncio.run(main())