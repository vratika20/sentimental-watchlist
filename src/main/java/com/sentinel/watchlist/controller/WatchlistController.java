package com.sentinel.watchlist.controller;

import com.sentinel.watchlist.dto.WatchlistAddRequest;
import com.sentinel.watchlist.dto.WatchlistResponse;
import com.sentinel.watchlist.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/{id}/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<WatchlistResponse> getWatchlist(@PathVariable("id") Long userId) {
        WatchlistResponse watchlist = watchlistService.getWatchlist(userId);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping
    public ResponseEntity<WatchlistResponse> addToWatchlist(@PathVariable("id") Long userId,
                                                            @Valid @RequestBody WatchlistAddRequest request) {
        WatchlistResponse updated = watchlistService.addToWatchlist(userId, request.symbol());
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<WatchlistResponse> removeFromWatchlist(@PathVariable("id") Long userId,
                                                                 @PathVariable("symbol") String symbol) {
        WatchlistResponse updated = watchlistService.removeFromWatchlist(userId, symbol);
        return ResponseEntity.ok(updated);
    }
}
