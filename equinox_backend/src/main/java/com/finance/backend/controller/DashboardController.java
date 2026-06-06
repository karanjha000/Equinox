package com.finance.backend.controller;


import com.finance.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, Object>> getSummary(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getSummary(userDetails.getUsername()));
    }
    @GetMapping("/income")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getTotalIncome(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getTotalIncome(userDetails.getUsername()));
    }
    @GetMapping("/expenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getTotalExpenses(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getTotalExpenses(userDetails.getUsername()));
    }
    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getNetBalance(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getNetBalance(userDetails.getUsername()));
    }
    @GetMapping("/trends/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyTrends(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getMonthlyTrends(userDetails.getUsername()));
    }
    @GetMapping("/trends/category")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryTotals(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(dashboardService.getCategoryWiseTotals(userDetails.getUsername()));
    }
}
