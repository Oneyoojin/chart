from sqlalchemy.orm import Session
from ..models.choice import Choice
from ..models.quiz import Quiz
from ..core.config import settings
import httpx
import logging

logger = logging.getLogger(__name__)

def build_explanation(db: Session, quiz_id: int, user_choice_id: int, correct_choice_id: int) -> str:
    # 최소 fallback
    user_choice = db.query(Choice).get(user_choice_id)
    correct_choice = db.query(Choice).get(correct_choice_id)
    quiz = db.query(Quiz).get(quiz_id)

    base = f"정답은 '{correct_choice.content}'입니다. 선택하신 '{user_choice.content}'와 비교해 보세요. "

    # ✅ 로컬 LLM 사용 여부 확인: OPENAI_API_KEY 대신 LLM 설정으로 판별
    if not getattr(settings, "LLM_BASE_URL", None) or not getattr(settings, "LLM_MODEL", None):
        logger.info("LLM 설정이 없어 fallback 사용 (LLM_BASE_URL/LLM_MODEL 확인).")
        return base

    prompt = f"""다음 의료 퀴즈에서 사용자가 오답을 선택했습니다.
문제: {quiz.quiz_title}
사용자 선택: {user_choice.content}
정답: {correct_choice.content}
소아 복부 X-ray 관점에서 두 선택지의 감별 포인트를 3~5문장으로 간결히 설명해 주세요.
교육 목적의 설명이며, 임상 진단이 아닙니다.
"""

    try:
        headers = {"Authorization": f"Bearer {getattr(settings, 'LLM_API_KEY', 'ollama')}"}
        payload = {
            "model": settings.LLM_MODEL,  # 예: "qwen2.5:7b-instruct" / "qwen2.5:3b-instruct" 앞 모델보다 경량화
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
        }
        # ✅ Ollama OpenAI-호환 엔드포인트
        url = f"{settings.LLM_BASE_URL.rstrip('/')}/chat/completions"

        r = httpx.post(url, headers=headers, json=payload, timeout=120)
        r.raise_for_status()

        data = r.json()
        # OpenAI 호환 형식: choices[0].message.content
        return data["choices"][0]["message"]["content"].strip()

    except httpx.HTTPStatusError as e:
        # 서버는 응답했지만 상태코드가 4xx/5xx
        logger.error("LLM HTTP 오류: %s, body=%s", e, getattr(e.response, "text", ""))
    except httpx.ConnectError as e:
        logger.error("LLM 연결 실패: %s (Ollama 실행/포트 확인)", e)
    except httpx.ReadTimeout as e:
        logger.error("LLM 타임아웃: %s (timeout 늘리기/모델 경량화 고려)", e)
    except Exception as e:
        logger.exception("LLM 예외 발생: %s", e)

    # 어떤 예외든 발생하면 UI는 우선 base를 보여주게 함
    return base
