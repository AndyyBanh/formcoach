package com.formcoach.formcoach_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterUserDto {
    private String email;
    private String password;

}
