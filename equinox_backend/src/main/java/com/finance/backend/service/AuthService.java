package com.finance.backend.service;

import com.finance.backend.dto.AuthResponse;
import com.finance.backend.dto.LoginRequest;
import com.finance.backend.dto.RegisterRequest;
import com.finance.backend.dto.UserResponse;
import com.finance.backend.enums.Role;
import com.finance.backend.model.User;
import com.finance.backend.repository.UserRepository;
import com.finance.backend.repository.RevokedTokenRepository;
import com.finance.backend.repository.PasswordResetTokenRepository;
import com.finance.backend.repository.RegistrationOtpRepository;
import com.finance.backend.model.RevokedToken;
import com.finance.backend.model.PasswordResetToken;
import com.finance.backend.model.RegistrationOtp;
import com.finance.backend.security.JwtUtil;
import java.util.Date;
import java.util.UUID;
import java.util.Random;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RegistrationOtpRepository registrationOtpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void sendRegistrationOtp(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        // Generate 6 digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Fetch existing or create new to avoid Hibernate insert-before-delete unique constraint violation
        RegistrationOtp registrationOtp = registrationOtpRepository.findByEmail(email)
                .orElse(new RegistrationOtp());
                
        registrationOtp.setEmail(email);
        registrationOtp.setOtp(otp);
        registrationOtp.setExpiryDate(new Date(System.currentTimeMillis() + 2 * 60 * 1000)); // 2 minutes
        
        registrationOtpRepository.save(registrationOtp);
        emailService.sendRegistrationOtpEmail(email, otp);
    }

    @Transactional
    public UserResponse register(RegisterRequest request){
        if (userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        RegistrationOtp registrationOtp = registrationOtpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No OTP requested for this email"));
                
        if (registrationOtp.getExpiryDate().before(new Date())) {
            registrationOtpRepository.delete(registrationOtp);
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        
        if (!registrationOtp.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(Role.VIEWER);
        user.setActive(true);

        User saved = userRepository.save(user);
        
        // Clean up OTP
        registrationOtpRepository.delete(registrationOtp);
        
        return mapToResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword())
                );
                User user = userRepository.findByUsername(request.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if (!user.isActive()) {
                    throw new RuntimeException("Your account is deactivated. Please contact an admin.");
                }

                String token = jwtUtil.generateToken(user.getUsername(),user.getRole().name());

                return new AuthResponse(token, user.getUsername(), user.getRole().name());

    }

    public void logout(String token) {
        if (!revokedTokenRepository.existsByToken(token)) {
            RevokedToken revokedToken = new RevokedToken();
            revokedToken.setToken(token);
            revokedToken.setRevokedAt(new Date());
            revokedTokenRepository.save(revokedToken);
        }
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email address."));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if (resetToken.getExpiryDate().before(new Date())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Password reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.deleteByUser(user);
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
















