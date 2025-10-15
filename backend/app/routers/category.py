from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.category import Category
from ..schemas.category import CategoryOut

router = APIRouter()

@router.get("", response_model=List[CategoryOut])
def list_categories(
    parent_id: Optional[int] = Query(None, description="부모 카테고리 ID(없으면 전체)"),
    db: Session = Depends(get_db),
):
    q = db.query(Category)
    if parent_id is None:
        return q.all()
    return q.filter(Category.parent_id == parent_id).all()

# 루트 카테고리만
@router.get("/roots", response_model=List[CategoryOut])
def list_root_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.parent_id.is_(None)).all()

# 자식 카테고리
@router.get("/{category_id}/children", response_model=List[CategoryOut])
def list_children(category_id: int, db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.parent_id == category_id).all()

