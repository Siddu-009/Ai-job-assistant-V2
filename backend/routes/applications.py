from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()


class ApplyRequest(BaseModel):
    token: str
    job_id: int


@router.post("/apply")
def apply(req: ApplyRequest):
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
                FROM applications
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
                "message": "You have already applied for this job"
            }

        db.execute(
            text("""
                INSERT INTO applications
                (
                    user_id,
                    job_id,
                    status
                )
                VALUES
                (
                    :user_id,
                    :job_id,
                    'Applied'
                )
            """),
            {
                "user_id": user_id,
                "job_id": req.job_id
            }
        )

        db.commit()

        return {
            "message": "Application submitted successfully"
        }

    finally:

        db.close()


class ApplicationHistoryRequest(BaseModel):
    token: str


@router.post("/my-applications")
def my_applications(req: ApplicationHistoryRequest):

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

        rows = db.execute(
            text("""
                SELECT
                    a.id,
                    j.title,
                    j.company,
                    a.status,
                    a.applied_at
                FROM applications a
                JOIN jobs j
                    ON a.job_id = j.id
                WHERE a.user_id=:user_id
                ORDER BY a.id DESC
            """),
            {
                "user_id": user_id
            }
        ).fetchall()

        return [

            {

                "application_id": row[0],

                "title": row[1],

                "company": row[2],

                "status": row[3],

                "applied_at": str(row[4])

            }

            for row in rows

        ]

    finally:

        db.close()
