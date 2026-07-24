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
            title="Resume Generated",
            message="Your resume is ready.",
            notification_type="RESUME",
            link="/resume-center"
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

@router.get("/latest/{token}")
def get_latest_resume(token: str):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT filename,
                       resume_text,
                       skills
                FROM resumes
                WHERE user_id = :user_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "user_id": user_id
            }
        ).fetchone()

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        return {
            "success": True,
            "filename": resume[0],
            "resume_text": resume[1],
            "skills": resume[2]
        }

    finally:
        db.close()