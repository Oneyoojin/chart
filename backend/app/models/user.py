from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..db import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    user_password = Column(String(255), nullable=False)  # 해시 저장
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    role = Column(String, nullable=False, server_default="user")

    quizzes = relationship("Quiz", back_populates="user")
