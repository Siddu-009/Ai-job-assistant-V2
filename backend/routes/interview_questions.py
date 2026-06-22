from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.interview_generator import generate_questions

router = APIRouter()


class InterviewRequest(BaseModel):
    resume_id: int


@router.post("/")
def create_questions(req: InterviewRequest):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT skills
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

    skills = result[0]

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
    db.close()

    return {
        "resume_id": req.resume_id,
        "questions": questions
    }

@router.get("/{resume_id}")
def get_questions(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            question,
            created_at
        FROM interview_questions
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

        data.append({
            "id": row[0],
            "question": row[1],
            "created_at": str(row[2])
        })

    return data
