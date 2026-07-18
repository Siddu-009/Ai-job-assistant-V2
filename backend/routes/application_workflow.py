from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()


class WorkflowRequest(BaseModel):
    token: str


@router.post("/")
def workflow(req: WorkflowRequest):

    payload = decode_token(req.token)

    if not payload:
        return {"workflow": []}

    user_id = payload["user_id"]

    db = SessionLocal()

    rows = db.execute(
        text("""
            SELECT
                a.id,
                j.title,
                j.company,
                a.status,
                a.remarks,
                a.applied_at,
                a.updated_at
            FROM applications a
            LEFT JOIN jobs j
                ON a.job_id = j.id
            WHERE a.user_id = :user_id
            ORDER BY a.id DESC
        """),
        {
            "user_id": user_id
        }
    ).fetchall()

    db.close()

    step_map = {
        "Applied": 0,
        "Resume Shortlisted": 1,
        "Assessment": 2,
        "HR Interview": 3,
        "Technical Interview": 4,
        "Manager Round": 5,
        "Offer Released": 6
    }

    workflow = []

    for row in rows:

        workflow.append({

            "application_id": row[0],

            "title": row[1] or "Unknown Job",

            "company": row[2] or "Unknown Company",

            "status": row[3],

            "remarks": row[4],

            "applied_at": str(row[5]),

            "updated_at": str(row[6]),

            "current_step": step_map.get(row[3], 0)

        })

    return {
        "workflow": workflow
    }


class StatusUpdateRequest(BaseModel):
    application_id: int
    status: str
    remarks: str = ""


@router.post("/update")
def update_status(req: StatusUpdateRequest):

    db = SessionLocal()

    db.execute(
        text("""
            UPDATE applications
            SET
                status = :status,
                remarks = :remarks,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :application_id
        """),
        {
            "status": req.status,
            "remarks": req.remarks,
            "application_id": req.application_id
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Application updated successfully"
    }


@router.get("/list")
def workflow_list():

    db = SessionLocal()

    rows = db.execute(
        text("""
            SELECT
                a.id,
                j.title,
                j.company,
                a.status,
                a.remarks,
                a.applied_at,
                a.updated_at
            FROM applications a
            LEFT JOIN jobs j
                ON a.job_id = j.id
            ORDER BY a.id DESC
        """)
    ).fetchall()

    db.close()

    return [
        {
            "application_id": row[0],
            "title": row[1],
            "company": row[2],
            "status": row[3],
            "remarks": row[4],
            "applied_at": str(row[5]),
            "updated_at": str(row[6])
        }
        for row in rows
    ]