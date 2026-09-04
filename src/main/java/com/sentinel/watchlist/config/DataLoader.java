package com.sentinel.watchlist.config;

import com.sentinel.watchlist.entity.StockSnapshot;
import com.sentinel.watchlist.entity.User;
import com.sentinel.watchlist.entity.WatchlistItem;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import com.sentinel.watchlist.repository.UserRepository;
import com.sentinel.watchlist.repository.WatchlistItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WatchlistItemRepository watchlistRepository;
    private final StockSnapshotRepository snapshotRepository;

    public DataLoader(UserRepository userRepository,
                      WatchlistItemRepository watchlistRepository,
                      StockSnapshotRepository snapshotRepository) {
        this.userRepository = userRepository;
        this.watchlistRepository = watchlistRepository;
        this.snapshotRepository = snapshotRepository;
    }

    @Override
    public void run(String... args) {
        if (snapshotRepository.count() > 0) {
            return;
        }

        ZoneId zone = ZoneId.of("Asia/Kolkata");
        LocalDate today = LocalDate.of(2026, 9, 4);

        ZonedDateTime t1000 = ZonedDateTime.of(today, LocalTime.of(10, 0), zone);
        ZonedDateTime t1100 = ZonedDateTime.of(today, LocalTime.of(11, 0), zone);
        ZonedDateTime t1200 = ZonedDateTime.of(today, LocalTime.of(12, 0), zone);
        ZonedDateTime t1300 = ZonedDateTime.of(today, LocalTime.of(13, 0), zone);
        ZonedDateTime t1400 = ZonedDateTime.of(today, LocalTime.of(14, 0), zone);

        // Seed Tata Motors (TATAMOTORS) - Noticeable Surge +3.5%
        seedSnapshots("TATAMOTORS", "Tata Motors Ltd", "Auto", List.of(
                new SnapData(t1000, new BigDecimal("950.00"), 1200000L),
                new SnapData(t1100, new BigDecimal("958.50"), 1450000L),
                new SnapData(t1200, new BigDecimal("964.00"), 1800000L),
                new SnapData(t1300, new BigDecimal("975.00"), 2100000L),
                new SnapData(t1400, new BigDecimal("983.25"), 2850000L)
        ));

        // Seed Infosys (INFY) - Moderate Gain +1.8%
        seedSnapshots("INFY", "Infosys Limited", "IT", List.of(
                new SnapData(t1000, new BigDecimal("1600.00"), 800000L),
                new SnapData(t1100, new BigDecimal("1610.00"), 920000L),
                new SnapData(t1200, new BigDecimal("1618.00"), 1050000L),
                new SnapData(t1300, new BigDecimal("1622.00"), 1150000L),
                new SnapData(t1400, new BigDecimal("1628.80"), 1300000L)
        ));

        // Seed TCS - Stable +0.4%
        seedSnapshots("TCS", "Tata Consultancy Services", "IT", List.of(
                new SnapData(t1000, new BigDecimal("3850.00"), 500000L),
                new SnapData(t1100, new BigDecimal("3855.00"), 550000L),
                new SnapData(t1200, new BigDecimal("3860.00"), 600000L),
                new SnapData(t1300, new BigDecimal("3862.00"), 630000L),
                new SnapData(t1400, new BigDecimal("3865.40"), 680000L)
        ));

        // Seed RELIANCE - Stable +0.8%
        seedSnapshots("RELIANCE", "Reliance Industries Ltd", "Energy", List.of(
                new SnapData(t1000, new BigDecimal("2900.00"), 2000000L),
                new SnapData(t1100, new BigDecimal("2908.00"), 2200000L),
                new SnapData(t1200, new BigDecimal("2915.00"), 2450000L),
                new SnapData(t1300, new BigDecimal("2920.00"), 2700000L),
                new SnapData(t1400, new BigDecimal("2923.20"), 3000000L)
        ));

        // Seed HDFCBANK - Mild Dip -1.2%
        seedSnapshots("HDFCBANK", "HDFC Bank Limited", "Banking", List.of(
                new SnapData(t1000, new BigDecimal("1450.00"), 1500000L),
                new SnapData(t1100, new BigDecimal("1445.00"), 1600000L),
                new SnapData(t1200, new BigDecimal("1440.00"), 1750000L),
                new SnapData(t1300, new BigDecimal("1436.00"), 1900000L),
                new SnapData(t1400, new BigDecimal("1432.60"), 2100000L)
        ));

        // Seed M&M - Auto Sector Recommendation Candidate (+2.6%)
        seedSnapshots("M&M", "Mahindra & Mahindra Ltd", "Auto", List.of(
                new SnapData(t1000, new BigDecimal("2100.00"), 900000L),
                new SnapData(t1100, new BigDecimal("2115.00"), 1000000L),
                new SnapData(t1200, new BigDecimal("2130.00"), 1150000L),
                new SnapData(t1300, new BigDecimal("2142.00"), 1280000L),
                new SnapData(t1400, new BigDecimal("2154.60"), 1400000L)
        ));

        // Seed Demo User with 10:00 AM initial active timestamp
        User demoUser = new User("Sentinel Demo User", "demo@sentinel.com");
        demoUser.setLastActiveTimestamp(t1000);
        User savedUser = userRepository.save(demoUser);

        // Seed Watchlist for Demo User
        List<String> userStocks = List.of("TATAMOTORS", "INFY", "TCS", "RELIANCE", "HDFCBANK");
        for (String symbol : userStocks) {
            WatchlistItem item = new WatchlistItem(savedUser, symbol);
            item.setAddedAt(t1000);
            watchlistRepository.save(item);
        }
    }

    private void seedSnapshots(String symbol, String companyName, String sector, List<SnapData> dataList) {
        for (SnapData d : dataList) {
            StockSnapshot snapshot = new StockSnapshot(symbol, companyName, sector, d.price, d.volume, d.timestamp);
            snapshotRepository.save(snapshot);
        }
    }

    private record SnapData(ZonedDateTime timestamp, BigDecimal price, Long volume) {}
}
