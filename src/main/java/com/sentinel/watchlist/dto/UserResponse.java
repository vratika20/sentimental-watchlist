package com.sentinel.watchlist.dto;

import java.time.ZonedDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        ZonedDateTime lastActiveTimestamp,
        ZonedDateTime createdAt
) {}
