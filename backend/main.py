from fastapi import FastAPI

from cors import setup_cors

from routes.auth import router as auth_router
from routes.resume import router as resume_router
from routes.job import router as job_router
from routes.jobs import router as jobs_router
from routes.match import router as match_router
from routes.generate import router as generate_router
from routes.download import router as download_router
from routes.history import router as history_router
from routes.resume_details import router as resume_details_router
from routes.job_matcher import router as job_matcher_router
from routes.auto_match import router as auto_match_router
from routes.smart_match import router as smart_match_router
from routes.applications import router as applications_router
from routes.application_status import router as application_status_router
from routes.dashboard import router as dashboard_router
from routes.job_import import router as job_import_router
from routes.skill_gap import router as skill_gap_router
from routes.ats_score import router as ats_score_router
from routes.resume_builder import router as resume_builder_router
from routes.auto_resume import router as auto_resume_router
from routes.extract_resume import router as extract_resume_router
from routes.recommend_jobs import router as recommend_jobs_router
from routes.saved_jobs import router as saved_jobs_router
from routes.job_alerts import router as job_alerts_router
from routes.admin import router as admin_router
from routes.profile import router as profile_router
from routes.ai_resume import router as ai_resume_router

app = FastAPI(
    title="AI Job Assistant",
    version="1.0.0"
)

setup_cors(app)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    resume_router,
    prefix="/resume",
    tags=["Resume"]
)

app.include_router(
    job_router,
    prefix="/job",
    tags=["Job Description"]
)

app.include_router(
    jobs_router,
    prefix="/jobs",
    tags=["Jobs"]
)

app.include_router(
    match_router,
    prefix="/match",
    tags=["Match"]
)

app.include_router(
    generate_router,
    prefix="/generate",
    tags=["AI Resume"]
)

app.include_router(
    download_router,
    prefix="/download",
    tags=["Download"]
)

app.include_router(
    history_router,
    prefix="/history",
    tags=["History"]
)

app.include_router(
    resume_details_router,
    prefix="/resume-details",
    tags=["Resume Details"]
)

app.include_router(
    job_matcher_router,
    prefix="/job-matcher",
    tags=["Job Matcher"]
)

app.include_router(
    auto_match_router,
    prefix="/auto-match",
    tags=["Auto Match"]
)

app.include_router(
    smart_match_router,
    prefix="/smart-match",
    tags=["Smart Match"]
)

app.include_router(
    applications_router,
    prefix="/applications",
    tags=["Applications"]
)

app.include_router(
    application_status_router,
    prefix="/application-status",
    tags=["Application Status"]
)

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

app.include_router(
    job_import_router,
    prefix="/job-import",
    tags=["Job Import"]
)

app.include_router(
    skill_gap_router,
    prefix="/skill-gap",
    tags=["Skill Gap Analyzer"]
)

app.include_router(
    ats_score_router,
    prefix="/ats-score",
    tags=["ATS Score"]
)

app.include_router(
    resume_builder_router,
    prefix="/resume-builder",
    tags=["Resume Builder"]
)

app.include_router(
    auto_resume_router,
    prefix="/auto-resume",
    tags=["Auto ATS Resume"]
)

app.include_router(
    extract_resume_router,
    prefix="/extract-resume",
    tags=["Resume Extraction"]
)

app.include_router(
    recommend_jobs_router,
    prefix="/recommend-jobs",
    tags=["AI Recommendations"]
)

app.include_router(
    saved_jobs_router,
    prefix="/saved-jobs",
    tags=["Saved Jobs"]
)

app.include_router(
    job_alerts_router,
    prefix="/job-alerts",
    tags=["Job Alerts"]
)

app.include_router(
    admin_router,
    prefix="/admin",
    tags=["Admin"]
)

app.include_router(
    profile_router,
    prefix="/profile",
    tags=["Profile"]
)

app.include_router(
    ai_resume_router,
    prefix="/ai-resume",
    tags=["AI Resume"]
)

@app.get("/")
def root():
    return {
        "message": "AI Job Assistant API Running",
        "status": "success",
        "version": "1.0.0"
    }
