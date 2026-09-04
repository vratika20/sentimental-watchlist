package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.ChangeSeverity;
import com.sentinel.watchlist.dto.StockDeltaDto;
import com.sentinel.watchlist.dto.VolatilityLevel;
import com.sentinel.watchlist.entity.StockSnapshot;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SnapshotComparisonServiceTest {

    private StockSnapshotRepository snapshotRepository;
    private DeltaCalculator deltaCalculator;
    private VolatilityService volatilityService;
    private SnapshotComparisonService comparisonService;

    @BeforeEach
    void setUp() {
        snapshotRepository = mock(StockSnapshotRepository.class);
        deltaCalculator = new DeltaCalculator();
        volatilityService = new VolatilityService(); // Real lightweight service instance
        comparisonService = new SnapshotComparisonService(snapshotRepository, deltaCalculator, volatilityService);
    }

    @Test
    void testCompareStockBetween_TataMotorsSurge() {
        ZonedDateTime t10 = ZonedDateTime.parse("2026-09-04T10:00:00+05:30");
        ZonedDateTime t14 = ZonedDateTime.parse("2026-09-04T14:00:00+05:30");

        StockSnapshot snap10 = new StockSnapshot("TATAMOTORS", "Tata Motors Ltd", "Auto", new BigDecimal("950.00"), 1200000L, t10);
        StockSnapshot snap14 = new StockSnapshot("TATAMOTORS", "Tata Motors Ltd", "Auto", new BigDecimal("983.25"), 2850000L, t14);

        when(snapshotRepository.findTopBySymbolAndTimestampLessThanEqualOrderByTimestampDesc(eq("TATAMOTORS"), eq(t10)))
                .thenReturn(Optional.of(snap10));
        when(snapshotRepository.findTopBySymbolAndTimestampLessThanEqualOrderByTimestampDesc(eq("TATAMOTORS"), eq(t14)))
                .thenReturn(Optional.of(snap14));
        when(snapshotRepository.findBySymbolOrderByTimestampAsc("TATAMOTORS"))
                .thenReturn(List.of(snap10, snap14));

        StockDeltaDto delta = comparisonService.compareStockBetween("TATAMOTORS", t10, t14);

        assertNotNull(delta);
        assertEquals("TATAMOTORS", delta.symbol());
        assertEquals(new BigDecimal("950.00"), delta.previousPrice());
        assertEquals(new BigDecimal("983.25"), delta.latestPrice());
        assertEquals(3.50, delta.priceChangePercent());
        assertEquals(ChangeSeverity.SIGNIFICANT, delta.changeSeverity());
        assertEquals("+3.5% Surge", delta.movementSummary());
    }
}
