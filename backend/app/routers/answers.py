from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.choice import Choice
from ..models.quiz import Quiz
from ..models.user_answer import UserAnswer
from ..models.user_stats import UserStats
from ..schemas.answer import AnswerIn, AnswerResultOut
from ..core.security import get_current_user
from ..services.stats import apply_answer_to_stats
from ..services.llm import build_explanation

router = APIRouter()

@router.post("", response_model=AnswerResultOut)
def submit_answer(payload: AnswerIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
    quiz = db.query(Quiz).filter(Quiz.quiz_id == payload.quiz_id).first()
    if not quiz: raise HTTPException(404, "퀴즈 없음")

    choice = db.query(Choice).filter(Choice.choice_id == payload.choice_id, Choice.quiz_id == payload.quiz_id).first()
    if not choice: raise HTTPException(400, "해당 퀴즈의 보기 아님")

    # 정답 choice_id 찾기
    correct_choice = db.query(Choice).filter(Choice.quiz_id == payload.quiz_id, Choice.is_correct == True).first()
    if not correct_choice: raise HTTPException(500, "정답이 없는 퀴즈")

    correct = (choice.choice_id == correct_choice.choice_id)

    ua = UserAnswer(
        user_id=user.user_id,
        quiz_id=payload.quiz_id,
        choice_id=payload.choice_id,
        attempt_no=payload.attempt_no or 0
    )
    db.add(ua)

    # 통계 반영
    apply_answer_to_stats(db, user_id=user.user_id, correct=correct)

    db.commit()

    explanation = None
    if not correct:
        # 오답 해설 (LLM 없으면 간단 규칙 기반 설명)
        explanation = build_explanation(db, quiz_id=payload.quiz_id, user_choice_id=payload.choice_id, correct_choice_id=correct_choice.choice_id)

    return AnswerResultOut(correct=correct, correct_choice_id=correct_choice.choice_id, explanation=explanation)
