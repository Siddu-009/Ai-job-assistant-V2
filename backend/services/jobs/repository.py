from sqlalchemy.orm import Session

from models.job import Job as JobModel
from services.jobs.models import Job


class JobRepository:

    @staticmethod
    def save_jobs(db: Session, jobs: list[Job]):

        for job in jobs:

            existing = (
                db.query(JobModel)
                .filter(
                    JobModel.provider_job_id == job.id,
                    JobModel.source == job.source,
                )
                .first()
            )

            if existing:
                continue

            db.add(
                JobModel(
                    provider_job_id=job.id,
                    title=job.title,
                    company=job.company,
                    location=job.location,
                    description=job.description,
                    apply_url=job.apply_url,
                    source=job.source,
                    salary=job.salary,
                    experience=job.experience,
                    employment_type=job.employment_type,
                    remote=job.remote,
                    country=job.country,
                    posted_date=job.posted_date,
                    company_logo=job.company_logo,
                    company_url=job.company_url,
                    skills=job.skills
                )
            )

        db.commit()

    @staticmethod
    def get_all_jobs(db: Session):

        return db.query(JobModel).all()

    @staticmethod
    def clear_old_jobs(db: Session):
        pass