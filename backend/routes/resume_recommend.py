from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


class ResumeRecommendRequest(BaseModel):
    resume_id: int


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

        print("Resume Skills:", resume_skills)

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

        print("Jobs Found:", len(jobs))

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
