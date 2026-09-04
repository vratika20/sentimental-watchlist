package com.sentinel.watchlist.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public record StockDeltaDto(
        String symbol,
        String companyName,
        String sector,
        BigDecimal previousPrice,
        BigDecimal latestPrice,
        BigDecimal priceChange,
        double priceChangePercent,
        Long previousVolume,
        Long latestVolume,
        double volumeChangePercent,
        ChangeSeverity changeSeverity,
        VolatilityLevel volatility,
        String movementSummary,
        ZonedDateTime previousTimestamp,
        ZonedDateTime latestTimestamp
) {}
