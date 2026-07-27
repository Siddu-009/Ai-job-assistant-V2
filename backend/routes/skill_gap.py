from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.notification_service import create_notification
from services.token_service import decode_token

from services.skill_gap_analyzer import analyze_skill_gap

router = APIRouter()


class SkillGapRequest(BaseModel):
    token: str
    resume_text: str
    job_description: str


@router.post("/")
def skill_gap(req: SkillGapRequest):
    payload = decode_token(req.token)

    if not payload:

        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]

    try:

        result = analyze_skill_gap(
            req.resume_text,
            req.job_description
        )

        create_notification(
            user_id=user_id,
            title="📊 Skill Gap Analysis",
            message="Your skill gap analysis is ready.",
            notification_type="skill_gap",
            link="/skill-gap"
        )

        return result

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"Skill gap analysis failed: {str(e)}"

        )
