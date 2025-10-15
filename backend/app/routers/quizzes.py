# app/routers/quizzes.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
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

@router.get("/random/", response_model=QuizOut)
def get_random_quiz(
    category_id: Optional[int] = None,                  # ✅ 쿼리 파라미터 받기
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    base_q = db.query(Quiz)

    # ✅ 카테고리 필터 (필요하면 하위 카테고리 포함 로직 추가)
    if category_id is not None:
        base_q = base_q.filter(Quiz.category_id == category_id)

    # DB별 랜덤
    dialect = db.bind.dialect.name
    if dialect == "mysql":
        q = base_q.order_by(func.rand()).first()
    elif dialect in ("sqlite", "postgresql"):
        q = base_q.order_by(func.random()).first()
    else:
        quizzes = base_q.all()
        q = random.choice(quizzes) if quizzes else None

    if not q:
        # ✅ 해당 카테고리에 퀴즈가 없으면 404로 명확히 응답
        raise HTTPException(status_code=404, detail="No quiz in this category")

    image = db.query(Image).filter(Image.image_id == q.image_id).first()
    choices = db.query(Choice).filter(Choice.quiz_id == q.quiz_id).all()

    return {
        "quiz_id": q.quiz_id,
        "quiz_title": q.quiz_title,
        "image_url": image.image_url if image else "",
        "choices": [{"choice_id": c.choice_id, "content": c.content} for c in choices],
    }
