from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()


class DashboardRequest(BaseModel):
    token: str


@router.post("/")
def dashboard(req: DashboardRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume_count = db.execute(
            text("""
                SELECT COUNT(*)
                FROM resumes
                WHERE user_id=:id
            """),
            {"id": user_id}
        ).scalar() or 0

        applications = db.execute(
            text("""
                SELECT COUNT(*)
                FROM applications
                WHERE user_id=:id
            """),
            {"id": user_id}
        ).scalar() or 0

        interviews = db.execute(
            text("""
                SELECT COUNT(*)
                FROM applications
                WHERE user_id=:id
                AND LOWER(status)='interview'
            """),
            {"id": user_id}
        ).scalar() or 0

        selected = db.execute(
            text("""
                SELECT COUNT(*)
                FROM applications
                WHERE user_id=:id
                AND LOWER(status)='selected'
            """),
            {"id": user_id}
        ).scalar() or 0

        rejected = db.execute(
            text("""
                SELECT COUNT(*)
                FROM applications
                WHERE user_id=:id
                AND LOWER(status)='rejected'
            """),
            {"id": user_id}
        ).scalar() or 0

        recent = db.execute(
            text("""
                SELECT
                    j.title,
                    j.company,
                    a.status
                FROM applications a
                JOIN jobs j
                    ON a.job_id=j.id
                WHERE a.user_id=:id
                ORDER BY a.id DESC
                LIMIT 5
            """),
            {"id": user_id}
        ).fetchall()

        return {

            "resume_count": resume_count,

            "applications": applications,

            "interviews": interviews,

            "selected": selected,

            "rejected": rejected,

            "recent_jobs":[
                {
                    "title":r[0],
                    "company":r[1],
                    "status":r[2]
                }
                for r in recent
            ]

        }

    finally:

        db.close()
