from fastapi import APIRouter
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token
from services.ai_service import ai_chat
from pydantic import BaseModel

router = APIRouter()


class ATSReviewRequest(BaseModel):

    token: str


@router.post("/")
def review_resume(req: ATSReviewRequest):

    payload = decode_token(req.token)

    if not payload:

        return {

            "success": False,

            "message": "Invalid Token"

        }

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

                "id": payload["user_id"]

            }

        ).fetchone()

        if not row:

            return {

                "success": False,

                "message": "Upload resume first."

            }

        resume = row[0]

        prompt = f"""
You are an ATS Resume Reviewer.

Analyze the resume.

Return ONLY JSON.

{{
"score":90,
"formatting":95,
"grammar":90,
"projects":85,
"experience":80,
"education":100,
"recommendations":[
"...",
"..."
]
}}

Resume:

{resume}
"""

        response = ai_chat(prompt)

        return {

            "success": True,

            "review": response

        }

    finally:

        db.close()
