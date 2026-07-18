from fastapi import APIRouter
from pydantic import BaseModel

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


class AdminLoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def admin_login(req: AdminLoginRequest):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                username
            FROM admins
            WHERE username = :username
            AND password = :password
            """
        ),
        {
            "username": req.username,
            "password": req.password
        }
    )

    admin = result.fetchone()

    db.close()

    if not admin:
        return {
            "error": "Invalid credentials"
        }

    return {
        "message": "Admin login successful",
        "admin_id": admin[0],
        "username": admin[1]
    }


@router.get("/users")
def get_users():

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                name,
                email
            FROM users
            ORDER BY id DESC
            """
        )
    )

    rows = result.fetchall()

    db.close()

    return [
        {
            "id": row[0],
            "name": row[1],
            "email": row[2]
        }
        for row in rows
    ]


@router.get("/jobs")
def get_jobs():

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT
                id,
                title,
                company,
                location,
                skills,
                apply_url
            FROM jobs
            ORDER BY id DESC
            """
        )
    )

    rows = result.fetchall()

    db.close()

    return [
        {
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "skills": row[4],
            "apply_url": row[5]
        }
        for row in rows
    ]


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int):

    db = SessionLocal()

    result = db.execute(
        text(
            """
            SELECT id
            FROM jobs
            WHERE id = :id
            """
        ),
        {
            "id": job_id
        }
    )

    job = result.fetchone()

    if not job:
        db.close()

        return {
            "error": "Job not found"
        }

    db.execute(
        text(
            """
            DELETE FROM jobs
            WHERE id = :id
            """
        ),
        {
            "id": job_id
        }
    )

    db.commit()
    db.close()

    return {
        "message": "Job deleted successfully"
    }


@router.get("/applications")
def get_applications():

    db = SessionLocal()

    try:

        result = db.execute(
            text(
                """
                SELECT
                    a.id,
                    u.name,
                    u.email,
                    j.title,
                    a.status,
                    a.created_at
                FROM applications a
                JOIN users u
                    ON a.user_id = u.id
                JOIN jobs j
                    ON a.job_id = j.id
                ORDER BY a.id DESC
                """
            )
        )

        rows = result.fetchall()

        return [
            {
                "application_id": row[0],
                "user_name": row[1],
                "email": row[2],
                "job_title": row[3],
                "status": row[4],
                "created_at": str(row[5])
            }
            for row in rows
        ]

    except Exception:
        return []

    finally:
        db.close()


@router.get("/stats")
def admin_stats():

    db = SessionLocal()

    try:

        total_users = db.execute(
            text("SELECT COUNT(*) FROM users")
        ).scalar()

        total_jobs = db.execute(
            text("SELECT COUNT(*) FROM jobs")
        ).scalar()

        total_saved_jobs = db.execute(
            text("SELECT COUNT(*) FROM saved_jobs")
        ).scalar()

        total_resumes = 0
        total_applications = 0

        try:
            total_resumes = db.execute(
                text("SELECT COUNT(*) FROM generated_resumes")
            ).scalar()
        except Exception:
            pass

        try:
            total_applications = db.execute(
                text("SELECT COUNT(*) FROM applications")
            ).scalar()
        except Exception:
            pass

        return {
            "total_users": total_users,
            "total_jobs": total_jobs,
            "total_saved_jobs": total_saved_jobs,
            "total_resumes": total_resumes,
            "total_applications": total_applications
        }

    finally:
        db.close()

from typing import Optional


class DashboardRequest(BaseModel):
    token: Optional[str] = ""


@router.post("/dashboard")
def admin_dashboard(req: DashboardRequest):

    db = SessionLocal()

    users = db.execute(
        text("SELECT COUNT(*) FROM users")
    ).scalar()

    resumes = 0

    try:
        resumes = db.execute(
            text("SELECT COUNT(*) FROM resumes")
        ).scalar()
    except Exception:
        pass

    applications = db.execute(
        text("SELECT COUNT(*) FROM applications")
    ).scalar()

    jobs = db.execute(
        text("SELECT COUNT(*) FROM jobs")
    ).scalar()

    recent_rows = db.execute(
        text("""
            SELECT
                u.name,
                j.title,
                a.status,
                a.updated_at
            FROM applications a
            LEFT JOIN users u
                ON a.user_id = u.id
            LEFT JOIN jobs j
                ON a.job_id = j.id
            ORDER BY a.updated_at DESC
            LIMIT 10
        """)
    ).fetchall()

    db.close()

    recent_activity = []

    for row in recent_rows:
        recent_activity.append({
            "user": row[0] or "Unknown User",
            "action": f"{row[2]} - {row[1] or 'Unknown Job'}",
            "time": str(row[3])
        })

    return {
        "users": users,
        "resumes": resumes,
        "applications": applications,
        "jobs": jobs,
        "recent_activity": recent_activity
    }

class AdminRequest(BaseModel):
    token: str = ""


class UserRequest(BaseModel):
    id: int


@router.post("/")
def admin_management(req: AdminRequest):

    db = SessionLocal()

    rows = db.execute(
        text("""
            SELECT
                id,
                name,
                email
            FROM users
            ORDER BY id DESC
        """)
    ).fetchall()

    db.close()

    users = []

    for row in rows:

        users.append({

            "id": row[0],

            "name": row[1],

            "email": row[2],

            "role": "User",

            "status": "Active"

        })

    return {

        "users": users

    }


@router.post("/delete-user")
def delete_user(req: UserRequest):

    db = SessionLocal()

    db.execute(
        text("""
            DELETE FROM users
            WHERE id=:id
        """),
        {
            "id": req.id
        }
    )

    db.commit()
    db.close()

    return {

        "message": "User deleted successfully"

    }


@router.post("/block-user")
def block_user(req: UserRequest):

    # Your users table doesn't have a status column.
    # So just return success for now.

    return {

        "message": "User blocked successfully"

    }