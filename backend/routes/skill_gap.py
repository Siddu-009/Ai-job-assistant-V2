from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.skill_gap_analyzer import analyze_skill_gap

router = APIRouter()


class SkillGapRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/")
def skill_gap(req: SkillGapRequest):

    try:

        return analyze_skill_gap(

            req.resume_text,

            req.job_description

        )

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"Skill gap analysis failed: {str(e)}"

        )
