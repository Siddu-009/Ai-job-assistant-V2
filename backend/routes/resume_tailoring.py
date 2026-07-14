from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import ai_chat
from services.notification_service import create_notification
from services.token_service import decode_token

router = APIRouter()


class ResumeTailorRequest(BaseModel):
    token: str
    resume: str
    job_description: str


@router.post("/")
def tailor_resume(req: ResumeTailorRequest):
    payload = decode_token(req.token)

    if not payload:

        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]

    prompt = f"""
You are an ATS Resume Expert.

Resume

{req.resume}

Job Description

{req.job_description}

Rewrite the resume to maximize ATS compatibility.

Include:

1. Professional Summary

2. Skills

3. Experience

4. Projects

5. Keywords Added

6. ATS Score Estimate

Return a professional resume only.
"""

    result = ai_chat(prompt)

    create_notification(
        user_id=user_id,
        title="📄 Resume Tailored",
        message="Your resume has been tailored successfully.",
        notification_type="resume"
    )

    return {
        "success": True,
        "tailored_resume": result
    }