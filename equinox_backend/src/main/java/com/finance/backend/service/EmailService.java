package com.finance.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.host:#{null}}")
    private String mailHost;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String message = "You have requested a password reset. Click the link below to reset your password:\n\n" 
                + resetUrl + "\n\nThis link will expire in 15 minutes.";

        if (mailHost == null || mailHost.isBlank()) {
            log.warn("==========================================================================");
            log.warn("SMTP credentials not configured! Email was NOT sent.");
            log.warn("Password Reset Link for {}: {}", toEmail, resetUrl);
            log.warn("==========================================================================");
            return;
        }

        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(toEmail);
            email.setSubject("Equinox - Password Reset Request");
            email.setText(message);
            email.setFrom("noreply@equinox.com");
            mailSender.send(email);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }
}
