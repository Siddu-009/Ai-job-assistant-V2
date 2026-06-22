from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.cover_letter_generator import (
    generate_cover_letter
)

router = APIRouter()


class CoverLetterRequest(BaseModel):
    resume_id: int
    company: str
    job_title: str


@router.post("/")
def create_cover_letter(
    req: CoverLetterRequest
):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT resume_text
        FROM resumes
        WHERE id=:id
        """),
        {
            "id": req.resume_id
        }
    ).fetchone()

    if not result:

        db.close()

        return {
            "error": "Resume not found"
        }

    resume_text = result[0]

    cover_letter = generate_cover_letter(
        resume_text,
        req.company,
        req.job_title
    )

    db.execute(
        text("""
        INSERT INTO cover_letters
        (
            resume_id,
            company,
            job_title,
            cover_letter
        )
        VALUES
        (
            :resume_id,
            :company,
            :job_title,
            :cover_letter
        )
        """),
        {
            "resume_id": req.resume_id,
            "company": req.company,
            "job_title": req.job_title,
            "cover_letter": cover_letter
        }
    )

    db.commit()
    db.close()

    return {
        "resume_id": req.resume_id,
        "company": req.company,
        "job_title": req.job_title,
        "cover_letter": cover_letter
    }


@router.get("/{resume_id}")
def get_cover_letters(
    resume_id: int
):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            company,
            job_title,
            cover_letter,
            created_at
        FROM cover_letters
        WHERE resume_id=:resume_id
        ORDER BY id DESC
        """),
        {
            "resume_id": resume_id
        }
    )

    rows = result.fetchall()

    db.close()

    data = []

    for row in rows:

        data.append(
            {
                "id": row[0],
                "company": row[1],
                "job_title": row[2],
                "cover_letter": row[3],
                "created_at": str(row[4])
            }
        )

    return data
