package com.formcoach.formcoach_backend.responses;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private long expiration;
    private String userId; // user email

    public LoginResponse(String token, long expiration, String userId) {
        this.token = token;
        this.expiration = expiration;
        this.userId = userId;
    }
}
