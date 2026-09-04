package com.sentinel.watchlist.repository;

import com.sentinel.watchlist.entity.StockSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockSnapshotRepository extends JpaRepository<StockSnapshot, Long> {

    List<StockSnapshot> findBySymbolOrderByTimestampAsc(String symbol);

    Optional<StockSnapshot> findTopBySymbolAndTimestampLessThanEqualOrderByTimestampDesc(String symbol, ZonedDateTime timestamp);

    Optional<StockSnapshot> findTopBySymbolAndTimestampGreaterThanEqualOrderByTimestampAsc(String symbol, ZonedDateTime timestamp);

    Optional<StockSnapshot> findTopBySymbolOrderByTimestampDesc(String symbol);

    @Query("SELECT DISTINCT s.symbol FROM StockSnapshot s")
    List<String> findDistinctSymbols();

    @Query("SELECT DISTINCT s.sector FROM StockSnapshot s WHERE s.symbol IN :symbols")
    List<String> findSectorsBySymbols(List<String> symbols);

    List<StockSnapshot> findBySymbolIn(List<String> symbols);
}
