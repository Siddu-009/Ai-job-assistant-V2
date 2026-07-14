from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()


class NotificationRequest(BaseModel):
    token: str


class ReadNotificationRequest(BaseModel):
    token: str
    notification_id: int


@router.post("/")
def get_notifications(req: NotificationRequest):

    payload = decode_token(req.token)

    if not payload:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        notifications = db.execute(
            text("""
                SELECT
                    id,
                    title,
                    message,
                    type,
                    is_read,
                    created_at
                FROM notifications
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """),
            {
                "user_id": user_id
            }
        ).fetchall()

        return {
            "success": True,
            "notifications": [
                {
                    "id": row[0],
                    "title": row[1],
                    "message": row[2],
                    "type": row[3],
                    "is_read": row[4],
                    "created_at": str(row[5])
                }
                for row in notifications
            ]
        }

    finally:
        db.close()


@router.put("/read")
def mark_as_read(req: ReadNotificationRequest):

    payload = decode_token(req.token)

    if not payload:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    db = SessionLocal()

    try:

        db.execute(
            text("""
                UPDATE notifications
                SET is_read = TRUE
                WHERE id = :id
            """),
            {
                "id": req.notification_id
            }
        )

        db.commit()

        return {
            "success": True,
            "message": "Notification marked as read."
        }

    finally:
        db.close()