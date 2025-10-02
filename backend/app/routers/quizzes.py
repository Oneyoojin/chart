from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import random
from ..db import get_db
from ..models.quiz import Quiz
from ..models.choice import Choice
from ..models.image import Image
from ..core.security import get_current_user
from ..models.user import User
from ..schemas.quiz import QuizOut

router = APIRouter()

@router.get("/random", response_model=QuizOut)
def get_random_quiz(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    dialect = db.bind.dialect.name  # 'mysql' | 'sqlite' | 'postgresql' 등

    if dialect == "mysql":
        # MySQL: RAND()
        q = db.query(Quiz).order_by(func.rand()).first()
    elif dialect in ("sqlite", "postgresql"):
        # SQLite/PostgreSQL: random()
        q = db.query(Quiz).order_by(func.random()).first()
    else:
        # 기타 드라이버: 파이썬에서 샘플링
        quizzes = db.query(Quiz).all()
        q = random.choice(quizzes) if quizzes else None

    if not q:
        raise HTTPException(404, "문제가 없습니다.")

    image = db.query(Image).filter(Image.image_id == q.image_id).first()
    choices = db.query(Choice).filter(Choice.quiz_id == q.quiz_id).all()

    return {
        "quiz_id": q.quiz_id,
        "quiz_title": q.quiz_title,
        "image_url": image.image_url if image else "",
        "choices": [{"choice_id": c.choice_id, "content": c.content} for c in choices]
    }
