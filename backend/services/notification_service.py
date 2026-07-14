from sqlalchemy import text
from database import SessionLocal


def create_notification(user_id, title, message, notification_type="info"):

    db = SessionLocal()

    try:

        db.execute(

            text("""
                INSERT INTO notifications
                (
                    user_id,
                    title,
                    message,
                    type
                )
                VALUES
                (
                    :user_id,
                    :title,
                    :message,
                    :type
                )
            """),

            {
                "user_id": user_id,
                "title": title,
                "message": message,
                "type": notification_type
            }

        )

        db.commit()

    finally:

        db.close()