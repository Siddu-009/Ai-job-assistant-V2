from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func

from database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    title = Column(String(255), nullable=False)

    message = Column(Text, nullable=False)

    type = Column(String(50), default="info")

    link = Column(Text, nullable=True)

    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
