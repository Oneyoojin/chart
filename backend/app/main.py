from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .db import Base, engine
from .routers import auth, quizzes, answers, stats, category
from . import models
# 테이블 생성(초기 개발 단계에 편의용, 배포는 alembic 권장)
# Base.metadata.create_all(bind=engine)

app = FastAPI()

# 윈도우 경로는 r"..." 로 써서 역슬레시 이스케이프 걱정없이!
UPLOADS_DIR = r"D:\imageupload\uploads"

# /uploads/xxx.png 로 접근 가능하게
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

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
app.include_router(category.router, prefix="/categories", tags=["categories"])
