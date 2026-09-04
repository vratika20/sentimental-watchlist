package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.ChangeSeverity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class DeltaCalculator {

    public BigDecimal calculatePriceChange(BigDecimal previousPrice, BigDecimal latestPrice) {
        if (previousPrice == null || latestPrice == null) {
            return BigDecimal.ZERO;
        }
        return latestPrice.subtract(previousPrice).setScale(2, RoundingMode.HALF_UP);
    }

    public double calculatePriceChangePercent(BigDecimal previousPrice, BigDecimal latestPrice) {
        if (previousPrice == null || latestPrice == null || previousPrice.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        BigDecimal diff = latestPrice.subtract(previousPrice);
        BigDecimal pct = diff.divide(previousPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        return pct.setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public double calculateVolumeChangePercent(Long previousVolume, Long latestVolume) {
        if (previousVolume == null || latestVolume == null || previousVolume == 0) {
            return 0.0;
        }
        double diff = latestVolume - previousVolume;
        double pct = (diff / (double) previousVolume) * 100.0;
        return BigDecimal.valueOf(pct).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public ChangeSeverity classifySeverity(double priceChangePercent) {
        double absPct = Math.abs(priceChangePercent);
        if (absPct >= 3.0) {
            return ChangeSeverity.SIGNIFICANT;
        } else if (absPct >= 1.5) {
            return ChangeSeverity.MODERATE;
        } else {
            return ChangeSeverity.NORMAL;
        }
    }

    public String generateMovementSummary(double priceChangePercent, ChangeSeverity severity) {
        String sign = priceChangePercent >= 0 ? "+" : "";
        String pctStr = String.format("%s%.1f%%", sign, priceChangePercent);

        if (severity == ChangeSeverity.SIGNIFICANT) {
            return priceChangePercent >= 0 ? pctStr + " Surge" : pctStr + " Plunge";
        } else if (severity == ChangeSeverity.MODERATE) {
            return priceChangePercent >= 0 ? pctStr + " Gain" : pctStr + " Dip";
        } else {
            return pctStr + " Stable";
        }
    }
}
