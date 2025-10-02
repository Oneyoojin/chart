# backend/test_db.py
from sqlalchemy import text
from app.db import engine

try:
    with engine.connect() as conn:
        # 1) 커넥션만 확인
        print("엔진 연결 성공 ✅")

        # 2) 간단 쿼리 (SQLAlchemy 2.x 는 text() 필요)
        r = conn.execute(text("SELECT 1"))
        print("쿼리 성공 ✅:", r.scalar())

        # 3) (옵션) MySQL 버전 확인
        v = conn.execute(text("SELECT VERSION()"))
        print("MySQL 버전:", v.scalar())

except Exception as e:
    print("DB 연결 실패 ❌:", repr(e))
