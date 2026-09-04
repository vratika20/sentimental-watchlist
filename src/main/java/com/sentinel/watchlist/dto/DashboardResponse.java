package com.sentinel.watchlist.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public record DashboardResponse(
        Long userId,
        String userName,
        ZonedDateTime lastCheckedTime,
        ZonedDateTime currentTime,
        String timeAway,
        List<StockDeltaDto> watchlistStocks,
        Map<String, BigDecimal> currentPrices,
        String meaningfulChangeStatus,
        WatchlistHealthDto watchlistHealth,
        List<RecommendationDto> recommendations,
        VolatilityLevel volatilityRiskBadge,
        String dataFreshness
) {}
