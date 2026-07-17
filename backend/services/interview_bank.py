import json
import re

from services.ai_service import ai_chat


def get_question(role, experience, difficulty, asked_questions=None):

    if asked_questions is None:
        asked_questions = []

    prompt = f"""
You are an expert technical interviewer.

Generate EXACTLY ONE interview question.

Role:
{role}

Experience:
{experience}

Difficulty:
{difficulty}

Already asked questions:
{asked_questions}

Rules:

1. Do NOT repeat previous questions.
2. Make the question specific to the selected role.
3. Difficulty must match.
4. Return ONLY JSON.
5. No explanation.

Format:

{{
    "id": 1,
    "question": "..."
}}
"""

    response = ai_chat(prompt)

    try:

        match = re.search(r"\{.*\}", response, re.S)

        if match:

            return json.loads(match.group())

    except Exception:

        pass

    return {
        "id": 1,
        "question": f"Explain the fundamentals of {role}."
    }