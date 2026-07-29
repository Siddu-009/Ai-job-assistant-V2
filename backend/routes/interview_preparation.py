from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from services.resume_parser import get_resume_text
from services.ats_converter import convert_to_ats_resume

from services.interview_preparation.generator import generate_questions
from services.interview_preparation.parser import parse_questions

router = APIRouter()


@router.post("")
async def interview_preparation(
    resume_file: UploadFile = File(None),
    resume_text: str = Form(""),
    target_role: str = Form(""),
    target_company: str = Form(""),
    job_description: str = Form(""),
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

        ai_response = generate_questions(
            resume_data,
            job_description
        )

        questions = parse_questions(ai_response)

        return {
            "success": True,
            "resume": resume_data,
            "questions": questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )