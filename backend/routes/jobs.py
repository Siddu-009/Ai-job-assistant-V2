from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.search_engine import search

router = APIRouter()


class JobRequest(BaseModel):
    title: str
    company: str
    location: str
    skills: str
    apply_url: str


class SearchRequest(BaseModel):
    keyword: str = ""
    location: str = ""
    experience: str = ""
    page: int = 1
    limit: int = 20


@router.post("/search")
async def search_jobs(req: SearchRequest):

    print(req)

    result = await search(
        req.keyword,
        req.location,
        "",          # Ignore experience for now
        req.page,
        req.limit
    )

    return {
        "success": True,
        **result
    }


@router.post("/add")
def add_job(req: JobRequest):

    db = SessionLocal()

    try:

        # Check if job already exists
        existing = db.execute(
            text("""
                SELECT id
                FROM jobs
                WHERE apply_url = :apply_url
                LIMIT 1
            """),
            {
                "apply_url": req.apply_url
            }
        ).fetchone()

        if existing:
            return {
                "id": existing[0],
                "message": "Job already exists"
            }

        # Insert new job
        result = db.execute(
            text("""
                INSERT INTO jobs
                (
                    title,
                    company,
                    location,
                    skills,
                    apply_url
                )
                VALUES
                (
                    :title,
                    :company,
                    :location,
                    :skills,
                    :apply_url
                )
                RETURNING id
            """),
            {
                "title": req.title,
                "company": req.company,
                "location": req.location,
                "skills": req.skills,
                "apply_url": req.apply_url
            }
        )

        job_id = result.scalar()

        db.commit()

        return {
            "id": job_id,
            "message": "Job added successfully"
        }

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


@router.get("/list")
def list_jobs():

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT
                    id,
                    title,
                    company,
                    location,
                    skills,
                    apply_url
                FROM jobs
                ORDER BY id DESC
            """)
        )

        rows = result.fetchall()

        return [
            {
                "id": row[0],
                "title": row[1],
                "company": row[2],
                "location": row[3],
                "skills": row[4],
                "apply_url": row[5]
            }
            for row in rows
        ]

    finally:

        db.close()