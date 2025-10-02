from pydantic import BaseModel

class AnswerIn(BaseModel):
    quiz_id: int
    choice_id: int
    attempt_no: int | None=0

class AnswerResultOut(BaseModel):
    correct: bool
    correct_choice_id: int
    explanation: str | None=None