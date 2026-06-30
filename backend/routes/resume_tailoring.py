from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import ai_chat

router = APIRouter()


class ResumeTailorRequest(BaseModel):
    resume: str
    job_description: str


@router.post("/")
def tailor_resume(req: ResumeTailorRequest):

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

    return {
        "tailored_resume": result
    }
