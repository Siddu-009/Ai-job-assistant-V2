from fastapi import APIRouter
from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/")
def get_resume_history():

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                filename,
                skills,
                created_at
            FROM resumes
            ORDER BY id DESC
            """
        )
    )

    rows = result.fetchall()

    db.close()

    return [
        {
            "id": row[0],
            "filename": row[1],
            "skills": row[2],
            "created_at": str(row[3])
        }
        for row in rows
    ]
