from sqlalchemy import Column, Integer, ForeignKey, DateTime, Index
from sqlalchemy.sql import func
from ..db import Base

class UserAnswer(Base):
    __tablename__ = "user_answer"
    user_answer_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quiz.quiz_id"), nullable=False)
    choice_id = Column(Integer, ForeignKey("choice.choice_id"), nullable=False)
    answered_at = Column(DateTime, nullable=False, server_default=func.now())
    attempt_no = Column(Integer, nullable=False, default=0)

Index("idx_user_answer_user_quiz", UserAnswer.user_id, UserAnswer.quiz_id)