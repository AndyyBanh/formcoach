package com.formcoach.formcoach_backend.config;

import com.formcoach.formcoach_backend.security.RateLimitFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<RateLimitFilter> rateLimitFilters(RateLimitFilter filter) {
        FilterRegistrationBean<RateLimitFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/api/v1/auth/*");
        registrationBean.setOrder(1);
        return registrationBean;
    }
}
