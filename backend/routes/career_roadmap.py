from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.career_roadmap import generate_roadmap
from services.token_service import decode_token

router = APIRouter()


class RoadmapRequest(BaseModel):
    token: str
    target_role: str


@router.post("/")
def create_roadmap(req: RoadmapRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    db = SessionLocal()

    try:

        row = db.execute(
            text("""
                SELECT id, skills
                FROM resumes
                WHERE user_id=:user_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "user_id": user_id
            }
        ).fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        resume_id = row[0]
        skills = row[1]

        roadmap = generate_roadmap(
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
                "resume_id": resume_id,
                "target_role": req.target_role,
                "roadmap": roadmap
            }
        )

        db.commit()

        return {
            "resume_id": resume_id,
            "target_role": req.target_role,
            "roadmap": roadmap
        }

    finally:

        db.close()


@router.get("/{resume_id}/{token}")
def get_roadmaps(
    resume_id: int,
    token: str
):

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload"
        )

    db = SessionLocal()

    try:

        rows = db.execute(
            text("""
                SELECT
                    cr.id,
                    cr.target_role,
                    cr.roadmap,
                    cr.created_at
                FROM career_roadmaps cr
                JOIN resumes r
                    ON cr.resume_id = r.id
                WHERE cr.resume_id=:resume_id
                AND r.user_id=:user_id
                ORDER BY cr.id DESC
            """),
            {
                "resume_id": resume_id,
                "user_id": user_id
            }
        ).fetchall()

        return [
            {
                "id": row[0],
                "target_role": row[1],
                "roadmap": row[2],
                "created_at": str(row[3])
            }
            for row in rows
        ]

    finally:

        db.close()
