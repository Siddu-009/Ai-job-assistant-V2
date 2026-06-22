from fastapi import APIRouter
from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/")
def dashboard():

    db = SessionLocal()

    total_resumes = db.execute(
        text(
            "SELECT COUNT(*) FROM resumes"
        )
    ).scalar()

    latest_resume = db.execute(
        text(
            """
            SELECT
                filename,
                created_at
            FROM resumes
            ORDER BY id DESC
            LIMIT 1
            """
        )
    ).fetchone()

    db.close()

    return {
        "total_resumes": total_resumes,
        "latest_resume": latest_resume[0] if latest_resume else None,
        "uploaded_at": str(latest_resume[1]) if latest_resume else None
    }
