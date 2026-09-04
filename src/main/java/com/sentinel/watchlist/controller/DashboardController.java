package com.sentinel.watchlist.controller;

import com.sentinel.watchlist.dto.DashboardResponse;
import com.sentinel.watchlist.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@RestController
@RequestMapping("/api/users/{id}/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable("id") Long userId) {
        DashboardResponse dashboard = dashboardService.getDashboardForLastVisit(userId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/time-machine")
    public ResponseEntity<DashboardResponse> getTimeMachineDashboard(
            @PathVariable("id") Long userId,
            @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime from,
            @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime to) {

        DashboardResponse dashboard = dashboardService.getTimeMachineDashboard(userId, from, to);
        return ResponseEntity.ok(dashboard);
    }
}
