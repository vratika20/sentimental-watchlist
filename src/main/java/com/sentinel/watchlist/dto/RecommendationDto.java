package com.sentinel.watchlist.dto;

import java.math.BigDecimal;

public record RecommendationDto(
        String symbol,
        String companyName,
        String sector,
        BigDecimal currentPrice,
        double recentPriceChangePercent,
        String reason
) {}
