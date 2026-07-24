from sqlalchemy import text
from database import SessionLocal


def create_notification(
    user_id,
    title,
    message,
    notification_type,
    link
):

    db = SessionLocal()

    try:

        db.execute(
            text("""
                INSERT INTO notifications
                (
                user_id,
                title,
                message,
                type,
                link
                )
                VALUES
                (
                :user_id,
                :title,
                :message,
                :type,
                :link
                )
            """),
            {
                "user_id": user_id,
                "title": title,
                "message": message,
                "type": notification_type,
                "link": link
            }
        )

        db.commit()

        return True

    except Exception as e:

        db.rollback()

        print("Notification Error:", e)

        return False

    finally:

        db.close()