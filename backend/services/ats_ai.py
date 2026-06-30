import json
import re

from services.ai_service import ai_chat


def extract_requirements(job_description: str):

    prompt = f"""
You are an Applicant Tracking System (ATS).

Extract ONLY the hiring requirements from the Job Description.

Rules:

1. Extract only:
   - Technical Skills
   - Programming Languages
   - Tools
   - Frameworks
   - Libraries
   - Certifications
   - Education
   - Experience

2. Ignore:
   - Company description
   - Responsibilities
   - Generic sentences
   - "Good to have"
   - "Nice to have"
   - "High performance"
   - "Agile"
   - "Business needs"

3. Return ONLY valid JSON.

Format:

{{
    "skills": [],
    "tools": [],
    "frameworks": [],
    "certifications": [],
    "education": [],
    "experience": []
}}

Job Description:

{job_description}
"""

    response = ai_chat(prompt)

    try:

        match = re.search(r"\{.*\}", response, re.S)

        if match:
            return json.loads(match.group())

    except Exception:
        pass

    return {
        "skills": [],
        "tools": [],
        "frameworks": [],
        "certifications": [],
        "education": [],
        "experience": []
    }
