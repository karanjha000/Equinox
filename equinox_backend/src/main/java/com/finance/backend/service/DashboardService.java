package com.finance.backend.service;

import com.finance.backend.dto.TransactionResponse;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import com.finance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BigDecimal getTotalIncome(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            return transactionRepository.sumAmountByType(TransactionType.INCOME);
        } else {
            return transactionRepository.sumAmountByTypeAndUser(TransactionType.INCOME, user.getId());
        }
    }
    public BigDecimal getTotalExpenses(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            return transactionRepository.sumAmountByType(TransactionType.EXPENSE);
        } else {
            return transactionRepository.sumAmountByTypeAndUser(TransactionType.EXPENSE, user.getId());
        }
    }

    public BigDecimal getNetBalance(String username){
        return getTotalIncome(username).subtract(getTotalExpenses(username));
    }

    public Map<String, BigDecimal> getCategoryWiseTotals(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Object[]> results;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            results = transactionRepository.getCategoryWiseTotals();
        } else {
            results = transactionRepository.getCategoryWiseTotalsByUser(user.getId());
        }
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        for (Object[] row : results) {
            totals.put((String) row[0], (BigDecimal) row[1]);
        }
        return totals;
    }

    public List<TransactionResponse> getRecentTransactions(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Transaction> transactions;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            transactions = transactionRepository.findRecentTransactions(org.springframework.data.domain.PageRequest.of(0, 8));
        } else {
            transactions = transactionRepository.findRecentTransactionsByUser(user.getId(), org.springframework.data.domain.PageRequest.of(0, 8));
        }
        return transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, BigDecimal> getMonthlyTrends(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Object[]> results;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            results = transactionRepository.getMonthlyTrends();
        } else {
            results = transactionRepository.getMonthlyTrendsByUser(user.getId());
        }
        Map<String, BigDecimal> trends = new LinkedHashMap<>();
        for (Object[] row : results) {
            if (row[0] != null && row[1] != null) {
                int year = ((Number) row[0]).intValue();
                int month = ((Number) row[1]).intValue();
                BigDecimal sum = (BigDecimal) row[2];
                String monthName = java.time.Month.of(month).name();
                trends.put(monthName + "-" + year, sum);
            }
        }
        return trends;
    }

    public Map<String, BigDecimal> getNetWorthTrends(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Object[]> results;
        if (user.getRole() == com.finance.backend.enums.Role.ADMIN) {
            results = transactionRepository.getMonthlyNetCashflow();
        } else {
            results = transactionRepository.getMonthlyNetCashflowByUser(user.getId());
        }
        Map<String, BigDecimal> trends = new LinkedHashMap<>();
        BigDecimal cumulative = BigDecimal.ZERO;
        for (Object[] row : results) {
            if (row[0] != null && row[1] != null) {
                int year = ((Number) row[0]).intValue();
                int month = ((Number) row[1]).intValue();
                BigDecimal monthlyNet = (BigDecimal) row[2];
                if (monthlyNet == null) {
                    monthlyNet = BigDecimal.ZERO;
                }
                cumulative = cumulative.add(monthlyNet);
                String monthName = java.time.Month.of(month).name();
                trends.put(monthName + "-" + year, cumulative);
            }
        }
        return trends;
    }

    public Map<String,Object> getSummary(String username){
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalIncome", getTotalIncome(username));
        summary.put("totalExpenses", getTotalExpenses(username));
        summary.put("netBalance", getNetBalance(username));
        summary.put("categoryWiseTotals", getCategoryWiseTotals(username));
        summary.put("monthlyTrends", getMonthlyTrends(username));
        summary.put("netWorthTrends", getNetWorthTrends(username));
        summary.put("recentTransactions", getRecentTransactions(username));
        return summary;
    }

    private TransactionResponse mapToResponse(Transaction t) {
        TransactionResponse response = new TransactionResponse();
        response.setId(t.getId());
        response.setAmount(t.getAmount());
        response.setType(t.getType());
        response.setCategory(t.getCategory());
        response.setDate(t.getDate());
        response.setNotes(t.getNotes());
        response.setCreatedBy(t.getCreatedBy() != null ? t.getCreatedBy().getUsername() : "System");
        response.setCreatedAt(t.getCreatedAt());
        return response;
    }

}
