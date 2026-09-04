package com.sentinel.watchlist.dto;

import jakarta.validation.constraints.NotBlank;

public record WatchlistAddRequest(
        @NotBlank(message = "Stock symbol is required") String symbol
) {}
