from services.ai_service import ai_chat

from .prompts import INTERVIEW_PROMPT


def generate_questions(resume_json, job_description=""):

    prompt = f"""
{INTERVIEW_PROMPT}

Resume:

{resume_json}

Job Description:

{job_description}
"""

    return ai_chat(prompt)