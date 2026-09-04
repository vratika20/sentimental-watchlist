package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.VolatilityLevel;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VolatilityService {

    public VolatilityLevel calculateVolatility(List<BigDecimal> prices) {
        if (prices == null || prices.size() < 2) {
            return VolatilityLevel.LOW;
        }

        double mean = prices.stream()
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0.0);

        if (mean == 0.0) {
            return VolatilityLevel.LOW;
        }

        double variance = prices.stream()
                .mapToDouble(p -> Math.pow(p.doubleValue() - mean, 2))
                .average()
                .orElse(0.0);

        double stdDev = Math.sqrt(variance);
        double stdDevPercent = (stdDev / mean) * 100.0;

        if (stdDevPercent >= 3.5) {
            return VolatilityLevel.HIGH;
        } else if (stdDevPercent >= 1.5) {
            return VolatilityLevel.MEDIUM;
        } else {
            return VolatilityLevel.LOW;
        }
    }

    public VolatilityLevel calculateAggregateVolatility(List<VolatilityLevel> levels) {
        if (levels == null || levels.isEmpty()) {
            return VolatilityLevel.LOW;
        }
        long highCount = levels.stream().filter(l -> l == VolatilityLevel.HIGH).count();
        long medCount = levels.stream().filter(l -> l == VolatilityLevel.MEDIUM).count();

        if (highCount > 0 || medCount >= levels.size() / 2.0) {
            return highCount > levels.size() / 3.0 ? VolatilityLevel.HIGH : VolatilityLevel.MEDIUM;
        }
        return VolatilityLevel.LOW;
    }
}
