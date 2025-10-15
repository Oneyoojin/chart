from pydantic import BaseModel
from typing import Optional

class CategoryOut(BaseModel):
    category_id: int
    parent_id: Optional[int] = None
    category_name: str

    class Config:
        orm_mode = True
