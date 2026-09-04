-- Schema definition for Sentinel Watchlist

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    last_active_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_symbol UNIQUE (user_id, symbol)
);

CREATE TABLE IF NOT EXISTS stock_snapshots (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    volume BIGINT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_snapshots_symbol_ts ON stock_snapshots(symbol, timestamp);
