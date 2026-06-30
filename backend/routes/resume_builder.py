from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import traceback

from services.resume_builder import build_resume

router = APIRouter()


class ResumeBuilderRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str = ""
    summary: str
    skills: str
    education: str
    experience: str = ""
    projects: str


@router.post("/")
def create_resume(req: ResumeBuilderRequest):

    try:

        os.makedirs("generated", exist_ok=True)

        output_file = "generated/professional_resume.pdf"

        build_resume(
            req.full_name,
            req.email,
            req.phone,
            req.location,
            req.summary,
            req.skills,
            req.education,
            req.experience,
            req.projects,
            output_file
        )

        if not os.path.exists(output_file):
            raise Exception("PDF was not created.")

        return {
            "success": True,
            "message": "Resume created successfully",
            "view_url": "/api/resume-builder/download",
            "download_url": "/api/resume-builder/download"
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download")
def download_resume():

    file_path = "generated/professional_resume.pdf"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume not found.")

    return FileResponse(
        path=file_path,
        filename="professional_resume.pdf",
        media_type="application/pdf"
    )
