package com.sentinel.watchlist.exception;

import java.time.ZonedDateTime;
import java.util.List;

public record ErrorResponse(
        int status,
        String error,
        String message,
        List<String> details,
        ZonedDateTime timestamp
) {
    public ErrorResponse(int status, String error, String message) {
        this(status, error, message, List.of(), ZonedDateTime.now());
    }

    public ErrorResponse(int status, String error, String message, List<String> details) {
        this(status, error, message, details, ZonedDateTime.now());
    }
}
