from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import uuid
import traceback

from services.resume_parser import get_resume_text
from services.ats_converter import convert_to_ats_resume
from services.resume_builder.builder import build_resume
from services.resume_analyzer.analyzer import analyze_resume_for_job

router = APIRouter()

@router.post("/analyze")
async def analyze_resume_api(
    resume_file: UploadFile = File(None),
    resume_text: str = Form(""),
    job_description: str = Form(""),
    target_role: str = Form(""),
    target_company: str = Form(""),
):
    try:
        extracted_text = get_resume_text(
            file=resume_file.file if resume_file else None,
            filename=resume_file.filename if resume_file else None,
            pasted_text=resume_text,
        )

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Resume text is empty."
            )

        resume_data = convert_to_ats_resume(
            extracted_text,
            target_role,
            target_company,
        )

        analysis = analyze_resume_for_job(
            resume_data,
            job_description,
        )

        return {
            "success": True,
            "analysis": analysis,
            "resume_data": resume_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.post("")
async def resume_converter(
    resume_file: UploadFile = File(None),
    resume_text: str = Form(""),
    job_description: str = Form(""),   # ← Add this line
    target_role: str = Form(""),
    target_company: str = Form(""),
    template: str = Form("classic"),
):
    try:
        extracted_text = get_resume_text(
            file=resume_file.file if resume_file else None,
            filename=resume_file.filename if resume_file else None,
            pasted_text=resume_text,
        )

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Resume text is empty."
            )

        print("Job Description:")
        print(job_description)

        resume_data = convert_to_ats_resume(
            extracted_text,
            target_role,
            target_company,
        )

        analysis = analyze_resume_for_job(
            resume_data,
            job_description
        )

        output_dir = Path("generated_resumes")
        output_dir.mkdir(exist_ok=True)

        document = build_resume(
            resume_data,
            template
        )

        output_path = output_dir / f"{uuid.uuid4()}.docx"

        document.save(output_path)

        return FileResponse(
            path=str(output_path),
            filename="ATS_Resume.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )

    except Exception as e:
        traceback.print_exc()   # <-- add this
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )