package com.finance.backend.model;

import com.finance.backend.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_tx_type", columnList = "type"),
        @Index(name = "idx_tx_category", columnList = "category"),
        @Index(name = "idx_tx_date", columnList = "date"),
        @Index(name = "idx_tx_created_by", columnList = "created_by"),
        @Index(name = "idx_tx_deleted", columnList = "deleted")
})
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }

    private String notes;

    @Column(nullable = false)
    private boolean deleted = false;
}
