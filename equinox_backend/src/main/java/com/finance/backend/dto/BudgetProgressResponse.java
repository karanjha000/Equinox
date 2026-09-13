package com.finance.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetProgressResponse {
    private Long id;
    private String category;
    private BigDecimal amountLimit;
    private BigDecimal spent;
    private double percentage;
}
