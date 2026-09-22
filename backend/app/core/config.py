from pydantic_settings import BaseSettings, SettingsConfigDict

# SettingsConfigDict ->This is used to configure how BaseSettings should load the settings.
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()


# .env
#  ↓
# BaseSettings
#  ↓
# Settings