package com.example.banking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @NotBlank(message = "Account number is required")
    @Size(min = 10, max = 10, message = "Account number must be exactly 10 digits")
    @Pattern(regexp = "\\d{10}", message = "Account number must be numeric")
    @Column(nullable = false, unique = true, length = 10)
    private String accountNumber;

    @NotBlank(message = "Account holder name is required")
    @Column(nullable = false)
    private String accountHolderName;

    @NotNull(message = "Balance is required")
    @Column(nullable = false)
    private Double balance;

    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "^(Savings|Checking)$", message = "Account type must be either 'Savings' or 'Checking'")
    @Column(nullable = false)
    private String accountType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column
    private Long userId; // Optional ownership link to User

    @Column(nullable = false)
    @Builder.Default
    private boolean isDeleted = false; // Soft-delete flag for audit compliance

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
}
