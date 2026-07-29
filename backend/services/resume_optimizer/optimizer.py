from services.ai_service import ai_chat

from .prompts import OPTIMIZE_RESUME_PROMPT


def optimize_resume(resume_json):

    prompt = f"""
{OPTIMIZE_RESUME_PROMPT}

Resume:

{resume_json}
"""

    response = ai_chat(prompt)

    return response