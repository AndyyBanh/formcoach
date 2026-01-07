package com.formcoach.formcoach_backend.security;

import com.formcoach.formcoach_backend.service.RateLimitService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RateLimitFilter implements Filter {
    private final RateLimitService rateLimitService;

    @Autowired
    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        if (httpRequest.getRequestURI().startsWith("/api/v1/auth") && httpRequest.getMethod().equals("POST")) {
            String ipAddress = this.getClientIp(httpRequest);
            Bucket bucket =  this.rateLimitService.resolveBucket(ipAddress);

            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

            if (probe.isConsumed()) {
                httpResponse.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
                filterChain.doFilter(request, response);
            } else {
                long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"message\": \"Too many requests. Please try again in " + waitForRefill + " seconds.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }

    }

    private String getClientIp(HttpServletRequest httpRequest) {
        String xfHeader = httpRequest.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            xfHeader = httpRequest.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
