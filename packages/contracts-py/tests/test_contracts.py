"""Kontrat güvenceleri — özellikle point-in-time (lookahead-bias) ve OHLC tutarlılık."""

from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

import pytest
from heimdall_contracts import AssetClass, Instrument, OHLCVBar
from pydantic import ValidationError


def _bar(**over: Any) -> OHLCVBar:
    base: dict[str, Any] = {
        "symbol": "THYAO",
        "event_time": datetime(2026, 6, 19, tzinfo=UTC),
        "knowledge_time": datetime(2026, 6, 19, 18, tzinfo=UTC),
        "open": Decimal("100"),
        "high": Decimal("110"),
        "low": Decimal("99"),
        "close": Decimal("105"),
        "volume": Decimal("1000"),
        "source": "test",
    }
    base.update(over)
    return OHLCVBar(**base)


def test_valid_bar() -> None:
    bar = _bar()
    assert bar.close == Decimal("105")
    assert bar.interval == "1d"


def test_lookahead_is_rejected() -> None:
    # knowledge_time, event_time'dan önce → lookahead-bias → reddedilmeli.
    with pytest.raises(ValidationError):
        _bar(
            event_time=datetime(2026, 6, 20, tzinfo=UTC),
            knowledge_time=datetime(2026, 6, 19, tzinfo=UTC),
        )


def test_ohlc_consistency_is_enforced() -> None:
    with pytest.raises(ValidationError):
        _bar(high=Decimal("90"))  # high < low/open/close → tutarsız


def test_instrument_defaults() -> None:
    inst = Instrument(symbol="THYAO", name="Türk Hava Yolları A.O.")
    assert inst.exchange_code == "XIST"
    assert inst.asset_class == AssetClass.EQUITY
    assert inst.currency == "TRY"
    assert inst.is_active is True
