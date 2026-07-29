from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

from services.parser import extract_text
from services.resume_parser_ai import extract_resume_details
from services.ats_resume_generator import generate_ats_content
from services.resume_builder.builder import build_resume

router = APIRouter()


class AutoResumeRequest(BaseModel):
    filename: str
    job_description: str


@router.post("/")
def auto_resume(req: AutoResumeRequest):

    filepath = f"uploads/{req.filename}"

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    try:

        resume_text = extract_text(filepath)

        details = extract_resume_details(resume_text)

        ats_content = generate_ats_content(
            details,
            req.job_description
        )

        output_file = "generated/ats_resume.pdf"

        build_resume(

            name=details.get("name", ""),

            email=details.get("email", ""),

            phone=details.get("phone", ""),

            linkedin=details.get("linkedin", ""),

            github=details.get("github", ""),

            summary=ats_content,

            skills=details.get("skills", []),

            projects=details.get("projects", []),

            certifications="DevOps Training, Naresh IT",

            education=details.get("education", ""),

            output_file=output_file

        )

        return {

            "message": "ATS Resume Generated Successfully",

            "candidate": details.get("name", ""),

            "file": "ats_resume.pdf"

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"Resume generation failed: {str(e)}"

        )
