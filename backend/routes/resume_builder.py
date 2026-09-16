from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
import traceback

from services.resume_builder.builder import build_resume


router = APIRouter()


class ResumeBuilderRequest(BaseModel):

    full_name: str
    email: str
    phone: str
    location: str = ""
    summary: str = ""
    skills: str = ""
    education: str = ""
    experience: str = ""
    projects: str = ""


BASE_DIR = Path(__file__).resolve().parent.parent

GENERATED_DIR = BASE_DIR / "generated"

GENERATED_DIR.mkdir(
    parents=True,
    exist_ok=True
)


@router.post("/")
def create_resume(req: ResumeBuilderRequest):

    try:

        # --------------------------------------------------
        # Convert frontend form data into builder structure
        # --------------------------------------------------

        data = {

            "personal_info": {

                "name": req.full_name,

                "email": req.email,

                "phone": req.phone,

                "location": req.location,

            },

            "summary": req.summary,

            "skill_categories": [

                {

                    "category": "Skills",

                    "skills": [

                        skill.strip()

                        for skill in req.skills.split(",")

                        if skill.strip()

                    ]

                }

            ] if req.skills.strip() else [],

            "education": [

                {

                    "degree": req.education,

                    "institution": "",

                    "year": "",

                    "cgpa": ""

                }

            ] if req.education.strip() else [],

            "experience": [

                {

                    "company": "",

                    "designation": "",

                    "location": req.location,

                    "start_date": "",

                    "end_date": "",

                    "description": [

                        line.strip()

                        for line in req.experience.splitlines()

                        if line.strip()

                    ]

                }

            ] if req.experience.strip() else [],

            "projects": [

                {

                    "name": "Project",

                    "role": "",

                    "tech_stack": [],

                    "description": [

                        line.strip()

                        for line in req.projects.splitlines()

                        if line.strip()

                    ]

                }

            ] if req.projects.strip() else [],

            "certifications": [],

            "achievements": [],

            "languages": [],

            "interests": []

        }


        # --------------------------------------------------
        # Build DOCX
        # --------------------------------------------------

        document = build_resume(
            data,
            template="classic"
        )


        # --------------------------------------------------
        # Save DOCX
        # --------------------------------------------------

        docx_path = (
            GENERATED_DIR /
            "professional_resume.docx"
        )

        document.save(
            str(docx_path)
        )


        if not docx_path.exists():

            raise Exception(
                "Resume DOCX was not created."
            )


        # --------------------------------------------------
        # PDF path
        # --------------------------------------------------

        pdf_path = (
            GENERATED_DIR /
            "professional_resume.pdf"
        )


        # --------------------------------------------------
        # Try DOCX -> PDF
        # --------------------------------------------------

        try:

            from docx2pdf import convert

            convert(
                str(docx_path),
                str(pdf_path)
            )

        except Exception as pdf_error:

            print(
                "PDF conversion warning:",
                pdf_error
            )


        # --------------------------------------------------
        # If PDF exists
        # --------------------------------------------------

        if pdf_path.exists():

            return {

                "success": True,

                "message":
                    "Resume created successfully",

                "view_url":
                    "http://localhost:8000/resume-builder/download",

                "download_url":
                    "http://localhost:8000/resume-builder/download"

            }


        # --------------------------------------------------
        # DOCX fallback
        # --------------------------------------------------

        return {

            "success": True,

            "message":
                "Resume created successfully as DOCX",

            "view_url":
                "http://localhost:8000/resume-builder/download-docx",

            "download_url":
                "http://localhost:8000/resume-builder/download-docx"

        }


    except Exception as e:

        traceback.print_exc()

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# --------------------------------------------------
# PDF DOWNLOAD
# --------------------------------------------------

@router.get("/download")
def download_resume():

    pdf_path = (
        GENERATED_DIR /
        "professional_resume.pdf"
    )

    if not pdf_path.exists():

        raise HTTPException(

            status_code=404,

            detail="PDF resume not found."

        )

    return FileResponse(

        path=str(pdf_path),

        filename="professional_resume.pdf",

        media_type="application/pdf"

    )


# --------------------------------------------------
# DOCX DOWNLOAD
# --------------------------------------------------

@router.get("/download-docx")
def download_docx():

    docx_path = (
        GENERATED_DIR /
        "professional_resume.docx"
    )

    if not docx_path.exists():

        raise HTTPException(

            status_code=404,

            detail="DOCX resume not found."

        )

    return FileResponse(

        path=str(docx_path),

        filename="professional_resume.docx",

        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        )

    )