package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.WatchlistResponse;
import com.sentinel.watchlist.entity.User;
import com.sentinel.watchlist.entity.WatchlistItem;
import com.sentinel.watchlist.exception.BadRequestException;
import com.sentinel.watchlist.exception.ResourceNotFoundException;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import com.sentinel.watchlist.repository.WatchlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistItemRepository watchlistRepository;
    private final UserService userService;
    private final StockSnapshotRepository snapshotRepository;

    public WatchlistService(WatchlistItemRepository watchlistRepository,
                            UserService userService,
                            StockSnapshotRepository snapshotRepository) {
        this.watchlistRepository = watchlistRepository;
        this.userService = userService;
        this.snapshotRepository = snapshotRepository;
    }

    @Transactional(readOnly = true)
    public WatchlistResponse getWatchlist(Long userId) {
        User user = userService.getUserEntity(userId);
        List<WatchlistItem> items = watchlistRepository.findByUserId(user.getId());

        List<WatchlistResponse.WatchlistItemDto> itemDtos = items.stream()
                .map(item -> new WatchlistResponse.WatchlistItemDto(
                        item.getId(),
                        item.getSymbol(),
                        item.getAddedAt()
                )).toList();

        return new WatchlistResponse(userId, itemDtos);
    }

    @Transactional
    public WatchlistResponse addToWatchlist(Long userId, String rawSymbol) {
        if (rawSymbol == null || rawSymbol.trim().isEmpty()) {
            throw new BadRequestException("Symbol cannot be empty");
        }
        String symbol = rawSymbol.toUpperCase().trim();
        User user = userService.getUserEntity(userId);

        if (watchlistRepository.existsByUserIdAndSymbol(userId, symbol)) {
            throw new BadRequestException("Stock '" + symbol + "' is already in user's watchlist");
        }

        // Verify stock exists in market data
        if (snapshotRepository.findTopBySymbolOrderByTimestampDesc(symbol).isEmpty()) {
            throw new BadRequestException("Stock symbol '" + symbol + "' is not recognized in market data snapshots");
        }

        WatchlistItem item = new WatchlistItem(user, symbol);
        watchlistRepository.save(item);

        return getWatchlist(userId);
    }

    @Transactional
    public WatchlistResponse removeFromWatchlist(Long userId, String rawSymbol) {
        if (rawSymbol == null || rawSymbol.trim().isEmpty()) {
            throw new BadRequestException("Symbol cannot be empty");
        }
        String symbol = rawSymbol.toUpperCase().trim();
        User user = userService.getUserEntity(userId);

        if (!watchlistRepository.existsByUserIdAndSymbol(userId, symbol)) {
            throw new ResourceNotFoundException("Stock '" + symbol + "' was not found in user's watchlist");
        }

        watchlistRepository.deleteByUserIdAndSymbol(user.getId(), symbol);
        return getWatchlist(userId);
    }

    @Transactional(readOnly = true)
    public List<String> getWatchlistSymbols(Long userId) {
        return watchlistRepository.findByUserId(userId).stream()
                .map(WatchlistItem::getSymbol)
                .toList();
    }
}
