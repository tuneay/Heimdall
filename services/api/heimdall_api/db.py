"""Veritabanı bağlantısı (SQLAlchemy 2.0)."""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from .config import settings

engine: Engine = create_engine(settings.database_url, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, future=True)


def get_session() -> Iterator[Session]:
    """FastAPI bağımlılığı: istek başına bir oturum."""
    with SessionLocal() as session:
        yield session
