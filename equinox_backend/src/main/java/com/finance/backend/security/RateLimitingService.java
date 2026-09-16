package com.finance.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ipAddress, String action) {
        String key = ipAddress + "-" + action;
        return cache.computeIfAbsent(key, k -> newBucket(action));
    }

    private Bucket newBucket(String action) {
        if ("forgot-password".equals(action)) {
            // 3 requests per 24 hour for forgot password
            Bandwidth limit = Bandwidth.classic(3, Refill.greedy(3, Duration.ofMinutes(1440)));
            return Bucket.builder().addLimit(limit).build();
        } else {
            // 10 requests per minute for general auth
            Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        }
    }
}
