package com.example.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @Column(nullable = false)
    private Long accountId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String transactionType; // "DEPOSIT", "WITHDRAWAL", "TRANSFER"

    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime transactionDate;

    private Long recipientAccountId; // Nullable, references accountId for transfers

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }
}
