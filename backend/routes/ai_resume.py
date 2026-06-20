from fastapi import APIRouter
from pydantic import BaseModel
from services.ollama_resume import generate_resume

router = APIRouter()

class AIResumeRequest(BaseModel):
    master_resume: str
    job_description: str

@router.post("/")
def ai_resume(req: AIResumeRequest):
    optimized_resume = generate_resume(
        req.master_resume,
        req.job_description
    )

    return {
        "optimized_resume": optimized_resume
    }
