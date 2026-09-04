package com.sentinel.watchlist.repository;

import com.sentinel.watchlist.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(Long userId);
    Optional<WatchlistItem> findByUserIdAndSymbol(Long userId, String symbol);
    boolean existsByUserIdAndSymbol(Long userId, String symbol);
    void deleteByUserIdAndSymbol(Long userId, String symbol);
}
