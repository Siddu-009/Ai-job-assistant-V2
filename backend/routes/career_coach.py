from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_service import ai_chat

router = APIRouter()


class CoachRequest(BaseModel):
    question: str


@router.post("/")
def career_coach(req: CoachRequest):

    prompt = f"""
You are an experienced career coach.

Answer the user's question professionally.

User Question:

{req.question}

Provide:

- Clear explanation
- Step-by-step guidance
- Interview tips (if applicable)
- Certifications (if applicable)
- Career advice

Keep the answer easy to understand.
"""

    answer = ai_chat(prompt)

    return {
        "answer": answer
    }
