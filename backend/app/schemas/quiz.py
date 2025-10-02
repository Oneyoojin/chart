from pydantic import BaseModel
from typing import List

class ChoiceOut(BaseModel):
    choice_id: int
    content: str

class QuizOut(BaseModel):
    quiz_id: int
    quiz_title: str
    image_url: str
    choices: List[ChoiceOut]
    class Config: orm_mode = True

class QuizCreateIn(BaseModel):
    quiz_title: str
    category_id: int
    image_url: str
    choices: list[dict]