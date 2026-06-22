from fastapi import APIRouter
from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/{resume_id}")
def get_resume(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                filename,
                resume_text,
                skills,
                created_at
            FROM resumes
            WHERE id = :id
            """
        ),
        {
            "id": resume_id
        }
    )

    row = result.fetchone()

    db.close()

    if not row:
        return {
            "error": "Resume not found"
        }

    return {
        "id": row[0],
        "filename": row[1],
        "resume_text": row[2],
        "skills": row[3],
        "created_at": str(row[4])
    }
