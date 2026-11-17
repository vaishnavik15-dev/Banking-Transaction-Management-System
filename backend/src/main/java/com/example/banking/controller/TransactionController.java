package com.example.banking.controller;

import com.example.banking.model.Account;
import com.example.banking.model.Transaction;
import com.example.banking.service.BankingService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final BankingService bankingService;

    @Autowired
    public TransactionController(BankingService bankingService) {
        this.bankingService = bankingService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<Account> deposit(@RequestBody DepositRequest request) {
        Account updated = bankingService.deposit(request.getAccountId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Account> withdraw(@RequestBody WithdrawRequest request) {
        Account updated = bankingService.withdraw(request.getAccountId(), request.getAmount(), request.getDescription());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/transfer")
    public ResponseEntity<Account> transfer(@RequestBody TransferRequest request) {
        Account updated = bankingService.transfer(
                request.getFromAccountId(),
                request.getToAccountId(),
                request.getAmount(),
                request.getDescription()
        );
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable Long accountId) {
        List<Transaction> transactions = bankingService.getTransactionsForAccount(accountId);
        return ResponseEntity.ok(transactions);
    }

    // DTO Classes
    @Data
    public static class DepositRequest {
        private Long accountId;
        private Double amount;
        private String description;
    }

    @Data
    public static class WithdrawRequest {
        private Long accountId;
        private Double amount;
        private String description;
    }

    @Data
    public static class TransferRequest {
        private Long fromAccountId;
        private Long toAccountId;
        private Double amount;
        private String description;
    }
}
