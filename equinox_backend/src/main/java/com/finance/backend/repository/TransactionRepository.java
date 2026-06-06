package com.finance.backend.repository;

import com.finance.backend.model.Transaction;
import com.finance.backend.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByTypeAndDeletedFalse(TransactionType type);
    List<Transaction> findByCategoryAndDeletedFalse(String category);
    List<Transaction> findByDateBetweenAndDeletedFalse(LocalDate start, LocalDate end);
    List<Transaction> findByCreatedByIdAndDeletedFalse(Long userId);
    List<Transaction> findAllByDeletedFalse();
    Optional<Transaction> findByIdAndDeletedFalse(Long id);
    Page<Transaction> findAllByDeletedFalse(Pageable pageable);

    // User-scoped queries
    Page<Transaction> findByCreatedByIdAndDeletedFalse(Long userId, Pageable pageable);
    Optional<Transaction> findByIdAndCreatedByIdAndDeletedFalse(Long id, Long userId);
    List<Transaction> findByTypeAndCreatedByIdAndDeletedFalse(TransactionType type, Long userId);
    List<Transaction> findByCategoryAndCreatedByIdAndDeletedFalse(String category, Long userId);
    List<Transaction> findByDateBetweenAndCreatedByIdAndDeletedFalse(LocalDate start, LocalDate end, Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND t.deleted = false")
    BigDecimal sumAmountByType(@Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND t.createdBy.id = :userId AND t.deleted = false")
    BigDecimal sumAmountByTypeAndUser(@Param("type") TransactionType type, @Param("userId") Long userId);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.deleted = false AND t.category IS NOT NULL GROUP BY t.category")
    List<Object[]> getCategoryWiseTotals();

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.deleted = false AND t.createdBy.id = :userId AND t.category IS NOT NULL GROUP BY t.category")
    List<Object[]> getCategoryWiseTotalsByUser(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.deleted = false AND t.createdBy.id = :userId AND t.category = :category AND t.date >= :startDate AND t.date <= :endDate")
    BigDecimal sumExpensesByCategoryAndUserAndDateBetween(@Param("category") String category, @Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), COALESCE(SUM(t.amount), 0) " +
           "FROM Transaction t WHERE t.deleted = false AND t.date IS NOT NULL " +
           "GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)")
    List<Object[]> getMonthlyTrends();

    @Query("SELECT EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), COALESCE(SUM(t.amount), 0) " +
           "FROM Transaction t WHERE t.deleted = false AND t.createdBy.id = :userId AND t.date IS NOT NULL " +
           "GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date)")
    List<Object[]> getMonthlyTrendsByUser(@Param("userId") Long userId);

    @Query("SELECT EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), " +
           "COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0) " +
           "FROM Transaction t WHERE t.deleted = false AND t.date IS NOT NULL " +
           "GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date) " +
           "ORDER BY EXTRACT(YEAR FROM t.date) ASC, EXTRACT(MONTH FROM t.date) ASC")
    List<Object[]> getMonthlyNetCashflow();

    @Query("SELECT EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), " +
           "COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0) " +
           "FROM Transaction t WHERE t.deleted = false AND t.createdBy.id = :userId AND t.date IS NOT NULL " +
           "GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date) " +
           "ORDER BY EXTRACT(YEAR FROM t.date) ASC, EXTRACT(MONTH FROM t.date) ASC")
    List<Object[]> getMonthlyNetCashflowByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.deleted = false ORDER BY t.date DESC, t.createdAt DESC")
    List<Transaction> findRecentTransactions(Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.deleted = false AND t.createdBy.id = :userId ORDER BY t.date DESC, t.createdAt DESC")
    List<Transaction> findRecentTransactionsByUser(@Param("userId") Long userId, Pageable pageable);
}