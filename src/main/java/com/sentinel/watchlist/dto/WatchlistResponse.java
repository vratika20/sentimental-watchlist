package com.sentinel.watchlist.dto;

import java.time.ZonedDateTime;
import java.util.List;

public record WatchlistResponse(
        Long userId,
        List<WatchlistItemDto> items
) {
    public record WatchlistItemDto(
            Long id,
            String symbol,
            ZonedDateTime addedAt
    ) {}
}
