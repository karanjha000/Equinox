package com.finance.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
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

        if (mailHost == null || mailHost.isBlank()) {
            log.warn("==========================================================================");
            log.warn("SMTP credentials not configured! Email was NOT sent.");
            log.warn("Password Reset Link for {}: {}", toEmail, resetUrl);
            log.warn("==========================================================================");
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("Equinox OS - Password Reset");
            helper.setText(htmlMessage, true);
            helper.setFrom(new InternetAddress("no-reply@equinoxos.com", "Equinox OS"));
            
            mailSender.send(mimeMessage);
            log.info("Password reset HTML email sent securely to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }
}
