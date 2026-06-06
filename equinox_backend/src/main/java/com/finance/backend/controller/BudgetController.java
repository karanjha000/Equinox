package com.finance.backend.controller;

import com.finance.backend.dto.BudgetProgressResponse;
import com.finance.backend.dto.BudgetRequest;
import com.finance.backend.dto.BudgetResponse;
import com.finance.backend.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<BudgetResponse>> getAllBudgets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getAllBudgets(userDetails.getUsername()));
    }

    @GetMapping("/progress")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<BudgetProgressResponse>> getBudgetProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getBudgetProgress(userDetails.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BudgetResponse> upsertBudget(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.upsertBudget(request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        budgetService.deleteBudget(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
