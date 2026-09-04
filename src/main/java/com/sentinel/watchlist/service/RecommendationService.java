package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.RecommendationDto;
import com.sentinel.watchlist.entity.StockSnapshot;
import com.sentinel.watchlist.repository.StockSnapshotRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final StockSnapshotRepository snapshotRepository;
    private final DeltaCalculator deltaCalculator;

    public RecommendationService(StockSnapshotRepository snapshotRepository, DeltaCalculator deltaCalculator) {
        this.snapshotRepository = snapshotRepository;
        this.deltaCalculator = deltaCalculator;
    }

    public List<RecommendationDto> generateRecommendations(List<String> userSymbols) {
        Set<String> existingSymbols = userSymbols.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toSet());

        List<String> distinctSymbols = snapshotRepository.findDistinctSymbols();
        List<String> candidateSymbols = distinctSymbols.stream()
                .filter(s -> !existingSymbols.contains(s.toUpperCase()))
                .toList();

        List<String> userSectors = snapshotRepository.findSectorsBySymbols(userSymbols);

        List<RecommendationDto> recommendations = new ArrayList<>();

        for (String candidate : candidateSymbols) {
            Optional<StockSnapshot> latestOpt = snapshotRepository.findTopBySymbolOrderByTimestampDesc(candidate);
            List<StockSnapshot> history = snapshotRepository.findBySymbolOrderByTimestampAsc(candidate);

            if (latestOpt.isPresent() && !history.isEmpty()) {
                StockSnapshot latest = latestOpt.get();
                StockSnapshot earliest = history.get(0);

                double priceChangePct = deltaCalculator.calculatePriceChangePercent(earliest.getPrice(), latest.getPrice());

                boolean matchesSector = userSectors.contains(latest.getSector());
                String reason;
                if (matchesSector) {
                    reason = String.format("Matches your portfolio sector '%s' with %.1f%% price change today.", latest.getSector(), priceChangePct);
                } else {
                    reason = String.format("High activity in %s sector with strong momentum (%.1f%% change).", latest.getSector(), priceChangePct);
                }

                recommendations.add(new RecommendationDto(
                        latest.getSymbol(),
                        latest.getCompanyName(),
                        latest.getSector(),
                        latest.getPrice(),
                        priceChangePct,
                        reason
                ));
            }
        }

        // Return top 3 candidates sorted by relevance/performance
        return recommendations.stream()
                .sorted((a, b) -> Double.compare(Math.abs(b.recentPriceChangePercent()), Math.abs(a.recentPriceChangePercent())))
                .limit(3)
                .toList();
    }
}
