from fastapi import APIRouter
from pydantic import BaseModel

from services.email_service import send_email

router = APIRouter()


class EmailRequest(BaseModel):
    email: str
    subject: str
    message: str


@router.post("/")
async def send_notification(req: EmailRequest):

    await send_email(
        req.email,
        req.subject,
        req.message
    )

    return {
        "message": "Email sent successfully"
    }
