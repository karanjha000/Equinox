package com.finance.backend.config;

import com.finance.backend.enums.Role;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import com.finance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.password:#{null}}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            
            String passwordToUse = defaultAdminPassword;
            if (passwordToUse == null || passwordToUse.isBlank()) {
                passwordToUse = UUID.randomUUID().toString().substring(0, 10);
                log.warn("=========================================================");
                log.warn("NO ADMIN PASSWORD CONFIGURED (admin.default.password)!");
                log.warn("Default Admin account created with password: {}", passwordToUse);
                log.warn("PLEASE LOG IN AND CHANGE IT IMMEDIATELY.");
                log.warn("=========================================================");
            }
            
            admin.setPassword(passwordEncoder.encode(passwordToUse));
            admin.setEmail("admin@equinox.com");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);

            Random random = new Random();
            List<Transaction> transactions = new ArrayList<>();
            
            // Generate transactions for the last 12 months
            LocalDate startDate = LocalDate.now().minusMonths(12).withDayOfMonth(1);
            LocalDate endDate = LocalDate.now();

            String[] expenseCategories = {"Food", "Transport", "Utilities", "Entertainment", "Shopping", "Healthcare"};
            String[] incomeCategories = {"Salary", "Investment", "Bonus", "Freelance"};

            for (LocalDate date = startDate; date.isBefore(endDate.plusDays(1)); date = date.plusDays(1)) {
                // 30% chance of a transaction on any given day
                if (random.nextDouble() < 0.3) {
                    Transaction t = new Transaction();
                    t.setCreatedBy(admin);
                    t.setDate(date);
                    t.setNotes("Generated test data");
                    
                    // 20% chance of income, 80% expense
                    if (random.nextDouble() < 0.2) {
                        t.setType(TransactionType.INCOME);
                        t.setCategory(incomeCategories[random.nextInt(incomeCategories.length)]);
                        // Income between 10,000 and 100,000
                        t.setAmount(BigDecimal.valueOf(10000 + random.nextInt(90000)));
                    } else {
                        t.setType(TransactionType.EXPENSE);
                        t.setCategory(expenseCategories[random.nextInt(expenseCategories.length)]);
                        // Expense between 500 and 5000
                        t.setAmount(BigDecimal.valueOf(500 + random.nextInt(4500)));
                    }
                    transactions.add(t);
                }
            }
            // Add a steady salary on the 1st of every month
            for(int i=0; i<=12; i++) {
                LocalDate salaryDate = LocalDate.now().minusMonths(i).withDayOfMonth(1);
                if(!salaryDate.isBefore(startDate)) {
                    Transaction t = new Transaction();
                    t.setCreatedBy(admin);
                    t.setDate(salaryDate);
                    t.setNotes("Monthly Salary");
                    t.setType(TransactionType.INCOME);
                    t.setCategory("Salary");
                    t.setAmount(BigDecimal.valueOf(120000));
                    transactions.add(t);
                }
            }

            transactionRepository.saveAll(transactions);
            log.info("Test data seeded successfully.");
        }
    }
}
