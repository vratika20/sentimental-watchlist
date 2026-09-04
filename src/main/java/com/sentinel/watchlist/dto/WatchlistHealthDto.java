package com.sentinel.watchlist.dto;

public record WatchlistHealthDto(
        int score,
        HealthStatus status,
        String summary,
        int normalCount,
        int moderateCount,
        int significantCount
) {}
