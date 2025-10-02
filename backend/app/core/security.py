from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from ..db import get_db
from ..core.config import settings
from ..models.user import User

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(p: str) -> str:
    if not isinstance(p, str):
        raise ValueError("Password must be a string")
    # bcrypt는 72바이트 제한 → 초과 시 안전하게 잘라서 해싱
    b = p.encode("utf-8")[:72]
    p72 = b.decode("utf-8", errors="ignore")
    return pwd_ctx.hash(p72)

def verify_password(plain: str, hashed: str) -> bool:
    if not isinstance(plain, str):
        return False
    b = plain.encode("utf-8")[:72]
    p72 = b.decode("utf-8", errors="ignore")
    return pwd_ctx.verify(p72, hashed)

def create_access_token(payload: dict, minutes: int = settings.ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = payload.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=minutes)})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALG)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    cred_exc = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    try:
        data = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        uid = data.get("sub")
        if uid is None:
            raise cred_exc
    except JWTError:
        raise cred_exc
    user = db.query(User).filter(User.user_id == int(uid)).first()
    if not user:
        raise cred_exc
    return user

