package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.ChangeSeverity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class DeltaCalculatorTest {

    private DeltaCalculator deltaCalculator;

    @BeforeEach
    void setUp() {
        deltaCalculator = new DeltaCalculator();
    }

    @Test
    void testCalculatePriceChange() {
        BigDecimal from = new BigDecimal("950.00");
        BigDecimal to = new BigDecimal("983.25");

        BigDecimal diff = deltaCalculator.calculatePriceChange(from, to);
        assertEquals(new BigDecimal("33.25"), diff);
    }

    @Test
    void testCalculatePriceChangePercent_Surge() {
        // Tata Motors 950.00 to 983.25 = +3.5%
        BigDecimal from = new BigDecimal("950.00");
        BigDecimal to = new BigDecimal("983.25");

        double pct = deltaCalculator.calculatePriceChangePercent(from, to);
        assertEquals(3.50, pct);
    }

    @Test
    void testCalculateVolumeChangePercent() {
        Long fromVol = 1200000L;
        Long toVol = 2850000L;

        double pct = deltaCalculator.calculateVolumeChangePercent(fromVol, toVol);
        assertEquals(137.50, pct);
    }

    @Test
    void testClassifySeverity() {
        assertEquals(ChangeSeverity.NORMAL, deltaCalculator.classifySeverity(0.4));
        assertEquals(ChangeSeverity.NORMAL, deltaCalculator.classifySeverity(-1.2));
        assertEquals(ChangeSeverity.MODERATE, deltaCalculator.classifySeverity(1.8));
        assertEquals(ChangeSeverity.MODERATE, deltaCalculator.classifySeverity(-2.5));
        assertEquals(ChangeSeverity.SIGNIFICANT, deltaCalculator.classifySeverity(3.5));
        assertEquals(ChangeSeverity.SIGNIFICANT, deltaCalculator.classifySeverity(-4.2));
    }

    @Test
    void testGenerateMovementSummary() {
        String surge = deltaCalculator.generateMovementSummary(3.5, ChangeSeverity.SIGNIFICANT);
        assertEquals("+3.5% Surge", surge);

        String dip = deltaCalculator.generateMovementSummary(-2.1, ChangeSeverity.MODERATE);
        assertEquals("-2.1% Dip", dip);

        String stable = deltaCalculator.generateMovementSummary(0.4, ChangeSeverity.NORMAL);
        assertEquals("+0.4% Stable", stable);
    }
}
