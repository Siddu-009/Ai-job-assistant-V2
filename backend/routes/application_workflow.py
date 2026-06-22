from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


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
        "message": "Application updated"
    }


@router.get("/list")
def workflow_list():

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            resume_id,
            job_id,
            status,
            remarks,
            applied_at,
            updated_at
        FROM applications
        ORDER BY id DESC
        """)
    )

    rows = result.fetchall()

    db.close()

    data = []

    for row in rows:
        data.append({
            "application_id": row[0],
            "resume_id": row[1],
            "job_id": row[2],
            "status": row[3],
            "remarks": row[4],
            "applied_at": str(row[5]),
            "updated_at": str(row[6])
        })

    return data
