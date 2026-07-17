from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()


class SaveJobRequest(BaseModel):
    token: str
    job_id: int


class DeleteJobRequest(BaseModel):
    token: str


@router.post("/add")
def save_job(req: SaveJobRequest):
    print("Received token:", req.token)

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

        existing = db.execute(
            text("""
                SELECT id
                FROM saved_jobs
                WHERE user_id=:user_id
                AND job_id=:job_id
            """),
            {
                "user_id": user_id,
                "job_id": req.job_id
            }
        ).fetchone()

        if existing:
            return {
                "message": "Job already saved"
            }

        db.execute(
            text("""
                INSERT INTO saved_jobs
                (
                    user_id,
                    job_id
                )
                VALUES
                (
                    :user_id,
                    :job_id
                )
            """),
            {
                "user_id": user_id,
                "job_id": req.job_id
            }
        )

        db.commit()

        return {
            "message": "Job saved successfully"
        }

    finally:

        db.close()


@router.get("/{token}")
def get_saved_jobs(token: str):

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
                    s.id,
                    j.title,
                    j.company,
                    j.location,
                    j.apply_url
                FROM saved_jobs s
                JOIN jobs j
                    ON s.job_id = j.id
                WHERE s.user_id = :user_id
                ORDER BY s.id DESC
            """),
            {
                "user_id": user_id
            }
        ).fetchall()

        return [

            {

                "saved_id": row[0],

                "title": row[1],

                "company": row[2],

                "location": row[3],

                "apply_url": row[4]

            }

            for row in rows

        ]

    finally:

        db.close()


@router.delete("/{saved_id}")
def delete_saved_job(
    saved_id: int,
    req: DeleteJobRequest
):

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

        deleted = db.execute(
            text("""
                DELETE FROM saved_jobs
                WHERE id=:id
                AND user_id=:user_id
            """),
            {
                "id": saved_id,
                "user_id": user_id
            }
        )

        db.commit()

        if deleted.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Saved job not found"
            )

        return {

            "message": "Saved job removed successfully"

        }

    finally:

        db.close()
