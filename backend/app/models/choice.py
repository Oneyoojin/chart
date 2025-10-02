from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..db import Base

class Choice(Base):
    __tablename__ = "choice"
    choice_id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quiz.quiz_id"), nullable=False)
    content = Column(String(255), nullable=False)
    is_correct = Column(Boolean, nullable=False)

    quiz = relationship("Quiz", back_populates="choices")