package com.finance.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal amountLimit;
    private LocalDateTime createdAt;
}
