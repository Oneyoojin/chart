from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, date
from ..db import get_db
from ..models.user import User
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

@router.get("/daily")
def stats_daily(days: int = 7,
                db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    """
    최근 N일 동안의 풀이 개수. 가장 오른쪽이 최신 날짜가 되도록 '오름차순'으로 반환.
    """
    if days < 1 or days > 60:
        days = 7

    end = date.today()              # 오늘
    start = end - timedelta(days=days-1)

    rows = (
        db.query(func.date(UserAnswer.answered_at).label("d"),
                 func.count().label("cnt"))
          .filter(UserAnswer.user_id == user.user_id,
                  UserAnswer.answered_at >= start,
                  UserAnswer.answered_at <  end + timedelta(days=1))
          .group_by("d")
          .order_by("d")
          .all()
    )
    by_day = {r.d: r.cnt for r in rows}

    labels, data = [], []
    for i in range(days):
        d = start + timedelta(days=i)
        labels.append(d.isoformat())     # 'YYYY-MM-DD'
        data.append(int(by_day.get(d, 0)))

    return {"labels": labels, "data": data}


@router.get("/distribution")
def stats_distribution(category_id: int | None = None,
                       db: Session = Depends(get_db),
                       user: User = Depends(get_current_user)):
    """
    카테고리(옵션)별 '문제 정답 라벨' 분포.
    사용자가 푼 문제들 중 각 문제의 정답(choice.is_correct=1)의 content 기준으로 집계.
    - category_id가 없으면 전체.
    """
    q = (db.query(Choice.content.label("label"), func.count().label("cnt"))
            .join(Quiz, Quiz.quiz_id == Choice.quiz_id)
            .join(UserAnswer, UserAnswer.quiz_id == Quiz.quiz_id)
            .filter(UserAnswer.user_id == user.user_id,
                    Choice.is_correct == True))

    if category_id:
        q = q.filter(Quiz.category_id == category_id)

    rows = q.group_by("label").order_by(func.count().desc()).all()
    return {"labels": [r.label for r in rows],
            "data":   [int(r.cnt) for r in rows]}