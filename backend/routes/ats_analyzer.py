from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.ats_scorer import calculate_ats_score

router = APIRouter()


class ATSAnalyzerRequest(BaseModel):
    resume_id: int
    job_description: str


@router.post("/")
def analyze(req: ATSAnalyzerRequest):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT resume_text
            FROM resumes
            WHERE id = :id
            """
        ),
        {
            "id": req.resume_id
        }
    )

    row = result.fetchone()

    db.close()

    if not row:
        return {
            "error": "Resume not found"
        }

    resume_text = row[0]

    return calculate_ats_score(
        resume_text,
        req.job_description
    )
