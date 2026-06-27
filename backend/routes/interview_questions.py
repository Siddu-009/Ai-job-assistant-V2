from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.interview_generator import generate_questions
from services.token_service import decode_token

router = APIRouter()


class InterviewRequest(BaseModel):
    token: str
    resume_id: int


@router.post("/")
def create_questions(req: InterviewRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    db = SessionLocal()

    try:

        row = db.execute(
            text("""
                SELECT skills
                FROM resumes
                WHERE id=:resume_id
                AND user_id=:user_id
            """),
            {
                "resume_id": req.resume_id,
                "user_id": user_id
            }
        ).fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        skills = row[0]

        questions = generate_questions(skills)

        db.execute(
            text("""
                INSERT INTO interview_questions
                (
                    resume_id,
                    question
                )
                VALUES
                (
                    :resume_id,
                    :question
                )
            """),
            {
                "resume_id": req.resume_id,
                "question": questions
            }
        )

        db.commit()

        return {
            "resume_id": req.resume_id,
            "questions": questions
        }

    finally:

        db.close()


@router.get("/{resume_id}/{token}")
def get_questions(
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

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    db = SessionLocal()

    try:

        rows = db.execute(
            text("""
                SELECT
                    iq.id,
                    iq.question,
                    iq.created_at
                FROM interview_questions iq
                JOIN resumes r
                    ON iq.resume_id = r.id
                WHERE iq.resume_id=:resume_id
                AND r.user_id=:user_id
                ORDER BY iq.id DESC
            """),
            {
                "resume_id": resume_id,
                "user_id": user_id
            }
        ).fetchall()

        return [

            {

                "id": row[0],

                "question": row[1],

                "created_at": str(row[2])

            }

            for row in rows

        ]

    finally:

        db.close()
