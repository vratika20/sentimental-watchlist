package com.sentinel.watchlist.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

/** A lightweight historical point used by the stock detail chart. */
public record StockHistoryPointDto(
        BigDecimal price,
        Long volume,
        ZonedDateTime timestamp
) {}
