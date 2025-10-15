import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_URL: str 
    JWT_SECRET: str 
    JWT_ALG: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    OPENAI_API_KEY: str | None = None
    ALLOW_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Qwen2.5(Ollama)설정
    LLM_BASE_URL: str = "http://localhost:11434/v1"
    LLM_MODEL: str = "qwen2.5:3b-instruct"
    LLM_API_KEY: str = "ollama"

    #v2 setting
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore", # 정의되지 않은 환경은 무시한다.
    )

settings = Settings()

