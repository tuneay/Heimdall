"""Piyasa verisi kontratları (OHLCV)."""

from __future__ import annotations

from decimal import Decimal

from pydantic import Field, model_validator

from .common import BarInterval, PITRecord


class OHLCVBar(PITRecord):
    """Tek bir OHLCV mumu. Fiyatlar Decimal (kayan-nokta hatasından kaçınmak için).

    Point-in-time: `event_time` = bar zamanı, `knowledge_time` = verinin elde edildiği an.
    """

    tenant_id: str = "default"
    symbol: str
    exchange_code: str = "XIST"
    interval: BarInterval = BarInterval.D1

    open: Decimal
    high: Decimal
    low: Decimal
    close: Decimal
    volume: Decimal = Field(ge=0)
    adjusted_close: Decimal | None = None

    source: str = Field(description="Veri kaynağı, ör. 'yfinance'.")

    @model_validator(mode="after")
    def _ohlc_consistency(self) -> OHLCVBar:
        # high tüm fiyatların en üstü, low en altı olmalı — bozuk veri erken yakalanır.
        if self.high < self.low:
            raise ValueError("high < low: tutarsız OHLCV.")
        if not (self.low <= self.open <= self.high):
            raise ValueError("open, [low, high] aralığında değil.")
        if not (self.low <= self.close <= self.high):
            raise ValueError("close, [low, high] aralığında değil.")
        return self
