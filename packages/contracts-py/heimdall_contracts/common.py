"""Ortak temel tipler ve point-in-time temelleri.

Tüm kontratların kalbi `PITRecord`: her kayıt iki zaman taşır —
`event_time` (olay ne zaman oldu) ve `knowledge_time` (Heimdall bunu ilk ne zaman
bilebilirdi). Backtest/eğitim YALNIZCA `knowledge_time <= t` olan kayıtları görür.
Bkz. docs/ARCHITECTURE.md §1.1.
"""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class AssetClass(StrEnum):
    EQUITY = "equity"
    INDEX = "index"
    ETF = "etf"
    FX = "fx"
    CRYPTO = "crypto"


class BarInterval(StrEnum):
    M1 = "1m"
    M5 = "5m"
    M15 = "15m"
    H1 = "1h"
    D1 = "1d"
    W1 = "1w"


class DataSourceKind(StrEnum):
    MARKET = "market"
    FUNDAMENTAL = "fundamental"
    FILING = "filing"
    NEWS = "news"
    SOCIAL = "social"
    MACRO = "macro"


class HeimdallModel(BaseModel):
    """Tüm kontratların temeli: katı, değişmez, fazladan alana kapalı."""

    model_config = ConfigDict(frozen=True, extra="forbid", populate_by_name=True)


class PITRecord(HeimdallModel):
    """Point-in-time damgalı kayıt temeli."""

    event_time: datetime = Field(description="Olayın gerçekleştiği zaman (ör. bar kapanışı).")
    knowledge_time: datetime = Field(
        description="As-of: Heimdall'ın bu kaydı ilk bilebildiği an. "
        "Backtest/eğitim yalnız knowledge_time <= t olanları görür."
    )

    @model_validator(mode="after")
    def _knowledge_not_before_event(self) -> PITRecord:
        # Bir kaydı gerçekleşmeden önce 'bilmek' lookahead-bias olurdu.
        if self.knowledge_time < self.event_time:
            raise ValueError("knowledge_time, event_time'dan önce olamaz (lookahead-bias).")
        return self
