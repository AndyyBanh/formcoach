package com.formcoach.formcoach_backend.security;

import com.formcoach.formcoach_backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

/**
 * Validates JWT tokens and sets authentication in security context
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final HandlerExceptionResolver handlerExceptionResolver;

    @Autowired
    public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService, HandlerExceptionResolver handlerExceptionResolver) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    /**
     * Link in security filter chain before reaching controllers check if token within header
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT validation for authentication endpoints
        String path = request.getRequestURI();
        if (path.startsWith("/api/v1/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // Return early if no token or doesn't start with Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract JWT token and user email
            final String jwt = authHeader.substring(7);
            final String email = this.jwtService.getUsernameFromJWT(jwt);

            // Get current authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // If email exists and authentication not set yet
            if (email != null && authentication == null) {
                UserDetails user = userDetailsService.loadUserByUsername(email);

                if (this.jwtService.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user,
                            null,
                            user.getAuthorities());

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            this.handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
