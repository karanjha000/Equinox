package com.finance.backend.service;

import com.finance.backend.dto.TransactionRequest;
import com.finance.backend.dto.TransactionResponse;
import com.finance.backend.enums.Role;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import com.finance.backend.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionResponse create(TransactionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());
        transaction.setCreatedBy(user);

        return mapToResponse(transactionRepository.save(transaction));
    }

    public List<TransactionResponse> getAll(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            transactions = transactionRepository.findAllByDeletedFalse();
        } else {
            transactions = transactionRepository.findByCreatedByIdAndDeletedFalse(user.getId());
        }

        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (user.getRole() != com.finance.backend.enums.Role.ADMIN && !transaction.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this transaction");
        }

        return mapToResponse(transaction);
    }

    public Page<TransactionResponse> getAllPaged(int page, int size,
                                                  TransactionType type, String category,
                                                  LocalDate startDate, LocalDate endDate,
                                                  String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending().and(Sort.by("createdAt").descending()));

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude soft-deleted records
            predicates.add(cb.equal(root.get("deleted"), false));

            // User isolation: non-admin users only see their own transactions
            if (user.getRole() != Role.ADMIN) {
                predicates.add(cb.equal(root.get("createdBy").get("id"), user.getId()));
            }

            // Optional type filter
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Optional category filter
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            // Optional date range filters
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return transactionRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    public TransactionResponse update(Long id, TransactionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (user.getRole() != com.finance.backend.enums.Role.ADMIN && !transaction.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this transaction");
        }

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());

        return mapToResponse(transactionRepository.save(transaction));
    }

    public void delete(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (user.getRole() != com.finance.backend.enums.Role.ADMIN && !transaction.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this transaction");
        }

        transaction.setDeleted(true);
        transactionRepository.save(transaction);
    }

    public List<TransactionResponse> filterByType(TransactionType type, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            transactions = transactionRepository.findByTypeAndDeletedFalse(type);
        } else {
            transactions = transactionRepository.findByTypeAndCreatedByIdAndDeletedFalse(type, user.getId());
        }

        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> filterByCategory(String category, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            transactions = transactionRepository.findByCategoryAndDeletedFalse(category);
        } else {
            transactions = transactionRepository.findByCategoryAndCreatedByIdAndDeletedFalse(category, user.getId());
        }

        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> filterByDateRange(LocalDate start, LocalDate end, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Transaction> transactions;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            transactions = transactionRepository.findByDateBetweenAndDeletedFalse(start, end);
        } else {
            transactions = transactionRepository.findByDateBetweenAndCreatedByIdAndDeletedFalse(start, end, user.getId());
        }

        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public byte[] exportTransactionsToCSV(TransactionType type, String category,
                                          LocalDate startDate, LocalDate endDate,
                                          String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always exclude soft-deleted records
            predicates.add(cb.equal(root.get("deleted"), false));

            // User isolation: non-admin users only see their own transactions
            if (user.getRole() != Role.ADMIN) {
                predicates.add(cb.equal(root.get("createdBy").get("id"), user.getId()));
            }

            // Optional type filter
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Optional category filter
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            // Optional date range filters
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Transaction> transactions = transactionRepository.findAll(spec, Sort.by("date").descending().and(Sort.by("createdAt").descending()));

        StringBuilder csvContent = new StringBuilder();
        // UTF-8 BOM for Microsoft Excel compatibility
        csvContent.append("\uFEFF");
        // Header
        csvContent.append("Date,Type,Category,Amount,Created By,Notes\n");

        for (Transaction tx : transactions) {
            csvContent.append(tx.getDate()).append(",")
                    .append(tx.getType()).append(",")
                    .append(escapeCsvField(tx.getCategory())).append(",")
                    .append(tx.getAmount()).append(",")
                    .append(escapeCsvField(tx.getCreatedBy().getUsername())).append(",")
                    .append(escapeCsvField(tx.getNotes())).append("\n");
        }

        return csvContent.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String escapeCsvField(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\n") || escaped.contains("\"")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    public TransactionResponse mapToResponse(Transaction t) {
        TransactionResponse response = new TransactionResponse();
        response.setId(t.getId());
        response.setAmount(t.getAmount());
        response.setType(t.getType());
        response.setCategory(t.getCategory());
        response.setDate(t.getDate());
        response.setNotes(t.getNotes());
        response.setCreatedBy(t.getCreatedBy().getUsername());
        response.setCreatedAt(t.getCreatedAt());
        return response;
    }
}