package com.formcoach.formcoach_backend.responses;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private long expiration;

    public LoginResponse(String token, long expiration) {
        this.token = token;
        this.expiration = expiration;
    }
}
