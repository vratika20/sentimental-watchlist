package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.VolatilityLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class VolatilityServiceTest {

    private VolatilityService volatilityService;

    @BeforeEach
    void setUp() {
        volatilityService = new VolatilityService();
    }

    @Test
    void testCalculateVolatility_Low() {
        List<BigDecimal> prices = List.of(
                new BigDecimal("100.00"),
                new BigDecimal("100.20"),
                new BigDecimal("100.10"),
                new BigDecimal("100.30")
        );
        VolatilityLevel level = volatilityService.calculateVolatility(prices);
        assertEquals(VolatilityLevel.LOW, level);
    }

    @Test
    void testCalculateVolatility_High() {
        List<BigDecimal> prices = List.of(
                new BigDecimal("100.00"),
                new BigDecimal("115.00"),
                new BigDecimal("90.00"),
                new BigDecimal("125.00")
        );
        VolatilityLevel level = volatilityService.calculateVolatility(prices);
        assertEquals(VolatilityLevel.HIGH, level);
    }
}
