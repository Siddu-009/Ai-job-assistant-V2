from fastapi import APIRouter

from database import SessionLocal
from sqlalchemy import text

router = APIRouter()


@router.get("/")
def top_skills():

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT skills
        FROM resumes
        """)
    )

    rows = result.fetchall()

    db.close()

    skill_count = {}

    for row in rows:

        if not row[0]:
            continue

        for skill in row[0].split(","):

            skill = skill.strip()

            if skill not in skill_count:
                skill_count[skill] = 0

            skill_count[skill] += 1

    ranked = sorted(
        skill_count.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked[:20]
