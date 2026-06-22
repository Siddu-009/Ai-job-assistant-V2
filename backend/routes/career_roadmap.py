from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.career_roadmap import generate_roadmap

router = APIRouter()


class RoadmapRequest(BaseModel):
    resume_id: int
    target_role: str


@router.post("/")
def create_roadmap(req: RoadmapRequest):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT skills
        FROM resumes
        WHERE id=:id
        """),
        {
            "id": req.resume_id
        }
    ).fetchone()

    if not result:

        db.close()

        return {
            "error": "Resume not found"
        }

    skills = result[0]

    roadmap = generate_roadmap(
        skills,
        req.target_role
    )

    db.execute(
        text("""
        INSERT INTO career_roadmaps
        (
            resume_id,
            target_role,
            roadmap
        )
        VALUES
        (
            :resume_id,
            :target_role,
            :roadmap
        )
        """),
        {
            "resume_id": req.resume_id,
            "target_role": req.target_role,
            "roadmap": roadmap
        }
    )

    db.commit()
    db.close()

    return {
        "resume_id": req.resume_id,
        "target_role": req.target_role,
        "roadmap": roadmap
    }


@router.get("/{resume_id}")
def get_roadmaps(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            target_role,
            roadmap,
            created_at
        FROM career_roadmaps
        WHERE resume_id=:resume_id
        ORDER BY id DESC
        """),
        {
            "resume_id": resume_id
        }
    )

    rows = result.fetchall()

    db.close()

    data = []

    for row in rows:

        data.append({
            "id": row[0],
            "target_role": row[1],
            "roadmap": row[2],
            "created_at": str(row[3])
        })

    return data
