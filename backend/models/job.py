from sqlalchemy import Boolean, Column, Integer, String, Text
from database import Base
from sqlalchemy.dialects.postgresql import ARRAY


class Job(Base):

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    provider_job_id = Column(String, index=True)

    title = Column(String, index=True)

    company = Column(String)

    location = Column(String)

    description = Column(Text)

    employment_type = Column(String)

    salary = Column(String)

    experience = Column(String)

    source = Column(String)

    apply_url = Column(String)

    remote = Column(Boolean, default=False)

    posted_date = Column(String)

    company_logo = Column(String)

    company_url = Column(String)

    country = Column(String)

    skills = Column(ARRAY(String))