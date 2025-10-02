from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.user import User
from ..schemas.auth import RegisterIn, LoginIn, UserOut, TokenOut
from ..core.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "이미 존재하는 이메일입니다.")
    # ✅ 요청은 password, DB는 user_password
    u = User(
        email=payload.email,
        nickname=payload.nickname,
        user_password=hash_password(payload.password)
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == payload.email).first()
    # ✅ 요청은 password, DB는 user_password
    if not u or not verify_password(payload.password, u.user_password):
        raise HTTPException(401, "이메일 or 비밀번호가 틀립니다.")
    token = create_access_token({"sub": str(u.user_id)})
    return {"access_token": token, "user": u}
