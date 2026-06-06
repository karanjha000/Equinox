package com.finance.backend.service;

import com.finance.backend.dto.AuthResponse;
import com.finance.backend.dto.LoginRequest;
import com.finance.backend.dto.RegisterRequest;
import com.finance.backend.dto.UserResponse;
import com.finance.backend.enums.Role;
import com.finance.backend.model.User;
import com.finance.backend.repository.UserRepository;
import com.finance.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public UserResponse register(RegisterRequest request){
        if (userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(Role.VIEWER);
        user.setActive(true);

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword())
                );
                User user = userRepository.findByUsername(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                String token = jwtUtil.generateToken(user.getUsername(),user.getRole().name());

                return new AuthResponse(token, user.getUsername(), user.getRole().name());

    }


    public UserResponse mapToResponse(User user){
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole().name());
        userResponse.setActive(user.isActive());
        return userResponse;
    }
}
















