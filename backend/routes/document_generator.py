from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from pathlib import Path

from database import SessionLocal
from services.ai_service import ai_chat
from services.token_service import decode_token
from services.notification_service import create_notification
from services.pdf_service import generate_pdf
from fastapi.responses import FileResponse

router = APIRouter()


class DocumentRequest(BaseModel):
    token: str
    resume_id: int
    document_type: str


PROMPTS = {
    "ats_resume": """
Rewrite the following resume to maximize ATS compatibility.

Return a professional ATS-friendly resume.
""",

    "cover_letter": """
Create a professional cover letter using this resume.
""",

    "ats_report": """
Analyze this resume and generate a complete ATS Report.

Include:

- ATS Score
- Missing Skills
- Formatting
- Improvements
- Final Suggestions
""",

    "career_roadmap": """
Generate a career roadmap for this candidate.

Include:

1. Current Level
2. Skills to Learn
3. Certifications
4. Projects
5. 30-60-90 Day Plan
6. Recommended Career Path
""",

    "resume_enhancer": """
Improve this resume professionally.

Return an enhanced version.
"""
}

@router.post("/")
def generate_document(req: DocumentRequest):

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
                WHERE id=:id
                AND user_id=:user_id
            """),
            {
                "id": req.resume_id,
                "user_id": user_id
            }
        ).fetchone()

        if not resume:
            return {
                "success": False,
                "message": "Resume not found"
            }

        resume_text = resume[0]

        prompt = PROMPTS.get(req.document_type)

        if not prompt:
            return {
                "success": False,
                "message": "Unknown document type"
            }

        final_prompt = f"""
{prompt}

Resume

{resume_text}
"""

        result = ai_chat(final_prompt)

        # Create user-specific generated folder
        BASE_DIR = Path(__file__).resolve().parent.parent
        GENERATED_DIR = BASE_DIR / "generated" / f"user_{user_id}"
        GENERATED_DIR.mkdir(parents=True, exist_ok=True)

        # Save generated document
        filename = f"{req.document_type}.pdf"

        filepath = GENERATED_DIR / filename

        print("=" * 60)
        print("User ID:", user_id)
        print("Saving to:", filepath)
        print("Folder exists:", GENERATED_DIR.exists())

        generate_pdf(
            content=result,
            output_path=filepath
        )

        print("PDF Exists:", filepath.exists())
        print("=" * 60)

        # Save another copy for the old download system
        old_file_path = BASE_DIR / "generated" / f"{req.document_type}.pdf"

        generate_pdf(
            content=result,
            output_path=old_file_path
        )

        # Create notification
        create_notification(
            user_id=user_id,
            title="AI Document Generated",
            message=f"{req.document_type.replace('_', ' ').title()} generated successfully.",
            notification_type=req.document_type,
            link="/resume-center"
        )

        return FileResponse(
            path=filepath,
            filename=filename,
            media_type="application/pdf"
        )

    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": str(e)
        }

    finally:
        db.close()