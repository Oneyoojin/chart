# app/models/quiz.py
from sqlalchemy import Column, Integer, ForeignKey, Text, String, DateTime, func
from sqlalchemy.orm import relationship
from ..db import Base

class Quiz(Base):
    __tablename__ = "quiz"
    quiz_id = Column(Integer, primary_key=True, index=True)
    quiz_title = Column(String(255), nullable=False)
    quiz_creat_at = Column(DateTime, nullable=False, server_default=func.now())
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"), nullable=False)
    image_id = Column(Integer, ForeignKey("image.image_id"), nullable=False)

    # 문자열 이름 사용 가능 (단, 해당 클래스가 앱 시작 시 import 되어 있어야 함)
    user = relationship("User", back_populates="quizzes")
    category = relationship("Category", back_populates="quizzes")
    image = relationship("Image", back_populates="quizzes")
    choices = relationship("Choice", back_populates="quiz", cascade="all, delete-orphan")
