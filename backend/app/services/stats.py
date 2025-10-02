from sqlalchemy.orm import Session
from ..models.user_stats import UserStats

def apply_answer_to_stats(db: Session, user_id:int, correct: bool):
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if not stats:
        stats = UserStats(user_id = user_id, total_answered=0, correct_count=0, accuracy=0.0)
        db.add(stats)
    stats.total_answered += 1
    if correct:
        stats.correct_count += 1
    stats.accuracy = (stats.correct_count / stats.total_answered) if stats.total_answered else 0.0
    # commit은 호출 측에서
