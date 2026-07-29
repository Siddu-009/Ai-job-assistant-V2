from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from services.resume_parser import get_resume_text
from services.ats_converter import convert_to_ats_resume

from services.resume_optimizer.optimizer import optimize_resume
from services.resume_optimizer.parser import parse_ai_resume
from services.resume_optimizer.validator import validate_resume

router = APIRouter()


@router.post("")
async def resume_optimizer(
    resume_file: UploadFile = File(None),
    resume_text: str = Form(""),
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

        ai_response = optimize_resume(resume_data)

        optimized_resume = parse_ai_resume(ai_response)

        missing = validate_resume(optimized_resume)

        return {
            "success": True,
            "original_resume": resume_data,
            "optimized_resume": optimized_resume,
            "missing_fields": missing,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )