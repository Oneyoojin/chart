# 빈 __init__.py 파일을 생성해 놓은 이유는 파이썬이 이 폴더들을 패키지로 인식하게 하기 위한 작업.
# (Alembic 같은 툴에서 import 에러 막으려면 필수요소)


"""
벡엔드 실행 명령
fastapi 실행 시: 
cd backend> uvicorn app.main:app --reload --port8000

Alembic 실행 시:
cd backend> alembic revision --autogenerate -m "init tables"
alembic upgrade head
"""