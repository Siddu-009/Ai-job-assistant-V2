from fastapi import APIRouter
from pydantic import BaseModel

from sqlalchemy import text

from database import SessionLocal

from services.ats_scorer import calculate_ats_score
from services.token_service import decode_token

router = APIRouter()


class ATSRequest(BaseModel):

    token: str

    job_description: str


@router.post("/")
def ats_score(req: ATSRequest):

    payload = decode_token(req.token)

    if not payload:

        return {

            "success": False,

            "message": "Invalid Token"

        }

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        row = db.execute(

            text("""

            SELECT resume_text

            FROM resumes

            WHERE user_id=:id

            ORDER BY id DESC

            LIMIT 1

            """),

            {

                "id": user_id

            }

        ).fetchone()

        if not row:

            return {

                "success": False,

                "message": "Please upload resume first."

            }

        return calculate_ats_score(

            row[0],

            req.job_description

        )

    finally:

        db.close()
