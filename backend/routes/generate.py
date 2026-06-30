from fastapi import APIRouter
from pydantic import BaseModel

from sqlalchemy import text

from database import SessionLocal

from services.ollama_resume import generate_resume
from services.pdf_generator import create_pdf
from services.resume_storage import save_resume
from services.token_service import decode_token

import os

router = APIRouter()

GENERATED_DIR = "generated"

os.makedirs(GENERATED_DIR, exist_ok=True)


class GenerateRequest(BaseModel):

    token: str

    job_description: str


@router.post("/")
def generate(req: GenerateRequest):

    payload = decode_token(req.token)

    if not payload:

        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        resume = db.execute(

            text("""

            SELECT resume_text

            FROM resumes

            WHERE user_id=:id

            ORDER BY id DESC

            LIMIT 1

            """),

            {

                "id": user_id

            }

        ).fetchone()

        if not resume:

            return {

                "success": False,

                "message": "Please upload your resume first."

            }

        resume_text = resume[0]

    finally:

        db.close()

    generated_resume = generate_resume(

        resume_text,

        req.job_description

    )

    txt_path = os.path.join(

        GENERATED_DIR,

        "generated_resume.txt"

    )

    with open(

        txt_path,

        "w",

        encoding="utf-8"

    ) as f:

        f.write(generated_resume)

    pdf_path = os.path.join(

        GENERATED_DIR,

        "generated_resume.pdf"

    )

    create_pdf(

        generated_resume,

        pdf_path

    )

    save_resume(

        user_id,

        req.job_description,

        generated_resume

    )

    return {

        "success": True,

        "message": "Resume Generated Successfully",

        "generated_resume": generated_resume,

        "pdf_file": "generated_resume.pdf",

        "txt_file": "generated_resume.txt"

    }
