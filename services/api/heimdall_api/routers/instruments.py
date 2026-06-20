"""Enstrüman uçları."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from heimdall_contracts import Instrument

from ..db import get_session

router = APIRouter(prefix="/instruments", tags=["instruments"])

_SELECT = text(
    """
    SELECT tenant_id, symbol, exchange_code, name, asset_class, currency,
           yfinance_ticker, isin, is_active
    FROM instrument
    WHERE is_active
    ORDER BY symbol
    """
)


@router.get("", summary="Aktif enstrümanları listele")
def list_instruments(session: Session = Depends(get_session)) -> list[dict[str, Any]]:
    try:
        rows = session.execute(_SELECT).mappings().all()
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail="Veritabanına ulaşılamadı (Docker/Postgres ayakta mı?).",
        ) from exc
    return [Instrument(**dict(row)).model_dump(mode="json") for row in rows]
