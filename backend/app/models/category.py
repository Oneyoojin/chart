from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class Category(Base):
    __tablename__ = "category"
    category_id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey("category.category_id"), nullable=True)
    category_name = Column(String(255), nullable=False)

    parent = relationship("Category", remote_side=[category_id], backref="children")
    quizzes = relationship("Quiz", back_populates="category")