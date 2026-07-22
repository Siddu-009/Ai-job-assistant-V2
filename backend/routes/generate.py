from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from pathlib import Path

from database import SessionLocal
from services.ollama_resume import generate_resume
from services.pdf_generator import create_pdf
from services.resume_storage import save_resume
from services.token_service import decode_token

from services.simple_pdf import create_simple_pdf
from services.cover_letter import generate_cover_letter
from services.career_roadmap import generate_roadmap
from services.ats_scorer import calculate_ats_score

from services.resume_parser_ai import extract_resume_details
from services.ats_resume_generator import generate_ats_content
from services.resume_builder import build_resume

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
GENERATED_DIR = BASE_DIR / "generated"
GENERATED_DIR.mkdir(exist_ok=True)


class GenerateRequest(BaseModel):
    token: str
    job_description: str


@router.post("/")
def generate(req: GenerateRequest):

    print("\n========== GENERATE API CALLED ==========")

    payload = decode_token(req.token)
    print("Decoded Payload:", payload)

    if not payload:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]
    print("User ID:", user_id)

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
            {"id": user_id}
        ).fetchone()

        print("Database Result:", resume)

        if resume is None:
            print("Resume NOT found")
            return {
                "success": False,
                "message": "Please upload your resume first."
            }

        resume_text = resume[0]
        print("Resume Length:", len(resume_text))

    finally:
        db.close()

    print("Generating Resume...")

    generated_resume = generate_resume(
        resume_text,
        req.job_description
    )

    print("Resume Generated")

    txt_path = GENERATED_DIR / "generated_resume.txt"

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(generated_resume)

    print("TXT Saved:", txt_path)

    pdf_path = GENERATED_DIR / "generated_resume.pdf"

    create_pdf(
        generated_resume,
        str(pdf_path)
    )

    print("PDF Saved:", pdf_path)
    print("PDF Exists:", pdf_path.exists())

    save_resume(
        user_id,
        req.job_description,
        generated_resume
    )

    # ==========================================
    # Generate Cover Letter PDF
    # ==========================================

    cover_letter = generate_cover_letter(
        payload.get("name", "Candidate"),
        {
            "title": "Software Engineer",
            "company": "Target Company"
        }
    )

    create_simple_pdf(
        cover_letter,
        str(GENERATED_DIR / "cover_letter.pdf"),
        "Cover Letter"
    )

    print("Cover Letter PDF Created")


    # ==========================================
    # Generate ATS Report PDF
    # ==========================================

    ats = calculate_ats_score(
        resume_text,
        req.job_description
    )

    ats_text = f"""
    ATS Score : {ats['ats_score']}%

    Verdict:
    {ats['verdict']}

    Matched Skills:
    {', '.join(ats['matched_skills'])}

    Missing Skills:
    {', '.join(ats['missing_skills'])}

    Recommendations:

    """

    for r in ats["recommendations"]:
        ats_text += f"- {r}\n"

    create_simple_pdf(
        ats_text,
        str(GENERATED_DIR / "ats_report.pdf"),
        "ATS Report"
    )

    print("ATS Report PDF Created")


    # ==========================================
    # Generate Career Roadmap PDF
    # ==========================================

    roadmap = generate_roadmap("DevOps Engineer")

    create_simple_pdf(
        roadmap,
        str(GENERATED_DIR / "career_roadmap.pdf"),
        "Career Roadmap"
    )
    print("Career Roadmap PDF Created")

    # ==========================================
    # Generate ATS Resume PDF
    # ==========================================

    details = extract_resume_details(resume_text)

    ats_summary = generate_ats_content(
        details,
        req.job_description
    )

    build_resume(

        name=details["name"],

        email=details["email"],

        phone=details["phone"],

        location="",

        summary=ats_summary,

        skills=details["skills"],

        education=details["education"],

        experience="",

        projects=details["projects"],

        output_file=str(GENERATED_DIR / "ats_resume.pdf")

    )

    print("ATS Resume PDF Created")

    return {
        "success": True,
        "message": "Resume Generated Successfully",
        "generated_resume": generated_resume,
        "pdf_file": "generated_resume.pdf",
        "txt_file": "generated_resume.txt"
    }