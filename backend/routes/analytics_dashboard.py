from fastapi import APIRouter

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/")
def analytics_dashboard():

    db = SessionLocal()

    resumes = db.execute(
        text("SELECT COUNT(*) FROM resumes")
    ).scalar()

    jobs = db.execute(
        text("SELECT COUNT(*) FROM jobs")
    ).scalar()

    applications = db.execute(
        text("SELECT COUNT(*) FROM applications")
    ).scalar()

    alerts = db.execute(
        text("SELECT COUNT(*) FROM job_alerts")
    ).scalar()

    interviews = db.execute(
        text("SELECT COUNT(*) FROM interview_questions")
    ).scalar()

    db.close()

    return {
        "total_resumes": resumes,
        "total_jobs": jobs,
        "total_applications": applications,
        "total_job_alerts": alerts,
        "total_interview_questions": interviews
    }
