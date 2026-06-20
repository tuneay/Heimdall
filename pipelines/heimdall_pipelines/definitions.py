"""Dagster kod konumu tanımı (code location)."""

from __future__ import annotations

import os

from dagster import Definitions, load_assets_from_modules

from .assets import market_data
from .resources import PostgresResource

_DEFAULT_DB = "postgresql+psycopg://heimdall:change-me-in-dev@localhost:5432/heimdall"

defs = Definitions(
    assets=load_assets_from_modules([market_data]),
    resources={
        "postgres": PostgresResource(database_url=os.getenv("DATABASE_URL", _DEFAULT_DB)),
    },
)
