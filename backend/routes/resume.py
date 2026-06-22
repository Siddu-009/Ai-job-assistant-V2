from fastapi import APIRouter, UploadFile, File
from services.parser import extract_text_from_pdf
from services.skills import extract_skills
from database import SessionLocal
from sqlalchemy import text
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_text_from_pdf(filepath)
    skills = extract_skills(resume_text)

    db = SessionLocal()

    db.execute(
        text(
            """
            INSERT INTO resumes (filename, resume_text, skills)
            VALUES (:filename, :resume_text, :skills)
            """
        ),
        {
            "filename": file.filename,
            "resume_text": resume_text,
            "skills": ",".join(skills)
        }
    )

    db.commit()
    db.close()

    return {
        "filename": file.filename,
        "skills": skills,
        "message": "Resume saved successfully"
    }
