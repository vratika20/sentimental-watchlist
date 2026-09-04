package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.ChangeSeverity;
import com.sentinel.watchlist.dto.StockDeltaDto;
import com.sentinel.watchlist.dto.VolatilityLevel;
import com.sentinel.watchlist.entity.StockSnapshot;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SnapshotComparisonService {

    private final StockSnapshotRepository snapshotRepository;
    private final DeltaCalculator deltaCalculator;
    private final VolatilityService volatilityService;

    public SnapshotComparisonService(StockSnapshotRepository snapshotRepository,
                                     DeltaCalculator deltaCalculator,
                                     VolatilityService volatilityService) {
        this.snapshotRepository = snapshotRepository;
        this.deltaCalculator = deltaCalculator;
        this.volatilityService = volatilityService;
    }

    public StockDeltaDto compareStockBetween(String symbol, ZonedDateTime fromTimestamp, ZonedDateTime toTimestamp) {
        String cleanSymbol = symbol.toUpperCase().trim();

        // 1. Find snapshot closest to or at 'fromTimestamp'
        Optional<StockSnapshot> fromOpt = snapshotRepository
                .findTopBySymbolAndTimestampLessThanEqualOrderByTimestampDesc(cleanSymbol, fromTimestamp);

        if (fromOpt.isEmpty()) {
            fromOpt = snapshotRepository.findTopBySymbolAndTimestampGreaterThanEqualOrderByTimestampAsc(cleanSymbol, fromTimestamp);
        }

        // 2. Find snapshot closest to or at 'toTimestamp'
        Optional<StockSnapshot> toOpt = snapshotRepository
                .findTopBySymbolAndTimestampLessThanEqualOrderByTimestampDesc(cleanSymbol, toTimestamp);

        if (toOpt.isEmpty()) {
            toOpt = snapshotRepository.findTopBySymbolOrderByTimestampDesc(cleanSymbol);
        }

        if (fromOpt.isEmpty() || toOpt.isEmpty()) {
            return null; // Gracefully handled by caller
        }

        StockSnapshot fromSnap = fromOpt.get();
        StockSnapshot toSnap = toOpt.get();

        // Calculate deltas
        BigDecimal priceChange = deltaCalculator.calculatePriceChange(fromSnap.getPrice(), toSnap.getPrice());
        double priceChangePct = deltaCalculator.calculatePriceChangePercent(fromSnap.getPrice(), toSnap.getPrice());
        double volumeChangePct = deltaCalculator.calculateVolumeChangePercent(fromSnap.getVolume(), toSnap.getVolume());

        ChangeSeverity severity = deltaCalculator.classifySeverity(priceChangePct);
        String movementSummary = deltaCalculator.generateMovementSummary(priceChangePct, severity);

        // Fetch historical prices for volatility calculation
        List<StockSnapshot> history = snapshotRepository.findBySymbolOrderByTimestampAsc(cleanSymbol);
        List<BigDecimal> prices = history.stream().map(StockSnapshot::getPrice).toList();
        VolatilityLevel volatility = volatilityService.calculateVolatility(prices);

        return new StockDeltaDto(
                cleanSymbol,
                toSnap.getCompanyName(),
                toSnap.getSector(),
                fromSnap.getPrice(),
                toSnap.getPrice(),
                priceChange,
                priceChangePct,
                fromSnap.getVolume(),
                toSnap.getVolume(),
                volumeChangePct,
                severity,
                volatility,
                movementSummary,
                fromSnap.getTimestamp(),
                toSnap.getTimestamp()
        );
    }

    public List<StockDeltaDto> compareWatchlistBetween(List<String> symbols, ZonedDateTime fromTimestamp, ZonedDateTime toTimestamp) {
        List<StockDeltaDto> results = new ArrayList<>();
        for (String symbol : symbols) {
            StockDeltaDto delta = compareStockBetween(symbol, fromTimestamp, toTimestamp);
            if (delta != null) {
                results.add(delta);
            }
        }
        return results;
    }
}
