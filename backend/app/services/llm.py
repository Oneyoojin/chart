from sqlalchemy.orm import Session
from ..models.choice import Choice
from ..models.quiz import Quiz
from ..core.config import settings
import httpx

def build_explanation(db: Session, quiz_id: int, user_choice_id: int, correct_choice_id: int) -> str:
    # 최소 fallback
    user_choice = db.query(Choice).get(user_choice_id)
    correct_choice = db.query(Choice).get(correct_choice_id)
    quiz = db.query(Quiz).get(quiz_id)

    base = f"정답은 '{correct_choice.content}'입니다. 선택하신 '{user_choice.content}'와 비교해 보세요. "
    if not settings.OPENAI_API_KEY:
        return base
    
    prompt = f"""다음 의료 퀴즈에서 사용자가 오답을 선택했습니다.
문제: {quiz.quiz_title}
사용자 선택: {user_choice.content}
정답: {correct_choice.content}
소아 복부 X-ray 관점에서 두 선택지의 감별 포인트를 3~5문장으로 간결히 설명해 주세요.
"""

    try:
        headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role":"user","content":prompt}],
            "temperature": 0.3,
        }
        r = httpx.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=20)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return base