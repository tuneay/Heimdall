"""Piyasa verisi ingest asset'leri.

Faz 1 walking skeleton: tek BIST hissesinin (THYAO) günlük OHLCV verisini yfinance'tan
çekip Timescale'e point-in-time damgalı upsert eder. Faz 2'de evren ve kaynaklar genişler.
"""

from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

import pandas as pd
import yfinance as yf
from dagster import AssetExecutionContext, MaterializeResult, asset
from sqlalchemy import text

from ..resources import PostgresResource

# Faz 1: tek hisse. Faz 2'de BIST evrenine genişler.
BIST_UNIVERSE: dict[str, str] = {"THYAO": "THYAO.IS"}

_UPSERT = text(
    """
    INSERT INTO ohlcv_bar (tenant_id, symbol, exchange_code, interval, event_time,
        knowledge_time, open, high, low, close, volume, adjusted_close, source)
    VALUES (:tenant_id, :symbol, :exchange_code, :interval, :event_time,
        :knowledge_time, :open, :high, :low, :close, :volume, :adjusted_close, :source)
    ON CONFLICT (tenant_id, symbol, interval, event_time) DO UPDATE SET
        open = EXCLUDED.open, high = EXCLUDED.high, low = EXCLUDED.low,
        close = EXCLUDED.close, volume = EXCLUDED.volume,
        adjusted_close = EXCLUDED.adjusted_close,
        knowledge_time = EXCLUDED.knowledge_time, source = EXCLUDED.source
    """
)


def _dec(value: float, places: int = 4) -> Decimal:
    return Decimal(str(round(float(value), places)))


@asset(
    group_name="market_data",
    compute_kind="yfinance",
    description="THYAO günlük OHLCV (yfinance) → Timescale, point-in-time damgalı.",
)
def thyao_daily_ohlcv(
    context: AssetExecutionContext, postgres: PostgresResource
) -> MaterializeResult:
    symbol = "THYAO"
    yf_ticker = BIST_UNIVERSE[symbol]

    raw = yf.download(
        yf_ticker, period="1y", interval="1d", auto_adjust=False, progress=False
    )
    if raw is None or raw.empty:
        raise ValueError(f"yfinance boş veri döndü: {yf_ticker}")

    # Tek sembolde kolonlar MultiIndex gelebilir → düzleştir.
    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = raw.columns.get_level_values(0)

    # knowledge_time: bu veriyi ŞİMDİ öğrendik (point-in-time / as-of damgası).
    knowledge_time = datetime.now(timezone.utc)
    has_adj = "Adj Close" in raw.columns

    rows: list[dict[str, Any]] = []
    for ts, r in raw.iterrows():
        event_time = pd.Timestamp(ts).to_pydatetime()
        if event_time.tzinfo is None:
            event_time = event_time.replace(tzinfo=timezone.utc)
        rows.append(
            {
                "tenant_id": "default",
                "symbol": symbol,
                "exchange_code": "XIST",
                "interval": "1d",
                "event_time": event_time,
                "knowledge_time": knowledge_time,
                "open": _dec(r["Open"]),
                "high": _dec(r["High"]),
                "low": _dec(r["Low"]),
                "close": _dec(r["Close"]),
                "volume": Decimal(str(int(r["Volume"]))),
                "adjusted_close": _dec(r["Adj Close"]) if has_adj else None,
                "source": "yfinance",
            }
        )

    with postgres.engine().begin() as conn:
        conn.execute(_UPSERT, rows)

    last_close = float(raw["Close"].iloc[-1])
    context.log.info(f"{symbol}: {len(rows)} bar upsert edildi (son kapanış={last_close}).")
    return MaterializeResult(
        metadata={
            "symbol": symbol,
            "rows": len(rows),
            "last_close": last_close,
            "from": str(raw.index[0].date()),
            "to": str(raw.index[-1].date()),
        }
    )
