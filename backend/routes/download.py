from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from services.token_service import decode_token

router = APIRouter()

# Base directory of the backend
BASE_DIR = Path(__file__).resolve().parent.parent

# generated folder
GENERATED_DIR = BASE_DIR / "generated"


# -----------------------------
# Download Generated TXT Resume
# -----------------------------
@router.get("/resume-txt")
def download_txt():

    filepath = GENERATED_DIR / "generated_resume.txt"

    if not filepath.exists():
        return {"error": "TXT file not found"}

    return FileResponse(
        path=str(filepath),
        media_type="text/plain",
        filename="generated_resume.txt"
    )


# -----------------------------
# Download Generated PDF Resume
# -----------------------------
@router.get("/resume-pdf")
def download_pdf():

    filepath = GENERATED_DIR / "generated_resume.pdf"

    if not filepath.exists():
        return {"error": "PDF file not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="generated_resume.pdf"
    )


# -----------------------------
# Professional Resume
# -----------------------------
@router.get("/professional-resume")
def download_professional_resume():

    filepath = GENERATED_DIR / "professional_resume.pdf"

    if not filepath.exists():
        return {"error": "Professional Resume not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="professional_resume.pdf"
    )


# -----------------------------
# ATS Resume
# -----------------------------
@router.get("/ats-resume")
def download_ats_resume():

    filepath = GENERATED_DIR / "ats_resume.pdf"

    if not filepath.exists():
        return {"error": "ATS Resume not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="ats_resume.pdf"
    )


# -----------------------------
# Cover Letter
# -----------------------------
@router.get("/cover-letter")
def download_cover_letter():

    filepath = GENERATED_DIR / "cover_letter.pdf"

    if not filepath.exists():
        return {"error": "Cover Letter not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="cover_letter.pdf"
    )


# -----------------------------
# ATS Report
# -----------------------------
@router.get("/ats-report")
def download_ats_report():

    filepath = GENERATED_DIR / "ats_report.pdf"

    if not filepath.exists():
        return {"error": "ATS Report not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="ats_report.pdf"
    )


# -----------------------------
# Career Roadmap
# -----------------------------
@router.get("/career-roadmap")
def download_career_roadmap():

    filepath = GENERATED_DIR / "career_roadmap.pdf"

    if not filepath.exists():
        return {"error": "Career Roadmap not found"}

    return FileResponse(
        path=str(filepath),
        media_type="application/pdf",
        filename="career_roadmap.pdf"
    )

@router.get("/download-document/{document_type}/{token}")
def download_document(document_type: str, token: str):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload["user_id"]

    BASE_DIR = Path(__file__).resolve().parent.parent

    file_path = (
        BASE_DIR
        / "generated"
        / f"user_{user_id}"
        / f"{document_type}.pdf"
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"{document_type} not found"
        )

    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        filename=file_path.name
    )