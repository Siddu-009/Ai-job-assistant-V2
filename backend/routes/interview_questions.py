from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import ai_chat

router = APIRouter()


class InterviewRequest(BaseModel):
    role: str
    experience: str = "Fresher"


@router.post("/")
def interview_questions(req: InterviewRequest):

    prompt = f"""
You are an expert technical interviewer.

Generate interview questions for:

Role:
{req.role}

Experience:
{req.experience}

Return:

1. 10 HR Questions
2. 15 Technical Questions
3. 10 Scenario-based Questions
4. 5 Coding Questions (if applicable)
5. 5 Practical/Real-world Questions
6. Tips to crack the interview

Format everything neatly.
"""

    response = ai_chat(prompt)

    return {
        "questions": response
    }
