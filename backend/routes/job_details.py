from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from database import SessionLocal

router = APIRouter()


@router.get("/{job_id}")
def get_job_details(job_id: int):

    db = SessionLocal()

    try:

        row = db.execute(
            text("""
                SELECT
                    id,
                    title,
                    company,
                    location,
                    skills,
                    apply_url
                FROM jobs
                WHERE id = :id
            """),
            {
                "id": job_id
            }
        ).fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "skills": row[4],
            "apply_url": row[5]
        }

    finally:

        db.close()