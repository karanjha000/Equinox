package com.finance.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${google.script.url:https://script.google.com/macros/s/AKfycbyU72F_uEclZUPSyVRp5aRjSwzCpFHVpmipuKtjCNSD7VwozjMIzl9_byS44j-QSA3YCg/exec}")
    private String googleScriptUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private void sendGoogleScriptEmail(String toEmail, String subject, String htmlContent) {
        if (googleScriptUrl == null || googleScriptUrl.isBlank()) {
            log.warn("==========================================================================");
            log.warn("Google Script URL not configured! Email was NOT sent.");
            log.warn("Subject: {} | To: {}", subject, toEmail);
            log.warn("==========================================================================");
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            Map<String, Object> payload = Map.of(
                    "to", toEmail,
                    "subject", subject,
                    "htmlBody", htmlContent
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            // We use String.class for response since the Apps Script returns a simple JSON string
            restTemplate.postForObject(googleScriptUrl, request, String.class);
            
            log.info("Email [{}] sent securely via Google Apps Script to {}", subject, toEmail);
        } catch (Exception e) {
            log.error("Failed to send email [{}] via Google Apps Script to {}: {}", subject, toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;\">"
                + "<h2 style=\"color: #080d1a;\">Password Reset Request</h2>"
                + "<p>Hello,</p>"
                + "<p>You have requested to reset your password for your <strong>Equinox OS</strong> account. "
                + "Please click the button below to set a new password. This link is valid for 15 minutes.</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<a href=\"" + resetUrl + "\" style=\"background-color: #f5a623; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;\">Reset Password</a>"
                + "</div>"
                + "<p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>"
                + "<p>Best regards,<br/>The Equinox OS Team</p>"
                + "</div>";

        sendGoogleScriptEmail(toEmail, "Equinox OS - Password Reset", htmlMessage);
    }

    @Async
    public void sendRegistrationOtpEmail(String toEmail, String otp) {
        String htmlMessage = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;\">"
                + "<h2 style=\"color: #080d1a;\">Verify your Email Address</h2>"
                + "<p>Hello,</p>"
                + "<p>Thank you for registering with <strong>Equinox OS</strong>! Please use the following 6-digit verification code to complete your registration.</p>"
                + "<div style=\"text-align: center; margin: 30px 0;\">"
                + "<span style=\"display: inline-block; background-color: #f1f5f9; color: #0f172a; padding: 16px 32px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 4px; border: 2px dashed #94a3b8;\">" + otp + "</span>"
                + "</div>"
                + "<p>This code is valid for <strong>2 minutes</strong>. If you did not request this code, you can safely ignore this email.</p>"
                + "<p>Best regards,<br/>The Equinox OS Team</p>"
                + "</div>";

        sendGoogleScriptEmail(toEmail, "Equinox OS - Verification Code", htmlMessage);
    }
}
