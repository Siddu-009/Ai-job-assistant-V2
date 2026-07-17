from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.cover_letter_generator import generate_cover_letter
from services.token_service import decode_token

router = APIRouter()


class CoverLetterRequest(BaseModel):
    token: str
    company: str
    job_title: str
    job_description: str


@router.post("/")
def create_cover_letter(req: CoverLetterRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    db = SessionLocal()

    try:

        row = db.execute(
            text("""
                SELECT id, resume_text
                FROM resumes
                WHERE user_id=:user_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "user_id": user_id
            }
        ).fetchone()

        resume_id = row[0]
        resume_text = row[1]

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        resume_text = row[0]

        cover_letter = generate_cover_letter(
            resume_text,
            req.company,
            req.job_title,
            req.job_description
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
                "resume_id": resume_id,
                "company": req.company,
                "job_title": req.job_title,
                "cover_letter": cover_letter
            }
        )

        db.commit()

        return {
            "resume_id": resume_id,
            "company": req.company,
            "job_title": req.job_title,
            "cover_letter": cover_letter
        }

    finally:

        db.close()


@router.get("/{resume_id}/{token}")
def get_cover_letters(
    resume_id: int,
    token: str
):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    db = SessionLocal()

    try:

        rows = db.execute(
            text("""
                SELECT
                    c.id,
                    c.company,
                    c.job_title,
                    c.cover_letter,
                    c.created_at
                FROM cover_letters c
                JOIN resumes r
                    ON c.resume_id = r.id
                WHERE c.resume_id=:resume_id
                AND r.user_id=:user_id
                ORDER BY c.id DESC
            """),
            {
                "resume_id": resume_id,
                "user_id": user_id
            }
        ).fetchall()

        return [
            {
                "id": row[0],
                "company": row[1],
                "job_title": row[2],
                "cover_letter": row[3],
                "created_at": str(row[4])
            }
            for row in rows
        ]

    finally:

        db.close()
