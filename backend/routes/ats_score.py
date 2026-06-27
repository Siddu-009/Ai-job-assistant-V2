from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.ats_scorer import calculate_ats_score

router = APIRouter()


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/")
def ats_score(req: ATSRequest):

    try:

        return calculate_ats_score(

            req.resume_text,

            req.job_description

        )

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"ATS calculation failed: {str(e)}"

        )
