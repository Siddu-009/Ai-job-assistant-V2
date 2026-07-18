from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from database import SessionLocal

router = APIRouter()


class DashboardRequest(BaseModel):
    token: str = ""


def get_dashboard_data():

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
        text("SELECT COUNT(*) FROM applications WHERE status='Applied'")
    ).scalar()

    interview = db.execute(
        text("""
            SELECT COUNT(*)
            FROM applications
            WHERE status IN (
                'Interview Scheduled',
                'HR Interview',
                'Technical Interview',
                'Manager Round'
            )
        """)
    ).scalar()

    selected = db.execute(
        text("""
            SELECT COUNT(*)
            FROM applications
            WHERE status IN (
                'Offer Released',
                'Selected'
            )
        """)
    ).scalar()

    rejected = db.execute(
        text("""
            SELECT COUNT(*)
            FROM applications
            WHERE status='Rejected'
        """)
    ).scalar()

    avg_score = db.execute(
        text("""
            SELECT COALESCE(AVG(score),0)
            FROM recommended_jobs
        """)
    ).scalar()

    db.close()

    hiring_rate = 0

    if total_applications:
        hiring_rate = round((selected / total_applications) * 100, 2)

    return {
        # Old dashboard fields
        "total_resumes": total_resumes,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "applied": applied,
        "interview_scheduled": interview,
        "selected": selected,
        "rejected": rejected,

        # Recruiter analytics fields
        "candidates": total_resumes,
        "jobs_posted": total_jobs,
        "interviews": interview,
        "offers": selected,
        "hiring_rate": hiring_rate,
        "average_ats": round(avg_score or 0, 2),
        "insights": [
            f"{total_applications} total applications received.",
            f"{selected} candidates selected.",
            f"{interview} candidates are currently in interview rounds."
        ]
    }


@router.get("/")
def recruiter_dashboard():
    return get_dashboard_data()


@router.post("/")
def recruiter_dashboard_post(req: DashboardRequest):
    return get_dashboard_data()