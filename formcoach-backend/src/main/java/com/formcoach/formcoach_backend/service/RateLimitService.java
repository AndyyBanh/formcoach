package com.formcoach.formcoach_backend.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {
    private final Map<String, Bucket> ipBuckets = new ConcurrentHashMap<>();

    public Bucket createNewBucket(String ipAddress) {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(1, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public Bucket resolveBucket(String ipAddress) {
        return ipBuckets.computeIfAbsent(ipAddress, (ip) -> this.createNewBucket(ip));
    }

}
