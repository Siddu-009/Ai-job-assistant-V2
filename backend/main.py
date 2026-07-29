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
from routes.resume_dashboard import router as resume_dashboard_router
from routes.resume_history import router as resume_history_router
from routes.resume_view import router as resume_view_router
from routes.resume_recommend import router as resume_recommend_router
from routes.job_tracker import router as job_tracker_router
from routes.application_workflow import router as application_workflow_router
from routes.recruiter_dashboard import router as recruiter_dashboard_router
from routes.skill_analytics import router as skill_analytics_router
from routes.interview_questions import router as interview_router
from routes.mock_test import router as mock_test_router
from routes.career_roadmap import router as career_roadmap_router
from routes.cover_letter import router as cover_letter_router
from routes.resume_versions import router as resume_versions_router
from routes.job_alerts_engine import router as job_alerts_engine_router
from routes.recruiter_search import router as recruiter_search_router
from routes.analytics_dashboard import router as analytics_dashboard_router
from routes.activity_timeline import router as activity_timeline_router
from routes.email_notifications import router as email_notifications_router
from routes.health import router as health_router
from routes.career_coach import router as career_coach_router
from routes.learning_recommendations import router as learning_router
from routes.resume_tailoring import router as resume_tailoring_router
from routes.interview_roles import router as interview_roles_router
from routes.ats_review import router as ats_review_router
from routes.job_match import router as job_match_router
from routes.notifications import router as notifications_router
from routes import resume_tailor
from routes import job_details
from routes.ats_resume import router as ats_resume_router
from routes.document_generator import router as document_generator_router
from routes.download_document import router as download_document_router
from routes import resume_converter
from routes.resume_analyzer import router as resume_analyzer_router
from routes.resume_optimizer import router as resume_optimizer_router
from routes.interview_preparation import router as interview_preparation_router

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from utils.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)

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

app.include_router(
    resume_dashboard_router,
    prefix="/resume-dashboard",
    tags=["Resume Dashboard"]
)

app.include_router(
    resume_history_router,
    prefix="/resume-history",
    tags=["Resume History"]
)

app.include_router(
    resume_view_router,
    prefix="/resume-view",
    tags=["Resume Viewer"]
)

app.include_router(
    resume_recommend_router,
    prefix="/resume-recommend",
    tags=["Resume Recommendations"]
)

app.include_router(
    job_tracker_router,
    prefix="/job-tracker",
    tags=["Job Tracker"]
)

app.include_router(
    application_workflow_router,
    prefix="/application-workflow",
    tags=["Application Workflow"]
)

app.include_router(
    recruiter_dashboard_router,
    prefix="/recruiter-dashboard",
    tags=["Recruiter Dashboard"]
)

app.include_router(
    skill_analytics_router,
    prefix="/skill-analytics",
    tags=["Skill Analytics"]
)

app.include_router(
    interview_router,
    prefix="/interview-questions",
    tags=["Interview Questions"]
)

app.include_router(
    mock_test_router,
    prefix="/mock-test",
    tags=["Mock Test"]
)

app.include_router(
    career_roadmap_router,
    prefix="/career-roadmap",
    tags=["Career Roadmap"]
)

app.include_router(
    cover_letter_router,
    prefix="/cover-letter",
    tags=["Cover Letter"]
)

app.include_router(
    resume_versions_router,
    prefix="/resume-versions",
    tags=["Resume Versions"]
)

app.include_router(
    job_alerts_engine_router,
    prefix="/job-alert-engine",
    tags=["Job Alert Engine"]
)

app.include_router(
    recruiter_search_router,
    prefix="/recruiter-search",
    tags=["Recruiter Search"]
)

app.include_router(
    analytics_dashboard_router,
    prefix="/analytics-dashboard",
    tags=["Analytics Dashboard"]
)

app.include_router(
    activity_timeline_router,
    prefix="/activity",
    tags=["Activity Timeline"]
)

app.include_router(
    email_notifications_router,
    prefix="/email-notifications",
    tags=["Email Notifications"]
)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

app.include_router(
    career_coach_router,
    prefix="/career-coach",
    tags=["Career Coach"]
)

app.include_router(
    learning_router,
    prefix="/learning-recommendations",
    tags=["Learning Recommendations"]
)

app.include_router(
    resume_tailoring_router,
    prefix="/resume-tailoring",
    tags=["Resume Tailoring"]
)

app.include_router(
    interview_roles_router,
    prefix="/interview-roles",
    tags=["Interview Roles"]
)

app.include_router(
    ats_review_router,
    prefix="/ats-review",
    tags=["ATS Review"]
)

app.include_router(
    job_match_router,
    prefix="/job-match",
    tags=["Job Match"]
)

app.include_router(
    resume_tailor.router,
    prefix="/resume-tailor",
    tags=["Resume Tailor"]
)

app.include_router(
    job_details.router,
    prefix="/jobs/details",
    tags=["Job Details"]
)

app.include_router(
    notifications_router,
    prefix="/notifications",
    tags=["Notifications"]
)

app.include_router(
    ats_resume_router,
    prefix="/ats-resume-generator",
    tags=["ATS Resume"]
)

app.include_router(
    document_generator_router,
    prefix="/generate-document",
    tags=["Document Generator"]
)

app.include_router(
    download_document_router,
    prefix="/download-document",
    tags=["Download Document"]
)

app.include_router(
    resume_converter.router,
    prefix="/resume-converter",
    tags=["Resume Converter"]
)

app.include_router(
    resume_analyzer_router,
    prefix="/resume-analyzer",
    tags=["Resume Analyzer"]
)

app.include_router(
    resume_optimizer_router,
    prefix="/resume-optimizer",
    tags=["Resume Optimizer"]
)

app.include_router(
    interview_preparation_router,
    prefix="/interview-preparation",
    tags=["Interview Preparation"]
)

@app.get("/")
def root():
    return {
        "message": "AI Job Assistant API Running",
        "status": "success",
        "version": "1.0.0"
    }

app.add_exception_handler(
    StarletteHTTPException,
    http_exception_handler
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)

app.add_exception_handler(
    Exception,
    global_exception_handler
)
