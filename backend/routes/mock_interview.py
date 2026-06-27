from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.interview_scorer import score_answer
from services.token_service import decode_token

router = APIRouter()


class MockInterviewRequest(BaseModel):
    token: str
    resume_id: int
    question: str
    answer: str


@router.post("/")
def submit_answer(req: MockInterviewRequest):

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

    if not req.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT id
                FROM resumes
                WHERE id=:resume_id
                AND user_id=:user_id
            """),
            {
                "resume_id": req.resume_id,
                "user_id": user_id
            }
        ).fetchone()

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        score, feedback = score_answer(req.answer)

        db.execute(
            text("""
                INSERT INTO interview_answers
                (
                    resume_id,
                    question,
                    answer,
                    score,
                    feedback
                )
                VALUES
                (
                    :resume_id,
                    :question,
                    :answer,
                    :score,
                    :feedback
                )
            """),
            {
                "resume_id": req.resume_id,
                "question": req.question,
                "answer": req.answer,
                "score": score,
                "feedback": feedback
            }
        )

        db.commit()

        return {
            "score": score,
            "feedback": feedback
        }

    finally:

        db.close()


@router.get("/{resume_id}/{token}")
def interview_history(
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
                    ia.question,
                    ia.answer,
                    ia.score,
                    ia.feedback,
                    ia.created_at
                FROM interview_answers ia
                JOIN resumes r
                    ON ia.resume_id = r.id
                WHERE ia.resume_id=:resume_id
                AND r.user_id=:user_id
                ORDER BY ia.id DESC
            """),
            {
                "resume_id": resume_id,
                "user_id": user_id
            }
        ).fetchall()

        return [

            {
                "question": row[0],
                "answer": row[1],
                "score": row[2],
                "feedback": row[3],
                "created_at": str(row[4])
            }

            for row in rows

        ]

    finally:

        db.close()
