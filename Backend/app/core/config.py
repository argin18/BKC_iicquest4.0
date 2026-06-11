import secrets
from functools import lru_cache
from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


def _get_env_file_encoding() -> str:
    """
    Detect and fix .env file encoding issues.
    Handles UTF-8, UTF-8 BOM, UTF-16, and other encodings.
    """
    env_path = Path(".env")
    if not env_path.exists():
        return "utf-8"
    
    # Read raw bytes to detect encoding
    try:
        raw_bytes = env_path.read_bytes()
        
        # Check for UTF-16 BOM (0xFF 0xFE or 0xFE 0xFF)
        if raw_bytes[:2] in (b'\xff\xfe', b'\xfe\xff'):
            # UTF-16 detected - convert to UTF-8
            try:
                content = raw_bytes.decode('utf-16')
                env_path.write_text(content, encoding='utf-8')
                return "utf-8"
            except Exception:
                pass
        
        # Check for UTF-8 BOM (0xEF 0xBB 0xBF)
        if raw_bytes[:3] == b'\xef\xbb\xbf':
            try:
                content = raw_bytes.decode('utf-8-sig')
                env_path.write_text(content, encoding='utf-8')
                return "utf-8"
            except Exception:
                pass
        
        return "utf-8"
    except Exception:
        return "utf-8"


class Settings(BaseSettings):
    PROJECT_NAME: str = "IIROS Backend"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./iiros.db"

    # Security — never hardcode; generate strong default only for local dev
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS — comma-separated allowed origins; * is dangerous in prod
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"

    # AI Config
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding=_get_env_file_encoding(),
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        origins = [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
        return origins if origins else ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
