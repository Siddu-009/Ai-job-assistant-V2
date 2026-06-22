from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


class VersionRequest(BaseModel):
    resume_id: int
    version_name: str
    resume_text: str


@router.post("/")
def save_version(req: VersionRequest):

    db = SessionLocal()

    db.execute(
        text("""
        INSERT INTO resume_versions
        (
            resume_id,
            version_name,
            resume_text
        )
        VALUES
        (
            :resume_id,
            :version_name,
            :resume_text
        )
        """),
        {
            "resume_id": req.resume_id,
            "version_name": req.version_name,
            "resume_text": req.resume_text
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Version saved"
    }


@router.get("/{resume_id}")
def get_versions(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            version_name,
            created_at
        FROM resume_versions
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
            "version_name": row[1],
            "created_at": str(row[2])
        })

    return data
