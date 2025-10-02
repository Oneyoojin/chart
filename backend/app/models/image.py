from sqlalchemy import Column, Integer, String
from ..db import Base
from sqlalchemy.orm import relationship

class Image(Base):
    __tablename__ = "image"
    image_id = Column(Integer, primary_key=True)
    image_url = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)

    quizzes = relationship("Quiz", back_populates="image")