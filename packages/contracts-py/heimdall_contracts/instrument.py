"""Enstrüman ve borsa kontratları."""

from __future__ import annotations

from pydantic import Field

from .common import AssetClass, HeimdallModel


class Exchange(HeimdallModel):
    code: str = Field(description="Dahili borsa kodu, ör. 'XIST'.")
    name: str = Field(description="Görünen ad, ör. 'Borsa İstanbul'.")
    mic: str | None = Field(default=None, description="ISO 10383 MIC, ör. 'XIST'.")
    timezone: str = "Europe/Istanbul"


class Instrument(HeimdallModel):
    tenant_id: str = "default"
    symbol: str = Field(description="Borsa sembolü, ör. 'THYAO'.")
    exchange_code: str = "XIST"
    name: str = Field(description="Şirket/enstrüman adı.")
    asset_class: AssetClass = AssetClass.EQUITY
    currency: str = "TRY"
    yfinance_ticker: str | None = Field(
        default=None, description="yfinance sembolü, ör. 'THYAO.IS'."
    )
    isin: str | None = None
    is_active: bool = True
