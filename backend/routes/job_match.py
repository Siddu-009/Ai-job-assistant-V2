from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
import json
import re

from database import SessionLocal
from services.token_service import decode_token
from services.ai_service import ai_chat

router = APIRouter()


class JobMatchRequest(BaseModel):
    token: str
    job_description: str


@router.post("/")
def job_match(req: JobMatchRequest):

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
You are a professional ATS engine.

Compare the Resume with the Job Description.

Return ONLY valid JSON.

Format:

{{
"score":90,
"verdict":"Excellent Match",
"matched_skills":[
],
"missing_skills":[
],
"recommendations":[
]
}}

Resume:

{resume}

Job Description:

{req.job_description}
"""

        response = ai_chat(prompt)

        try:

            match = re.search(r"\{.*\}", response, re.S)

            if match:

                data = json.loads(match.group())

                data["success"] = True

                return data

        except Exception:

            pass

        return {
            "success": False,
            "message": "AI returned an invalid response.",
            "raw": response
        }

    finally:

        db.close()
