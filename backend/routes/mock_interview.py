from fastapi import APIRouter
from pydantic import BaseModel
from database import SessionLocal
from sqlalchemy import text
from services.interview_scorer import score_answer

router = APIRouter()


class MockInterviewRequest(BaseModel):
    resume_id: int
    question: str
    answer: str


@router.post("/")
def submit_answer(req: MockInterviewRequest):
    score, feedback = score_answer(req.answer)

    db = SessionLocal()

    db.execute(
        text(
            """
            INSERT INTO interview_answers (resume_id, question, answer, score, feedback)
            VALUES (:resume_id, :question, :answer, :score, :feedback)
            """
        ),
        {
            "resume_id": req.resume_id,
            "question": req.question,
            "answer": req.answer,
            "score": score,
            "feedback": feedback
        }
    )

    db.commit()
    db.close()

    return {
        "score": score,
        "feedback": feedback
    }


@router.get("/{resume_id}")
def interview_history(resume_id: int):
    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT question, answer, score, feedback, created_at
            FROM interview_answers
            WHERE resume_id = :resume_id
            ORDER BY id DESC
            """
        ),
        {"resume_id": resume_id}
    )

    rows = result.fetchall()
    db.close()

    data = []
    for row in rows:
        data.append({
            "question": row[0],
            "answer": row[1],
            "score": row[2],
            "feedback": row[3],
            "created_at": str(row[4])
        })

    return data
