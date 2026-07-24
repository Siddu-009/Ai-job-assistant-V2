from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import text

from database import SessionLocal
from services.token_service import decode_token

router = APIRouter()

class MarkReadRequest(BaseModel):
    token: str

class ReadNotificationRequest(BaseModel):
    token: str
    notification_id: int

class NotificationRequest(BaseModel):
    token: str


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
                    link,
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
                    "id":row[0],
                    "title":row[1],
                    "message":row[2],
                    "type":row[3],
                    "link":row[4],
                    "is_read":row[5],
                    "created_at":str(row[6])
                }
                for row in notifications
            ]
        }

    finally:
        db.close()


@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, req: MarkReadRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                UPDATE notifications
                SET is_read = TRUE
                WHERE id=:id
                AND user_id=:user_id
            """),
            {
                "id": notification_id,
                "user_id": user_id
            }
        )

        db.commit()

        return {
            "success": result.rowcount > 0
        }

    finally:

        db.close()

class DeleteNotificationRequest(BaseModel):
    token: str


@router.delete("/{notification_id}")
def delete_notification(notification_id: int, req: DeleteNotificationRequest):

    payload = decode_token(req.token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload["user_id"]

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                DELETE
                FROM notifications
                WHERE id=:id
                AND user_id=:user_id
            """),
            {
                "id": notification_id,
                "user_id": user_id
            }
        )

        db.commit()

        return {
            "success": result.rowcount > 0
        }

    finally:

        db.close()