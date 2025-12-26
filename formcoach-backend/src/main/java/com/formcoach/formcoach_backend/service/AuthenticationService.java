package com.formcoach.formcoach_backend.service;

import com.formcoach.formcoach_backend.dto.LoginUserDto;
import com.formcoach.formcoach_backend.dto.RegisterUserDto;
import com.formcoach.formcoach_backend.expections.UserAlreadyExistsException;
import com.formcoach.formcoach_backend.models.UserEntity;
import com.formcoach.formcoach_backend.repository.UserRepository;
import com.formcoach.formcoach_backend.responses.LoginResponse;
import com.formcoach.formcoach_backend.responses.RegisterResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    // Since we created beans in Spring Context in Security config no need to instantiate SecurityConfig object and call beans that way
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthenticationService(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse signup(RegisterUserDto input) {
        // check if email already exists if so throw exception
        if (this.userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }

        // else create UserEntity and use setters to set its fields same as input parameter
        UserEntity user = new UserEntity(); // calling constructor automatically generates id
        user.setEmail(input.getEmail());
        user.setPassword(this.passwordEncoder.encode(input.getPassword()));

        // save UserEntity to DB
        this.userRepository.save(user);

        // create RegisterResponse object and set its only fields (id and email) to that of UserEntity and return Response DTO
        return new RegisterResponse(user.getId(), user.getEmail());
    }

    public LoginResponse login(LoginUserDto input) {
        UserEntity user = this.userRepository.findByEmail(input.getEmail()).orElseThrow(() -> new UsernameNotFoundException(("User not found")));

        Authentication authentication = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
        String jwtToken = this.jwtService.generateToken(authentication);

        return new LoginResponse(jwtToken, this.jwtService.getExpirationTime());
    }
}
