from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text

from database import SessionLocal
from services.jobs.search_engine import JobSearchEngine

router = APIRouter()

engine = JobSearchEngine()


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class JobRequest(BaseModel):
    title: str
    company: str
    location: str
    skills: str
    apply_url: str


class SearchRequest(BaseModel):

    keyword: str = ""

    location: str = ""

    experience: str = ""

    employment_type: str = ""

    company: str = ""

    remote: Optional[bool] = None

    page: int = Field(
        default=1,
        ge=1
    )

    limit: int = Field(
        default=20,
        ge=1,
        le=100
    )


# --------------------------------------------------
# Response Model
# --------------------------------------------------

class SearchResponse(BaseModel):

    success: bool

    jobs: List[Dict[str, Any]]

    page: int

    total: int

    pages: int


# --------------------------------------------------
# Search Jobs
# --------------------------------------------------

@router.post(
    "/search",
    response_model=SearchResponse
)
async def search_jobs(req: SearchRequest):

    try:

        return await engine.search(

            keyword=req.keyword,

            location=req.location,

            experience=req.experience,

            employment_type=req.employment_type,

            remote=req.remote,

            company=req.company,

            page=req.page,

            limit=req.limit,

        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# --------------------------------------------------
# Add Job
# --------------------------------------------------

@router.post("/add")
def add_job(req: JobRequest):

    db = SessionLocal()

    try:

        existing = db.execute(

            text("""

                SELECT id

                FROM jobs

                WHERE apply_url = :apply_url

                LIMIT 1

            """),

            {

                "apply_url": req.apply_url

            }

        ).fetchone()

        if existing:

            return {

                "id": existing[0],

                "message": "Job already exists"

            }

        result = db.execute(

            text("""

                INSERT INTO jobs

                (

                    title,

                    company,

                    location,

                    skills,

                    apply_url

                )

                VALUES

                (

                    :title,

                    :company,

                    :location,

                    :skills,

                    :apply_url

                )

                RETURNING id

            """),

            {

                "title": req.title,

                "company": req.company,

                "location": req.location,

                "skills": req.skills,

                "apply_url": req.apply_url

            }

        )

        job_id = result.scalar()

        db.commit()

        return {

            "id": job_id,

            "message": "Job added successfully"

        }

    except Exception as e:

        db.rollback()

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )

    finally:

        db.close()


# --------------------------------------------------
# List Saved Jobs
# --------------------------------------------------

@router.get("/list")
def list_jobs():

    db = SessionLocal()

    try:

        result = db.execute(

            text("""

                SELECT

                    id,

                    title,

                    company,

                    location,

                    skills,

                    apply_url

                FROM jobs

                ORDER BY id DESC

            """)

        )

        rows = result.fetchall()

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

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )

    finally:

        db.close()