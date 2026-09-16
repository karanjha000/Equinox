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

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:noreply.equinox@gmail.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:Equinox OS}")
    private String senderName;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private void sendBrevoEmail(String toEmail, String subject, String htmlContent) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.warn("==========================================================================");
            log.warn("Brevo API Key not configured! Email was NOT sent.");
            log.warn("Subject: {} | To: {}", subject, toEmail);
            log.warn("==========================================================================");
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            Map<String, Object> payload = Map.of(
                    "sender", Map.of("name", senderName, "email", senderEmail),
                    "to", List.of(Map.of("email", toEmail)),
                    "subject", subject,
                    "htmlContent", htmlContent,
                    "replyTo", Map.of("email", "no-reply@equinoxos.com", "name", "Equinox OS")
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForObject(BREVO_API_URL, request, String.class);
            
            log.info("Email [{}] sent securely via Brevo to {}", subject, toEmail);
        } catch (Exception e) {
            log.error("Failed to send email [{}] via Brevo to {}: {}", subject, toEmail, e.getMessage());
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

        sendBrevoEmail(toEmail, "Equinox OS - Password Reset", htmlMessage);
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

        sendBrevoEmail(toEmail, "Equinox OS - Verification Code", htmlMessage);
    }
}
