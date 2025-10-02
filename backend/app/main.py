from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .db import Base, engine
from .routers import auth, quizzes, answers, stats
import app.models
# 테이블 생성(초기 개발 단계에 편의용, 배포는 alembic 권장)
# Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 정적 이미지 (개발)
app.mount("/images", StaticFiles(directory="app/static/image"), name="images")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
app.include_router(answers.router, prefix="/answers", tags=["answers"])
app.include_router(stats.router, prefix="/stats", tags=["stats"])