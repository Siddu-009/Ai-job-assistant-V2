from dataclasses import dataclass, field, asdict
from typing import List, Optional


@dataclass
class Job:
    # Required Fields
    id: str
    title: str
    company: str
    location: str
    description: str
    apply_url: str
    source: str

    # Optional Fields
    salary: Optional[str] = "Not Mentioned"
    experience: Optional[str] = ""
    employment_type: Optional[str] = "Full Time"
    remote: bool = False
    country: Optional[str] = ""
    posted_date: Optional[str] = ""
    company_logo: Optional[str] = ""
    company_url: Optional[str] = ""

    # Skills
    skills: List[str] = field(default_factory=list)

    # AI
    ai_score: int = 0
    matched_skills: List[str] = field(default_factory=list)
    missing_skills: List[str] = field(default_factory=list)
    recommendation: str = ""

    def to_dict(self):
        return asdict(self)