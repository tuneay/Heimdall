-- Heimdall — Faz 1 şeması. Postgres ilk açılışta otomatik çalışır.
-- Point-in-time alanları (event_time / knowledge_time) baştan birinci sınıftır.

-- ─── Uzantılar ───────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Kiracı (multi-tenant seam) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenant (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO tenant (id, name) VALUES ('default', 'Default')
    ON CONFLICT (id) DO NOTHING;

-- ─── Borsalar ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exchange (
    code     TEXT PRIMARY KEY,
    name     TEXT NOT NULL,
    mic      TEXT,
    timezone TEXT NOT NULL DEFAULT 'Europe/Istanbul'
);
INSERT INTO exchange (code, name, mic) VALUES ('XIST', 'Borsa İstanbul', 'XIST')
    ON CONFLICT (code) DO NOTHING;

-- ─── Enstrümanlar ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instrument (
    tenant_id       TEXT NOT NULL DEFAULT 'default' REFERENCES tenant (id),
    symbol          TEXT NOT NULL,
    exchange_code   TEXT NOT NULL DEFAULT 'XIST' REFERENCES exchange (code),
    name            TEXT NOT NULL,
    asset_class     TEXT NOT NULL DEFAULT 'equity',
    currency        TEXT NOT NULL DEFAULT 'TRY',
    yfinance_ticker TEXT,
    isin            TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (tenant_id, symbol, exchange_code)
);
INSERT INTO instrument (symbol, name, yfinance_ticker)
    VALUES ('THYAO', 'Türk Hava Yolları A.O.', 'THYAO.IS')
    ON CONFLICT (tenant_id, symbol, exchange_code) DO NOTHING;

-- ─── OHLCV (Timescale hypertable) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ohlcv_bar (
    tenant_id      TEXT NOT NULL DEFAULT 'default',
    symbol         TEXT NOT NULL,
    exchange_code  TEXT NOT NULL DEFAULT 'XIST',
    interval       TEXT NOT NULL DEFAULT '1d',
    event_time     TIMESTAMPTZ NOT NULL,
    knowledge_time TIMESTAMPTZ NOT NULL,
    open           NUMERIC NOT NULL,
    high           NUMERIC NOT NULL,
    low            NUMERIC NOT NULL,
    close          NUMERIC NOT NULL,
    volume         NUMERIC NOT NULL,
    adjusted_close NUMERIC,
    source         TEXT NOT NULL,
    PRIMARY KEY (tenant_id, symbol, interval, event_time)
);

-- Hypertable: event_time'a göre zaman-partisyonu (PK'nın parçası olduğu için güvenli).
SELECT create_hypertable('ohlcv_bar', 'event_time', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS ohlcv_bar_symbol_time_idx
    ON ohlcv_bar (symbol, interval, event_time DESC);
