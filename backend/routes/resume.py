from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.parser import extract_text_from_pdf
from services.skills import extract_skills
from services.token_service import decode_token
from database import SessionLocal
from sqlalchemy import text
from services.notification_service import create_notification
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    token: str = Form(...),
    file: UploadFile = File(...)
):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload["user_id"]

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_text_from_pdf(filepath)

    skills = extract_skills(resume_text)

    db = SessionLocal()

    try:

        db.execute(
            text("""
                INSERT INTO resumes
                (
                    user_id,
                    filename,
                    resume_text,
                    skills
                )
                VALUES
                (
                    :user_id,
                    :filename,
                    :resume_text,
                    :skills
                )
            """),
            {
                "user_id": user_id,
                "filename": file.filename,
                "resume_text": resume_text,
                "skills": ",".join(skills)
            }
        )

        db.commit()

        create_notification(
            user_id=user_id,
            title="📄 Resume Uploaded",
            message=f"{file.filename} uploaded successfully.",
            notification_type="resume"
        )

        return {
            "success": True,
            "message": "Resume uploaded successfully",
            "filename": file.filename,
            "resume_text": resume_text,
            "skills": skills
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        db.close()
