from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db import get_db
from ..core.security import get_current_user
from ..models.user_stats import UserStats
from ..models.user_answer import UserAnswer
from ..models.quiz import Quiz
from ..models.choice import Choice

router = APIRouter()

@router.get("/summary")
def summary(db: Session = Depends(get_db), user=Depends(get_current_user)):
    s = db.query(UserStats).filter(UserStats.user_id == user.user_id).first()
    if not s:
        return {"totalAnswered": 0, "correctCount": 0, "accuracy": 0.0}
    
    return {
        "totalAnswered": s.total_answered,
        "correctCount": s.correct_count,
        "accuracy": s.accuracy
    }

@router.get("/attempts")
def attempts(limit: int = 50, db: Session = Depends(get_db), user=Depends(get_current_user)):
    # 최근 풀이 기록
    q = (
        db.query(UserAnswer, Quiz, Choice)
        .join(Quiz, Quiz.quiz_id == UserAnswer.quiz_id)
        .join(Choice, Choice.choice_id == UserAnswer.choice_id)
        .filter(UserAnswer.user_id == user.user_id)
        .order_by(UserAnswer.answered_at.desc())
        .limit(limit)
        .all()
    )
    result = []
    for ua, quiz, choice in q:
        correct_choice_id = db.query(Choice.choice_id).filter(Choice.quiz_id == quiz.quiz_id, Choice.is_correct == True).first()[0]
        result.append({
            "id": ua.user_answer_id,
            "quiz_id": quiz.quiz_id,
            "quiz_title": quiz.quiz_title,
            "selected": choice.content,
            "correct": choice.choice_id == correct_choice_id,
            "answered_at": ua.answered_at.isoformat(),
        })
    return result