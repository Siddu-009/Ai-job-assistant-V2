from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token
from services.job_recommender import recommend_jobs

router = APIRouter()


class RecommendRequest(BaseModel):
    token: str


SKILLS = [
    "aws",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "ansible",
    "linux",
    "prometheus",
    "grafana",
    "git",
    "github",
    "helm",
    "argocd",
]


@router.post("/")
def recommend(req: RecommendRequest):

    payload = decode_token(req.token)

    if not payload:
        return {
            "recommended_jobs": [],
            "skills_found": [],
            "message": "Invalid token"
        }

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT generated_resume
                FROM generated_resumes
                WHERE user_id=:id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "id": user_id
            }
        ).fetchone()

        if resume:

            resume_text = resume[0]

        else:

            resume = db.execute(
                text("""
                    SELECT resume_text
                    FROM resumes
                    ORDER BY id DESC
                    LIMIT 1
                """)
            ).fetchone()

            if not resume:

                return {
                    "recommended_jobs": [],
                    "skills_found": [],
                    "message": "No resume found"
                }

            resume_text = resume[0]

        resume_text = resume_text.lower()

        found_skills = []

        for skill in SKILLS:

            if skill in resume_text:
                found_skills.append(skill)

        jobs = recommend_jobs(found_skills)

        return {
            "recommended_jobs": jobs[:10],
            "skills_found": found_skills
        }

    finally:
        db.close()
