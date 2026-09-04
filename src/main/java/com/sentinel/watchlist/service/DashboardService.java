package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.*;
import com.sentinel.watchlist.entity.StockSnapshot;
import com.sentinel.watchlist.entity.User;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserService userService;
    private final WatchlistService watchlistService;
    private final SnapshotComparisonService comparisonService;
    private final WatchlistHealthService healthService;
    private final RecommendationService recommendationService;
    private final VolatilityService volatilityService;
    private final StockSnapshotRepository snapshotRepository;

    public DashboardService(UserService userService,
                            WatchlistService watchlistService,
                            SnapshotComparisonService comparisonService,
                            WatchlistHealthService healthService,
                            RecommendationService recommendationService,
                            VolatilityService volatilityService,
                            StockSnapshotRepository snapshotRepository) {
        this.userService = userService;
        this.watchlistService = watchlistService;
        this.comparisonService = comparisonService;
        this.healthService = healthService;
        this.recommendationService = recommendationService;
        this.volatilityService = volatilityService;
        this.snapshotRepository = snapshotRepository;
    }

    @Transactional
    public DashboardResponse getDashboardForLastVisit(Long userId) {
        User user = userService.getUserEntity(userId);
        List<String> symbols = watchlistService.getWatchlistSymbols(userId);

        ZonedDateTime lastCheckedTime = user.getLastActiveTimestamp();
        
        // Find latest available snapshot timestamp across all market data
        List<String> allSymbols = snapshotRepository.findDistinctSymbols();
        ZonedDateTime currentTime = ZonedDateTime.now();
        if (!allSymbols.isEmpty()) {
            Optional<StockSnapshot> latestGlobalSnap = snapshotRepository.findTopBySymbolOrderByTimestampDesc(allSymbols.get(0));
            if (latestGlobalSnap.isPresent()) {
                currentTime = latestGlobalSnap.get().getTimestamp();
            }
        }

        // If lastCheckedTime is missing or after currentTime, fallback to start of demo day (e.g. 10:00 AM)
        if (lastCheckedTime == null || !lastCheckedTime.isBefore(currentTime)) {
            lastCheckedTime = currentTime.minusHours(4);
        }

        DashboardResponse response = buildDashboardResponse(user, lastCheckedTime, currentTime, symbols);

        // Update user's last_active_timestamp after generating response
        userService.updateLastActiveTimestamp(userId, currentTime);

        return response;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getTimeMachineDashboard(Long userId, ZonedDateTime fromTimestamp, ZonedDateTime toTimestamp) {
        User user = userService.getUserEntity(userId);
        List<String> symbols = watchlistService.getWatchlistSymbols(userId);

        if (fromTimestamp == null) {
            fromTimestamp = user.getLastActiveTimestamp();
        }
        if (toTimestamp == null) {
            toTimestamp = ZonedDateTime.now();
        }

        return buildDashboardResponse(user, fromTimestamp, toTimestamp, symbols);
    }

    private DashboardResponse buildDashboardResponse(User user, ZonedDateTime fromTime, ZonedDateTime toTime, List<String> symbols) {
        String timeAway = formatDuration(fromTime, toTime);

        List<StockDeltaDto> stockDeltas = comparisonService.compareWatchlistBetween(symbols, fromTime, toTime);

        Map<String, BigDecimal> currentPrices = stockDeltas.stream()
                .collect(Collectors.toMap(StockDeltaDto::symbol, StockDeltaDto::latestPrice, (a, b) -> a));

        WatchlistHealthDto health = healthService.calculateHealth(stockDeltas);
        List<RecommendationDto> recommendations = recommendationService.generateRecommendations(symbols);

        List<VolatilityLevel> volLevels = stockDeltas.stream().map(StockDeltaDto::volatility).toList();
        VolatilityLevel overallRisk = volatilityService.calculateAggregateVolatility(volLevels);

        String meaningfulChangeStatus = summarizeMeaningfulChanges(stockDeltas);
        String dataFreshness = calculateDataFreshness(toTime);

        return new DashboardResponse(
                user.getId(),
                user.getName(),
                fromTime,
                toTime,
                timeAway,
                stockDeltas,
                currentPrices,
                meaningfulChangeStatus,
                health,
                recommendations,
                overallRisk,
                dataFreshness
        );
    }

    private String summarizeMeaningfulChanges(List<StockDeltaDto> deltas) {
        if (deltas.isEmpty()) {
            return "No stocks currently in watchlist.";
        }
        long sigCount = deltas.stream().filter(d -> d.changeSeverity() == ChangeSeverity.SIGNIFICANT).count();
        long modCount = deltas.stream().filter(d -> d.changeSeverity() == ChangeSeverity.MODERATE).count();

        if (sigCount == 0 && modCount == 0) {
            return "All watchlist stocks remained stable within normal thresholds.";
        }

        List<String> parts = new ArrayList<>();
        if (sigCount > 0) {
            parts.add(sigCount + " stock(s) with SIGNIFICANT movement");
        }
        if (modCount > 0) {
            parts.add(modCount + " stock(s) with MODERATE movement");
        }
        return String.join(", ", parts) + ".";
    }

    private String formatDuration(ZonedDateTime from, ZonedDateTime to) {
        if (from == null || to == null) {
            return "0 minutes";
        }
        Duration duration = Duration.between(from, to);
        long totalMinutes = Math.abs(duration.toMinutes());
        long hours = totalMinutes / 60;
        long minutes = totalMinutes % 60;

        if (hours == 0) {
            return minutes + " minute(s)";
        } else if (minutes == 0) {
            return hours + " hour(s)";
        } else {
            return String.format("%d hour(s) %d minute(s)", hours, minutes);
        }
    }

    private String calculateDataFreshness(ZonedDateTime dataTime) {
        if (dataTime == null) {
            return "STALE (Unknown)";
        }
        Duration age = Duration.between(dataTime, ZonedDateTime.now());
        if (Math.abs(age.toHours()) < 1) {
            return "REALTIME (Data snapshot as of " + dataTime.toLocalTime().toString() + ")";
        } else if (Math.abs(age.toHours()) < 24) {
            return "RECENT (" + Math.abs(age.toHours()) + " hour(s) old snapshot)";
        } else {
            return "STALE (" + Math.abs(age.toDays()) + " day(s) old data)";
        }
    }
}
