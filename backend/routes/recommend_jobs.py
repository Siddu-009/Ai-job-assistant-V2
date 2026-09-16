from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token
from services.recommendation_engine import get_recommended_jobs


router = APIRouter()


class RecommendRequest(BaseModel):
    token: str
    location: str = ""
    keyword: str = ""


@router.post("/")
async def recommend(req: RecommendRequest):
    """
    Generate personalized job recommendations using
    the authenticated user's latest resume.
    """

    # Validate token
    payload = decode_token(req.token)

    if not payload:
        return {
            "recommended_jobs": [],
            "skills_found": [],
            "message": "Invalid token"
        }

    user_id = payload.get("user_id")

    if not user_id:
        return {
            "recommended_jobs": [],
            "skills_found": [],
            "message": "User ID missing in token"
        }

    # Clean search inputs
    keyword = (req.keyword or "").strip()
    location = (req.location or "").strip()

    db = SessionLocal()

    try:
        # --------------------------------------------------
        # 1. Get the authenticated user's generated resume
        # --------------------------------------------------
        resume_row = db.execute(
            text("""
                SELECT generated_resume
                FROM generated_resumes
                WHERE user_id = :user_id
                  AND generated_resume IS NOT NULL
                  AND TRIM(generated_resume) != ''
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "user_id": user_id
            }
        ).fetchone()

        resume_text = None

        if resume_row:
            resume_text = resume_row[0]

        # --------------------------------------------------
        # 2. Fallback to the authenticated user's uploaded
        #    resume only
        # --------------------------------------------------
        if not resume_text:
            resume_row = db.execute(
                text("""
                    SELECT resume_text
                    FROM resumes
                    WHERE user_id = :user_id
                      AND resume_text IS NOT NULL
                      AND TRIM(resume_text) != ''
                    ORDER BY id DESC
                    LIMIT 1
                """),
                {
                    "user_id": user_id
                }
            ).fetchone()

            if resume_row:
                resume_text = resume_row[0]

        # --------------------------------------------------
        # 3. Handle missing resume
        # --------------------------------------------------
        if not resume_text:
            return {
                "recommended_jobs": [],
                "skills_found": [],
                "message": "No resume found for this user"
            }

        # --------------------------------------------------
        # 4. Generate recommendations
        # --------------------------------------------------
        recommended_jobs, skills = await get_recommended_jobs(
            resume_text=resume_text,
            keyword=keyword,
            location=location
        )

        # Ensure response values are always valid lists
        if not isinstance(recommended_jobs, list):
            recommended_jobs = []

        if not isinstance(skills, list):
            skills = []

        return {
            "recommended_jobs": recommended_jobs,
            "skills_found": skills,
            "keyword": keyword,
            "location": location,
            "total_results": len(recommended_jobs)
        }

    except Exception as error:
        print(f"Recommendation endpoint error: {error}")

        return {
            "recommended_jobs": [],
            "skills_found": [],
            "message": "Unable to generate job recommendations"
        }

    finally:
        db.close()