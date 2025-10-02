from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from ..db import Base

class UserStats(Base):
    __tablename__ = "user_stats"
    user_id = Column(Integer, primary_key=True)
    total_answered = Column(Integer, nullable=False, default=0)
    correct_count = Column(Integer, nullable=False, default=0)
    accuracy = Column(Float, nullable=False, default=0)
    last_updated = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())