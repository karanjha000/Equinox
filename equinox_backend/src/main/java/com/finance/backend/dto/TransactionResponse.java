package com.finance.backend.dto;

import com.finance.backend.enums.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TransactionResponse {

    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private LocalDate date;
    private String notes;
    private String createdBy;
    private LocalDateTime createdAt;
}
