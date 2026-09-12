package com.finance.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class DatabaseKeepAliveService {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseKeepAliveService.class);
    
    private final JdbcTemplate jdbcTemplate;

    public DatabaseKeepAliveService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Executes a lightweight dummy query every 4 minutes (240,000 ms) 
     * to prevent the Neon database from auto-suspending on the free tier 
     * (which happens after 5 minutes of inactivity).
     * 
     * This is a read-only query that consumes zero I/O and prevents cold starts.
     */
    @Scheduled(fixedRate = 240000)
    public void pingDatabase() {
        try {
            logger.debug("Executing database keep-alive ping...");
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                logger.debug("Database keep-alive ping successful.");
            }
        } catch (Exception e) {
            logger.warn("Database keep-alive ping failed: {}", e.getMessage());
        }
    }
}
