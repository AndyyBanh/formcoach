package com.formcoach.formcoach_backend.controller;

import com.formcoach.formcoach_backend.dto.LoginUserDto;
import com.formcoach.formcoach_backend.dto.RegisterUserDto;
import com.formcoach.formcoach_backend.responses.LoginResponse;
import com.formcoach.formcoach_backend.responses.RegisterResponse;
import com.formcoach.formcoach_backend.service.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterUserDto registerUserDto) {
        RegisterResponse response = this.authenticationService.signup(registerUserDto);
        // Return status Created and response object as JSON
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {
        LoginResponse response = this.authenticationService.login(loginUserDto);
        return ResponseEntity.ok(response);
    }


}
