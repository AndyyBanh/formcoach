package com.formcoach.formcoach_backend.security;

import com.formcoach.formcoach_backend.models.UserEntity;
import com.formcoach.formcoach_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor for dependency injection
    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Method from UserDetailService loadUserByUsername
     * Repurposed to return a user that is found my email in DB
     * @param email
     * @return User since Spring Security works with predefined User object and not our entities
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find user by looking up email in DB if it does not exist throw exception
        UserEntity user = this.userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(user.getEmail(), user.getPassword(), Collections.emptyList());
    }
}
