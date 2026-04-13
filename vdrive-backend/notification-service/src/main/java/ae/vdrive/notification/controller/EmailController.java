package ae.vdrive.notification.controller;

import ae.vdrive.notification.dto.EmailResponse;
import ae.vdrive.notification.dto.InvitationEmailRequest;
import ae.vdrive.notification.dto.SendEmailRequest;
import ae.vdrive.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

/**
 * REST Controller for email operations
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    /**
     * Send a generic email
     *
     * @param request the email request
     * @return response entity with success status
     */
    @PostMapping("/email")
    public ResponseEntity<EmailResponse> sendEmail(@RequestBody SendEmailRequest request) {
        try {
            log.info("Received email request for: {}", request.getTo());
            emailService.sendEmail(request);

            EmailResponse response = EmailResponse.builder()
                    .success(true)
                    .message("Email sent successfully")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error sending email", e);
            EmailResponse response = EmailResponse.builder()
                    .success(false)
                    .message("Failed to send email: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Send an invitation email
     *
     * @param request the invitation email request
     * @return response entity with success status
     */
    @PostMapping("/email/invitation")
    public ResponseEntity<EmailResponse> sendInvitationEmail(@RequestBody InvitationEmailRequest request) {
        try {
            log.info("Received invitation email request for: {}", request.getTo());
            emailService.sendInvitationEmail(request);

            EmailResponse response = EmailResponse.builder()
                    .success(true)
                    .message("Invitation email sent successfully")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error sending invitation email", e);
            EmailResponse response = EmailResponse.builder()
                    .success(false)
                    .message("Failed to send invitation email: " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
