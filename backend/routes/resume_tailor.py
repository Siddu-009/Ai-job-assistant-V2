from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token
from services.resume_tailor import tailor_resume
from services.resume_formatter import format_resume

router = APIRouter()


class TailorRequest(BaseModel):
    token: str
    job: dict


@router.post("/")
def tailor(req: TailorRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT generated_resume
                FROM generated_resumes
                WHERE user_id=:id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "id": user_id
            }
        ).fetchone()

        if resume:

            resume_text = resume[0]

        else:

            resume = db.execute(
                text("""
                    SELECT resume_text
                    FROM resumes
                    WHERE user_id=:id
                    ORDER BY id DESC
                    LIMIT 1
                """),
                {
                    "id": user_id
                }
            ).fetchone()

            if not resume:

                raise HTTPException(
                    status_code=404,
                    detail="Resume not found"
                )

            resume_text = resume[0]

        from services.resume_writer import build_resume

        tailored_resume = build_resume(
            resume_text,
            req.job
        )

        formatted_resume = format_resume(
            tailored_resume
        )

        return {

            "success":True,

            "resume":formatted_resume

        }

    finally:

        db.close()