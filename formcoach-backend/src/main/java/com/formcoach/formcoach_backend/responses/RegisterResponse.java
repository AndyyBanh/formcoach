package com.formcoach.formcoach_backend.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterResponse {
    private Long id;
    private String email;

    // Do not want to return passwords in Controller so we use Response DTOs
    public RegisterResponse(Long id, String email) {
        this.id = id;
        this.email = email;
    }
}
