from fastapi import APIRouter

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/")
def recruiter_dashboard():

    db = SessionLocal()

    total_resumes = db.execute(
        text("SELECT COUNT(*) FROM resumes")
    ).scalar()

    total_jobs = db.execute(
        text("SELECT COUNT(*) FROM jobs")
    ).scalar()

    total_applications = db.execute(
        text("SELECT COUNT(*) FROM applications")
    ).scalar()

    applied = db.execute(
        text("""
        SELECT COUNT(*)
        FROM applications
        WHERE status='Applied'
        """)
    ).scalar()

    interview = db.execute(
        text("""
        SELECT COUNT(*)
        FROM applications
        WHERE status='Interview Scheduled'
        """)
    ).scalar()

    selected = db.execute(
        text("""
        SELECT COUNT(*)
        FROM applications
        WHERE status='Selected'
        """)
    ).scalar()

    rejected = db.execute(
        text("""
        SELECT COUNT(*)
        FROM applications
        WHERE status='Rejected'
        """)
    ).scalar()

    db.close()

    return {
        "total_resumes": total_resumes,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "applied": applied,
        "interview_scheduled": interview,
        "selected": selected,
        "rejected": rejected
    }
