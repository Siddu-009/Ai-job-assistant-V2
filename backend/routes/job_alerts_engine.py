from fastapi import APIRouter
from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.post("/{resume_id}")
def generate_alerts(resume_id: int):

    db = SessionLocal()

    resume = db.execute(
        text("""
        SELECT skills
        FROM resumes
        WHERE id=:id
        """),
        {"id": resume_id}
    ).fetchone()

    if not resume:
        db.close()
        return {"error": "Resume not found"}

    resume_skills = set(
        skill.strip().lower()
        for skill in resume[0].split(",")
    )

    jobs = db.execute(
        text("""
        SELECT
            id,
            skills
        FROM jobs
        """)
    ).fetchall()

    alerts = []

    for job in jobs:

        job_skills = set(
            skill.strip().lower()
            for skill in job[1].split(",")
        )

        matched = resume_skills.intersection(job_skills)

        percentage = int(
            (len(matched) / len(job_skills)) * 100
        ) if job_skills else 0

        if percentage >= 60:

            db.execute(
                text("""
                INSERT INTO job_alerts
                (
                    resume_id,
                    job_id,
                    match_percentage
                )
                VALUES
                (
                    :resume_id,
                    :job_id,
                    :match_percentage
                )
                """),
                {
                    "resume_id": resume_id,
                    "job_id": job[0],
                    "match_percentage": percentage
                }
            )

            alerts.append({
                "job_id": job[0],
                "match_percentage": percentage
            })

    db.commit()
    db.close()

    return alerts
@router.get("/{resume_id}")
def get_alerts(resume_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            id,
            job_id,
            match_percentage,
            created_at
        FROM job_alerts
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
            "job_id": row[1],
            "match_percentage": row[2],
            "created_at": str(row[3])
        })

    return data
