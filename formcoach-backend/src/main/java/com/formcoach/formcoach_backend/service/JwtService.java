package com.formcoach.formcoach_backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    @Value("${JWT_SECRET_KEY}")
    private String secretKey;
    @Value("${JWT_EXPIRATION}")
    private long jwtExpiration;

    public String generateToken(Authentication authentication) {
        String email = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + this.jwtExpiration);

        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(getSigningKey())
                .compact();

        return token;
    }

    /**
     * Method decodes key converting to SecretKey Object used to for both signing and verifying tokens
     * @return
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extract email from token
     * @param token
     * @return
     */
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;

        }
    }

    public long getExpirationTime() {
        return this.jwtExpiration;
    }
}
