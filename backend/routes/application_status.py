from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()

class StatusRequest(BaseModel):
    application_id: int
    status: str

from services.token_service import decode_token

class ApplicationStatusRequest(BaseModel):
    token: str


@router.post("/")
def list_application_status(req: ApplicationStatusRequest):

    payload = decode_token(req.token)

    if not payload:
        return {"applications": []}

    user_id = payload.get("user_id")

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

        return {
            "applications": [
                {
                    "application_id": row[0],
                    "title": row[1],
                    "company": row[2],
                    "status": row[3],
                    "applied_at": str(row[4])
                }
                for row in rows
            ]
        }

    finally:
        db.close()

@router.post("/update")
def update_status(req: StatusRequest):

    db = SessionLocal()

    db.execute(
        text(
            """
            UPDATE applications
            SET status = :status
            WHERE id = :id
            """
        ),
        {
            "status": req.status,
            "id": req.application_id
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Status updated successfully"
    }


@router.get("/{application_id}")
def get_status(application_id: int):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                status,
                applied_at
            FROM applications
            WHERE id = :id
            """
        ),
        {
            "id": application_id
        }
    )

    row = result.fetchone()

    db.close()

    if not row:
        return {
            "error": "Application not found"
        }

    return {
        "application_id": row[0],
        "status": row[1],
        "created_at": str(row[2])
    }
