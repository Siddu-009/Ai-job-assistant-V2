from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

# IMPORTANT:
# Do NOT use prefix="/job-alerts" here because main.py already adds it.
router = APIRouter(tags=["Job Alerts"])


class ListRequest(BaseModel):
    token: str


@router.post("/")
def list_alerts(req: ListRequest):

    payload = decode_token(req.token)

    if not payload:
        return {"alerts": []}

    user_id = payload["user_id"]

    db = SessionLocal()

    rows = db.execute(
        text("""
            SELECT
                id,
                job_title,
                company,
                location,
                apply_url
            FROM job_alerts
            WHERE user_id = :user_id
            ORDER BY id DESC
        """),
        {"user_id": user_id}
    ).fetchall()

    db.close()

    return {
        "alerts": [
            {
                "id": row[0],
                "role": row[1],
                "salary": row[2],
                "location": row[3],
                "apply_url": row[4]
            }
            for row in rows
        ]
    }


class CreateAlertRequest(BaseModel):
    token: str
    role: str
    location: str = ""
    salary: str = ""


@router.post("/create")
def create_alert(req: CreateAlertRequest):

    payload = decode_token(req.token)

    if not payload:
        return {"message": "Invalid Token"}

    user_id = payload["user_id"]

    db = SessionLocal()

    db.execute(
        text("""
            INSERT INTO job_alerts
            (
                user_id,
                job_title,
                company,
                location
            )
            VALUES
            (
                :user_id,
                :job_title,
                :company,
                :location
            )
        """),
        {
            "user_id": user_id,
            "job_title": req.role,
            "company": req.salary,
            "location": req.location
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Job Alert Created Successfully"
    }


class DeleteAlertRequest(BaseModel):
    id: int


@router.post("/delete")
def delete_alert(req: DeleteAlertRequest):

    db = SessionLocal()

    db.execute(
        text("""
            DELETE FROM job_alerts
            WHERE id = :id
        """),
        {"id": req.id}
    )

    db.commit()
    db.close()

    return {
        "message": "Alert Deleted Successfully"
    }