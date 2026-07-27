from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from pathlib import Path

from database import SessionLocal
from services.ai_service import ai_chat
from services.token_service import decode_token

router = APIRouter()


class ATSResumeRequest(BaseModel):
    token: str
    resume_id: int


@router.post("/")
def generate_ats_resume(req: ATSResumeRequest):

    payload = decode_token(req.token)

    if not payload:
        return {
            "success": False,
            "message": "Invalid token"
        }

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT resume_text
                FROM resumes
                WHERE id=:id
                AND user_id=:user_id
            """),
            {
                "id": req.resume_id,
                "user_id": user_id
            }
        ).fetchone()

        if not resume:
            return {
                "success": False,
                "message": "Resume not found"
            }

        prompt = f"""
Rewrite this resume to be ATS friendly.

{resume[0]}
"""

        result = ai_chat(prompt)

        BASE_DIR = Path(__file__).resolve().parent.parent

        GENERATED_DIR = BASE_DIR / "generated"

        GENERATED_DIR.mkdir(exist_ok=True)

        txt_path = GENERATED_DIR / "ats_resume.txt"

        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(result)

        return {
            "success": True,
            "resume": result
        }

    finally:
        db.close()