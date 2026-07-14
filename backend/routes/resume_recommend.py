from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.ai_service import ai_chat

router = APIRouter()


class ResumeRecommendRequest(BaseModel):
    resume_id: int


class ResumeCompareRequest(BaseModel):
    resume_one: str
    resume_two: str


@router.post("/")
def recommend(req: ResumeRecommendRequest):

    db = SessionLocal()

    try:

        resume = db.execute(
            text("""
                SELECT skills
                FROM resumes
                WHERE id = :id
            """),
            {
                "id": req.resume_id
            }
        ).fetchone()

        if not resume:
            return {
                "error": "Resume not found"
            }

        resume_skills = []

        if resume[0]:
            resume_skills = [
                skill.strip().lower()
                for skill in resume[0].split(",")
                if skill.strip()
            ]

        jobs = db.execute(
            text("""
                SELECT
                    id,
                    title,
                    company,
                    location,
                    skills
                FROM jobs
            """)
        ).fetchall()

        recommendations = []

        for job in jobs:

            job_skills = []

            if job[4]:
                job_skills = [
                    skill.strip().lower()
                    for skill in job[4].split(",")
                    if skill.strip()
                ]

            matched_skills = list(
                set(resume_skills) &
                set(job_skills)
            )

            missing_skills = list(
                set(job_skills) -
                set(resume_skills)
            )

            score = 0

            if len(job_skills) > 0:
                score = round(
                    (len(matched_skills) / len(job_skills)) * 100,
                    2
                )

            recommendations.append(
                {
                    "job_id": job[0],
                    "title": job[1],
                    "company": job[2],
                    "location": job[3],
                    "match_score": score,
                    "matched_skills": matched_skills,
                    "missing_skills": missing_skills
                }
            )

        recommendations.sort(
            key=lambda x: x["match_score"],
            reverse=True
        )

        return recommendations

    finally:
        db.close()


@router.post("/compare")
def compare_resumes(req: ResumeCompareRequest):

    prompt = f"""
You are an ATS Resume Expert.

Compare the following two resumes.

Resume 1

{req.resume_one}

Resume 2

{req.resume_two}

Provide:

1. Overall Winner

2. ATS Score Resume 1 (0-100)

3. ATS Score Resume 2 (0-100)

4. Strengths of Resume 1

5. Strengths of Resume 2

6. Weaknesses of Resume 1

7. Weaknesses of Resume 2

8. Missing Skills

9. Final Recommendation

Return only the comparison.
"""

    result = ai_chat(prompt)

    return {
        "success": True,
        "comparison": result
    }