from fastapi import APIRouter
from pydantic import BaseModel

from sqlalchemy import text

from database import SessionLocal

from services.ats_scorer import calculate_ats_score
from services.token_service import decode_token
from services.notification_service import create_notification

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

            create_notification(
                user_id=user_id,
                title="✅ ATS Score Generated",
                message="Your ATS score has been generated.",
                notification_type="ats",
                link="/ats-score"
            )

            return {

                "success": False,

                "message": "Please upload resume first."

            }

        result = calculate_ats_score(
            row[0],
            req.job_description
        )

        print(result)

        return result

    finally:

        db.close()
