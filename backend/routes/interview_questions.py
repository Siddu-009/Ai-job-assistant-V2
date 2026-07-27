from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import ai_chat
from services.notification_service import create_notification
from services.token_service import decode_token


router = APIRouter()

class InterviewRequest(BaseModel):
    token: str
    role: str
    experience: str

@router.post("/")
def interview_questions(req: InterviewRequest):

    payload = decode_token(req.token)

    if not payload:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]

    prompt = f"""
You are an expert technical interviewer.

Generate a complete interview preparation guide.

Candidate Details:

Role: {req.role}
Experience: {req.experience}

Customize the interview questions according to the candidate's experience level.

Include:

1. 10 HR Questions
2. 15 Technical Questions
3. 10 Scenario-Based Questions
4. 5 Coding Questions (if applicable)
5. 5 Practical / Real-Time Questions
6. Common Interview Mistakes
7. Tips to Crack the Interview
8. Important Topics to Revise
9. Expected Salary Discussion Questions
10. Final Interview Preparation Checklist

If the candidate is:
- Fresher → Focus on fundamentals, projects, internships, and basic coding.
- 1–3 Years → Focus on implementation, debugging, troubleshooting, and real project experience.
- 3–5 Years → Focus on system design, optimization, architecture, leadership, and production issues.
- 5+ Years → Focus on advanced architecture, team management, scalability, security, and decision-making.

Return the response in clean Markdown format with headings and bullet points.
"""

    response = ai_chat(prompt)

    create_notification(
        user_id=user_id,
        title="🎤 Interview Questions Ready",
        message="Your interview questions have been generated successfully.",
        notification_type="interview",
        link="/interview-questions"
    )

    return {
        "questions": response
    }
