package com.sentinel.watchlist.controller;

import com.sentinel.watchlist.dto.StockHistoryPointDto;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Read-only market data endpoints. Existing dashboard contracts remain unchanged. */
@RestController
@RequestMapping("/api/market/stocks")
public class MarketDataController {
    private final StockSnapshotRepository snapshotRepository;

    public MarketDataController(StockSnapshotRepository snapshotRepository) {
        this.snapshotRepository = snapshotRepository;
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<List<StockHistoryPointDto>> getHistory(@PathVariable String symbol) {
        List<StockHistoryPointDto> history = snapshotRepository
                .findBySymbolOrderByTimestampAsc(symbol.trim().toUpperCase())
                .stream()
                .map(snapshot -> new StockHistoryPointDto(
                        snapshot.getPrice(), snapshot.getVolume(), snapshot.getTimestamp()))
                .toList();
        return ResponseEntity.ok(history);
    }
}
