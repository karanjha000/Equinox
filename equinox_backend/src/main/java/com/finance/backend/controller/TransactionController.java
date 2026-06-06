package com.finance.backend.controller;

import com.finance.backend.dto.TransactionRequest;
import com.finance.backend.dto.TransactionResponse;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public ResponseEntity<TransactionResponse> create(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(transactionService.create(request,userDetails.getUsername()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Page<TransactionResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(transactionService.getAllPaged(page, size, type, category, startDate, endDate, userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<TransactionResponse> getById(@PathVariable Long id,
                                                        @AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(transactionService.getById(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST')")
    public ResponseEntity<TransactionResponse> update(@PathVariable Long id,
                                                      @Valid @RequestBody TransactionRequest request,
                                                      @AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(transactionService.update(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails){
        transactionService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    @GetMapping("/filter/type")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<TransactionResponse>> filterByType(@RequestParam TransactionType type,
                                                                   @AuthenticationPrincipal UserDetails userDetails){;
        return ResponseEntity.ok(transactionService.filterByType(type, userDetails.getUsername()));
    }
    @GetMapping("/filter/category")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<TransactionResponse>> filterByCategory(@RequestParam String category,
                                                                       @AuthenticationPrincipal UserDetails userDetails){;
        return ResponseEntity.ok(transactionService.filterByCategory(category, userDetails.getUsername()));
    }
    @GetMapping("/filter/date")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<List<TransactionResponse>> filterByDate(@RequestParam LocalDate start, @RequestParam LocalDate end,
                                                                  @AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(transactionService.filterByDateRange(start, end, userDetails.getUsername()));
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<byte[]> exportCSV(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @AuthenticationPrincipal UserDetails userDetails) {
        byte[] csvData = transactionService.exportTransactionsToCSV(type, category, startDate, endDate, userDetails.getUsername());
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(csvData);
    }

}
