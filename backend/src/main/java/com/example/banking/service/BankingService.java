package com.example.banking.service;

import com.example.banking.exception.BadRequestException;
import com.example.banking.exception.ResourceNotFoundException;
import com.example.banking.model.Account;
import com.example.banking.model.Transaction;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class BankingService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public BankingService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    private double roundMoney(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    public Account createAccount(Account account) {
        if (account.getAccountNumber() == null || !account.getAccountNumber().matches("\\d{10}")) {
            throw new BadRequestException("Account number must be a 10-digit numeric string.");
        }
        if (accountRepository.existsByAccountNumber(account.getAccountNumber())) {
            throw new BadRequestException("Account number must be unique. An account with this number already exists.");
        }
        if (account.getAccountHolderName() == null || account.getAccountHolderName().trim().isEmpty()) {
            throw new BadRequestException("Account holder name must not be empty.");
        }
        if (account.getBalance() == null || account.getBalance() < 500.00) {
            throw new BadRequestException("Initial balance must be greater than or equal to 500.00.");
        }
        if (account.getAccountType() == null || (!account.getAccountType().equals("Savings") && !account.getAccountType().equals("Checking"))) {
            throw new BadRequestException("Account type must be either 'Savings' or 'Checking'.");
        }

        account.setBalance(roundMoney(account.getBalance()));
        account.setDeleted(false);
        return accountRepository.save(account);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findByIsDeletedFalse();
    }

    public Account getAccountById(Long accountId) {
        return accountRepository.findByAccountIdAndIsDeletedFalse(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
    }

    @Transactional
    public Account deposit(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Deposit amount must be greater than 0.");
        }
        Account account = getAccountById(accountId);
        double roundedAmount = roundMoney(amount);
        account.setBalance(roundMoney(account.getBalance() + roundedAmount));
        Account updated = accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountId(accountId)
                .amount(roundedAmount)
                .transactionType("DEPOSIT")
                .description(description)
                .build();
        transactionRepository.save(transaction);

        return updated;
    }

    @Transactional
    public Account withdraw(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Withdrawal amount must be greater than 0.");
        }
        Account account = getAccountById(accountId);
        double roundedAmount = roundMoney(amount);
        if (roundMoney(account.getBalance() - roundedAmount) < 500.00) {
            throw new BadRequestException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }
        account.setBalance(roundMoney(account.getBalance() - roundedAmount));
        Account updated = accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountId(accountId)
                .amount(roundedAmount)
                .transactionType("WITHDRAWAL")
                .description(description)
                .build();
        transactionRepository.save(transaction);

        return updated;
    }

    @Transactional
    public Account transfer(Long fromAccountId, Long toAccountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Transfer amount must be greater than 0.");
        }
        if (fromAccountId.equals(toAccountId)) {
            throw new BadRequestException("Source and recipient accounts must be different.");
        }

        Account fromAccount = getAccountById(fromAccountId);
        Account toAccount = getAccountById(toAccountId);
        double roundedAmount = roundMoney(amount);

        if (roundMoney(fromAccount.getBalance() - roundedAmount) < 500.00) {
            throw new BadRequestException("Insufficient funds. Minimum balance of 500.00 must be maintained.");
        }

        fromAccount.setBalance(roundMoney(fromAccount.getBalance() - roundedAmount));
        toAccount.setBalance(roundMoney(toAccount.getBalance() + roundedAmount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Transaction record for sender (debit)
        String senderDesc = (description != null && !description.trim().isEmpty())
                ? "Sent: " + description
                : "Transfer to Account #" + toAccountId;
        Transaction debitTx = Transaction.builder()
                .accountId(fromAccountId)
                .recipientAccountId(toAccountId)
                .amount(roundedAmount)
                .transactionType("TRANSFER_OUT")
                .description(senderDesc)
                .build();
        transactionRepository.save(debitTx);

        // Transaction record for receiver (credit)
        String receiverDesc = (description != null && !description.trim().isEmpty())
                ? "Received: " + description
                : "Transfer from Account #" + fromAccountId;
        Transaction creditTx = Transaction.builder()
                .accountId(toAccountId)
                .recipientAccountId(fromAccountId)
                .amount(roundedAmount)
                .transactionType("TRANSFER_IN")
                .description(receiverDesc)
                .build();
        transactionRepository.save(creditTx);

        return fromAccount;
    }

    public List<Transaction> getTransactionsForAccount(Long accountId) {
        // Ensure account exists
        getAccountById(accountId);
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }

    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = getAccountById(accountId); // Throws exception if not found
        account.setDeleted(true); // Soft-delete to preserve audit logs
        accountRepository.save(account);
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void fixExistingTransferRecords() {
        List<Transaction> transactions = transactionRepository.findAll();
        for (Transaction tx : transactions) {
            if (tx.getRecipientAccountId() != null) {
                // If partner transaction exists with (ID - 1), tx is the receiver (credit)
                Optional<Transaction> prevTx = transactionRepository.findById(tx.getTransactionId() - 1);
                if (prevTx.isPresent() && prevTx.get().getAccountId().equals(tx.getRecipientAccountId())) {
                    tx.setTransactionType("TRANSFER_IN");
                    if (tx.getDescription() != null && !tx.getDescription().startsWith("Received:") && !tx.getDescription().startsWith("Transfer from")) {
                        tx.setDescription("Received: " + tx.getDescription());
                    }
                    transactionRepository.save(tx);

                    Transaction senderTx = prevTx.get();
                    senderTx.setTransactionType("TRANSFER_OUT");
                    if (senderTx.getDescription() != null && !senderTx.getDescription().startsWith("Sent:") && !senderTx.getDescription().startsWith("Transfer to")) {
                        senderTx.setDescription("Sent: " + senderTx.getDescription());
                    }
                    transactionRepository.save(senderTx);
                }
            }
        }
    }
}
