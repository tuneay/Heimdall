"""Uygulama ayarları (ortam değişkenlerinden)."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://heimdall:change-me-in-dev@localhost:5432/heimdall"

    # Gözlemlenebilirlik — endpoint yoksa telemetri no-op (opsiyonel).
    otel_exporter_otlp_endpoint: str | None = None
    otel_service_name: str = "heimdall-api"

    # CORS — web arayüzü origin'i.
    cors_origins: tuple[str, ...] = ("http://localhost:3000",)


settings = Settings()
