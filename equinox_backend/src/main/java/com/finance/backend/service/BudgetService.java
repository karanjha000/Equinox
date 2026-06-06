package com.finance.backend.service;

import com.finance.backend.dto.BudgetProgressResponse;
import com.finance.backend.dto.BudgetRequest;
import com.finance.backend.dto.BudgetResponse;
import com.finance.backend.model.Budget;
import com.finance.backend.model.User;
import com.finance.backend.repository.BudgetRepository;
import com.finance.backend.repository.TransactionRepository;
import com.finance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional
    public BudgetResponse upsertBudget(BudgetRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findByUserIdAndCategory(user.getId(), request.getCategory())
                .orElse(new Budget());

        budget.setCategory(request.getCategory());
        budget.setAmountLimit(request.getAmountLimit());
        budget.setUser(user);

        return mapToResponse(budgetRepository.save(budget));
    }

    public List<BudgetResponse> getAllBudgets(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBudget(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this budget");
        }

        budgetRepository.delete(budget);
    }

    public List<BudgetProgressResponse> getBudgetProgress(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Budget> budgets = budgetRepository.findByUserId(user.getId());

        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        return budgets.stream().map(budget -> {
            BigDecimal spent = transactionRepository.sumExpensesByCategoryAndUserAndDateBetween(
                    budget.getCategory(), user.getId(), startDate, endDate
            );

            double percentage = 0.0;
            if (budget.getAmountLimit().compareTo(BigDecimal.ZERO) > 0) {
                percentage = spent.divide(budget.getAmountLimit(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100")).doubleValue();
            }

            return new BudgetProgressResponse(
                    budget.getId(),
                    budget.getCategory(),
                    budget.getAmountLimit(),
                    spent,
                    percentage
            );
        }).collect(Collectors.toList());
    }

    private BudgetResponse mapToResponse(Budget budget) {
        BudgetResponse response = new BudgetResponse();
        response.setId(budget.getId());
        response.setCategory(budget.getCategory());
        response.setAmountLimit(budget.getAmountLimit());
        response.setCreatedAt(budget.getCreatedAt());
        return response;
    }
}
