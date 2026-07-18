from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

# Download Generated TXT Resume
@router.get("/resume-txt")
def download_txt():

    filepath = "generated/generated_resume.txt"

    if not os.path.exists(filepath):
        return {
            "error": "TXT file not found"
        }

    return FileResponse(
        path=filepath,
        media_type="text/plain",
        filename="generated_resume.txt"
    )


# Download Generated PDF Resume
@router.get("/resume-pdf")
def download_pdf():

    filepath = "generated/generated_resume.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "PDF file not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="generated_resume.pdf"
    )


# Download Professional Resume
@router.get("/professional-resume")
def download_professional_resume():

    filepath = "generated/professional_resume.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "Professional Resume not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="professional_resume.pdf"
    )


# Download ATS Resume
@router.get("/ats-resume")
def download_ats_resume():

    filepath = "generated/ats_resume.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "ATS Resume not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="ats_resume.pdf"
    )

# Download Cover Letter
@router.get("/cover-letter")
def download_cover_letter():

    filepath = "generated/cover_letter.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "Cover Letter not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="cover_letter.pdf"
    )


# Download ATS Report
@router.get("/ats-report")
def download_ats_report():

    filepath = "generated/ats_report.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "ATS Report not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="ats_report.pdf"
    )


# Download Career Roadmap
@router.get("/career-roadmap")
def download_career_roadmap():

    filepath = "generated/career_roadmap.pdf"

    if not os.path.exists(filepath):
        return {
            "error": "Career Roadmap not found"
        }

    return FileResponse(
        path=filepath,
        media_type="application/pdf",
        filename="career_roadmap.pdf"
    )