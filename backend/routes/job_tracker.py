from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


class ApplyRequest(BaseModel):
    resume_id: int
    job_id: int


@router.post("/apply")
def apply_job(req: ApplyRequest):

    db = SessionLocal()

    db.execute(
        text("""
        INSERT INTO applications
        (
            resume_id,
            job_id
        )
        VALUES
        (
            :resume_id,
            :job_id
        )
        """),
        {
            "resume_id": req.resume_id,
            "job_id": req.job_id
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Application submitted"
    }


@router.get("/list")
def application_list():

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            a.id,
            r.filename,
            j.title,
            j.company,
            a.status,
            a.applied_at
        FROM applications a
        JOIN resumes r
            ON a.resume_id = r.id
        JOIN jobs j
            ON a.job_id = j.id
        ORDER BY a.id DESC
        """)
    )

    rows = result.fetchall()

    db.close()

    data = []

    for row in rows:
        data.append({
            "application_id": row[0],
            "resume": row[1],
            "job_title": row[2],
            "company": row[3],
            "status": row[4],
            "applied_at": str(row[5])
        })

    return data
