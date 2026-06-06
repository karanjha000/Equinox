package com.finance.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {
    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Amount limit is required")
    @Positive(message = "Amount limit must be positive")
    private BigDecimal amountLimit;
}
