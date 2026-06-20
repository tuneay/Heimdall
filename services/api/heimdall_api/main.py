"""Heimdall API uygulama girişi."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import health, instruments, ohlcv
from .telemetry import setup_telemetry


def create_app() -> FastAPI:
    app = FastAPI(
        title="Heimdall API",
        version="0.1.0",
        description="Borsa İstanbul tahmin/sinyal/araştırma platformu — veri servis katmanı.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(instruments.router)
    app.include_router(ohlcv.router)

    setup_telemetry(app)
    return app


app = create_app()
