from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .core.config import settings


# MySQL: pool_pre_ping / pool_recycle 권장
engine = create_engine(
    settings.DB_URL,
    pool_pre_ping=True, #끊어진 커넥션 자동 복구
    pool_recycle=280,   #MySQL wait_timeout 회피
   # echo=True, 디버그시
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
