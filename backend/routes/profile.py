from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

from services.token_service import decode_token

router = APIRouter()


class ProfileRequest(BaseModel):
    token: str


@router.post("/")
def get_profile(req: ProfileRequest):

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

        user = db.execute(
            text("""
                SELECT
                    id,
                    name,
                    email,
                    created_at
                FROM users
                WHERE id=:id
            """),
            {
                "id": user_id
            }
        ).fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        resume_count = db.execute(
            text("""
                SELECT COUNT(*)
                FROM resumes
                WHERE user_id=:id
            """),
            {
                "id": user_id
            }
        ).scalar()

        generated_count = db.execute(
            text("""
                SELECT COUNT(*)
                FROM generated_resumes
                WHERE user_id=:id
            """),
            {
                "id": user_id
            }
        ).scalar()

        return {

            "id": user.id if hasattr(user, "id") else user[0],

            "name": user.name if hasattr(user, "name") else user[1],

            "email": user.email if hasattr(user, "email") else user[2],

            "created_at": str(
                user.created_at if hasattr(user, "created_at") else user[3]
            ),

            "uploaded_resumes": resume_count,

            "generated_resumes": generated_count

        }

    finally:

        db.close()
