"""OHLCV (piyasa verisi) uçları."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from heimdall_contracts import BarInterval, OHLCVBar

from ..db import get_session

router = APIRouter(prefix="/instruments", tags=["market"])

_SELECT = text(
    """
    SELECT tenant_id, symbol, exchange_code, interval, event_time, knowledge_time,
           open, high, low, close, volume, adjusted_close, source
    FROM ohlcv_bar
    WHERE symbol = :symbol AND interval = :interval
    ORDER BY event_time ASC
    LIMIT :limit
    """
)


@router.get("/{symbol}/ohlcv", summary="Bir sembolün OHLCV serisini getir")
def get_ohlcv(
    symbol: str,
    interval: BarInterval = Query(default=BarInterval.D1),
    limit: int = Query(default=500, ge=1, le=5000),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    params = {"symbol": symbol.upper(), "interval": interval.value, "limit": limit}
    try:
        rows = session.execute(_SELECT, params).mappings().all()
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail="Veritabanına ulaşılamadı (Docker/Postgres ayakta mı?).",
        ) from exc

    bars = [OHLCVBar(**dict(row)) for row in rows]
    return {
        "symbol": symbol.upper(),
        "interval": interval.value,
        "bars": [b.model_dump(mode="json") for b in bars],
    }
