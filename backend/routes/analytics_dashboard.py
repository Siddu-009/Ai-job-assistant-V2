from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token
from fastapi import APIRouter, HTTPException, Header

router = APIRouter()

@router.post("")
def analytics_dashboard(
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header"
        )

    token = authorization.replace("Bearer ", "")

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

        uploaded_resumes = db.execute(
            text("""
                SELECT COUNT(*)
                FROM resumes
                WHERE user_id = :id
            """),
            {"id": user_id}
        ).scalar() or 0

        generated_resumes = db.execute(
            text("""
                SELECT COUNT(*)
                FROM generated_resumes
                WHERE user_id = :id
            """),
            {"id": user_id}
        ).scalar() or 0

        saved_jobs = db.execute(
            text("""
                SELECT COUNT(*)
                FROM saved_jobs
                WHERE user_id = :id
            """),
            {"id": user_id}
        ).scalar() or 0

        applications = db.execute(
            text("""
                SELECT COUNT(*)
                FROM applications
                WHERE user_id = :id
            """),
            {"id": user_id}
        ).scalar() or 0

        total_activity = (
            uploaded_resumes +
            generated_resumes +
            saved_jobs +
            applications
        )

        if total_activity >= 20:
            insight = "Excellent job! You are highly active in your job search."
        elif total_activity >= 10:
            insight = "Good progress. Keep applying consistently."
        elif total_activity >= 5:
            insight = "Your profile is growing. Upload more resumes and apply for more jobs."
        else:
            insight = "Start by uploading a resume and applying for jobs."

        return {

            "uploaded_resumes": uploaded_resumes,

            "generated_resumes": generated_resumes,

            "saved_jobs": saved_jobs,

            "applications": applications,

            "insights": insight

        }

    finally:

        db.close()
