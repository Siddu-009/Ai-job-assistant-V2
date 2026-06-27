from fastapi import APIRouter, HTTPException
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

    "github"

]


@router.post("/")
def recommend(req: RecommendRequest):

    payload = decode_token(req.token)

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

        row = db.execute(

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

        if not row:

            raise HTTPException(

                status_code=404,

                detail="No generated resume found"

            )

        resume_text = row[0].lower()

        found_skills = [

            skill

            for skill in SKILLS

            if skill in resume_text

        ]

        recommendations = recommend_jobs(

            found_skills

        )

        return {

            "skills_found": found_skills,

            "recommended_jobs": recommendations[:10]

        }

    finally:

        db.close()
