from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import ai_chat

router = APIRouter()


class LearningRequest(BaseModel):
    role: str


@router.post("/")
def learning_recommendations(req: LearningRequest):

    prompt = f"""
You are an expert career mentor.

Prepare a complete learning roadmap for becoming a:

{req.role}

Include:

1. Skills to learn
2. Learning order
3. Best free resources
4. Certifications
5. Projects
6. Interview preparation
7. Estimated timeline

Return a well-formatted response.
"""

    roadmap = ai_chat(prompt)

    return {
        "roadmap": roadmap
    }
