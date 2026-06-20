"""Dagster kaynakları (resources)."""

from __future__ import annotations

from dagster import ConfigurableResource
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine


class PostgresResource(ConfigurableResource):
    """Postgres/Timescale bağlantısı için paylaşılan kaynak."""

    database_url: str

    def engine(self) -> Engine:
        return create_engine(self.database_url, pool_pre_ping=True, future=True)
