from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


class RecruiterSearchRequest(BaseModel):
    skill: str = ""
    experience: str = ""
    ats_score: int = 0


@router.post("/")
def recruiter_search(req: RecruiterSearchRequest):

    db = SessionLocal()

    try:

        rows = db.execute(

            text("""

            SELECT

                u.id,
                u.name,
                u.email,

                r.resume_text,
                r.skills,
                r.filename,
                r.created_at

            FROM resumes r

            JOIN users u

            ON r.user_id=u.id

            ORDER BY r.id DESC

            """)

        ).fetchall()

        candidates = []

        search_skill = req.skill.lower()

        for row in rows:

            skills = row[4] or ""

            score = 0

            matched = []

            if search_skill:

                if search_skill in skills.lower():

                    score += 70

                    matched.append(search_skill)

            skill_count = len(

                [

                    x.strip()

                    for x in skills.split(",")

                    if x.strip()

                ]

            )

            score += min(skill_count * 3, 30)

            score = min(score, 100)

            if score < req.ats_score:

                continue

            candidates.append(

                {

                    "user_id": row[0],

                    "name": row[1],

                    "email": row[2],

                    "skills": skills,

                    "resume": row[3],

                    "resume_file": row[5],

                    "created_at": str(row[6]),

                    "experience": req.experience,

                    "ats_score": score,

                    "match_score": score,

                    "matched_skills": matched,

                    "ai_reason": f"{row[1]} matches because of {skills}"

                }

            )

        candidates.sort(

            key=lambda x: x["match_score"],

            reverse=True

        )

        return {

            "success": True,

            "total": len(candidates),

            "candidates": candidates

        }

    finally:

        db.close()