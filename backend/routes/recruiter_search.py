from fastapi import APIRouter

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/{skill}")
def search_resumes(skill: str):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            filename,
            skills,
            created_at
        FROM resumes
        WHERE LOWER(skills)
        LIKE LOWER(:skill)
        ORDER BY id DESC
        """),
        {
            "skill": f"%{skill}%"
        }
    )

    rows = result.fetchall()

    db.close()

    data = []

    for row in rows:

        data.append(
            {
                "resume_id": row[0],
                "filename": row[1],
                "skills": row[2],
                "created_at": str(row[3])
            }
        )

    return data
