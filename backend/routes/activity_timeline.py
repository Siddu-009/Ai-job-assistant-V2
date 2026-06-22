from fastapi import APIRouter

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.post("/")
def add_activity(
    resume_id: int,
    activity_type: str,
    details: str
):

    db = SessionLocal()

    db.execute(
        text("""
        INSERT INTO activity_logs
        (
            resume_id,
            activity_type,
            details
        )
        VALUES
        (
            :resume_id,
            :activity_type,
            :details
        )
        """),
        {
            "resume_id": resume_id,
            "activity_type": activity_type,
            "details": details
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Activity Logged"
    }


@router.get("/{resume_id}")
def get_timeline(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            activity_type,
            details,
            created_at
        FROM activity_logs
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
            "activity_type": row[1],
            "details": row[2],
            "created_at": str(row[3])
        })

    return data
