package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.ChangeSeverity;
import com.sentinel.watchlist.dto.HealthStatus;
import com.sentinel.watchlist.dto.StockDeltaDto;
import com.sentinel.watchlist.dto.WatchlistHealthDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistHealthService {

    public WatchlistHealthDto calculateHealth(List<StockDeltaDto> deltas) {
        if (deltas == null || deltas.isEmpty()) {
            return new WatchlistHealthDto(
                    100,
                    HealthStatus.STABLE,
                    "Watchlist is empty. Add stocks to start monitoring.",
                    0, 0, 0
            );
        }

        int normalCount = 0;
        int moderateCount = 0;
        int significantCount = 0;

        for (StockDeltaDto delta : deltas) {
            if (delta.changeSeverity() == ChangeSeverity.SIGNIFICANT) {
                significantCount++;
            } else if (delta.changeSeverity() == ChangeSeverity.MODERATE) {
                moderateCount++;
            } else {
                normalCount++;
            }
        }

        int penalty = (moderateCount * 10) + (significantCount * 25);
        int score = Math.max(0, 100 - penalty);

        HealthStatus status;
        String summary;

        if (score >= 80) {
            status = HealthStatus.STABLE;
            summary = String.format("Watchlist is healthy and stable (%d of %d stocks showed normal price movement).", normalCount, deltas.size());
        } else if (score >= 50) {
            status = HealthStatus.MODERATE_ATTENTION;
            summary = String.format("Watchlist has moderate activity (%d moderate, %d significant movements detected).", moderateCount, significantCount);
        } else {
            status = HealthStatus.HIGH_ALERT;
            summary = String.format("High volatility detected across watchlist (%d significant movements observed!).", significantCount);
        }

        return new WatchlistHealthDto(score, status, summary, normalCount, moderateCount, significantCount);
    }
}
