package ae.vdrive.client.notification;

import ae.vdrive.client.config.FeignConfig;
import ae.vdrive.client.dto.EmailRequestDto;
import ae.vdrive.client.dto.InvitationEmailDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client for Notification Service
 * Provides REST client methods to interact with the notification-service microservice
 */
@FeignClient(name = "notification-service", configuration = FeignConfig.class)
public interface NotificationServiceClient {

    /**
     * Send a generic email using a Thymeleaf template
     *
     * @param request the email request containing recipient, subject, template name and variables
     */
    @PostMapping("/api/v1/notifications/email")
    void sendEmail(@RequestBody EmailRequestDto request);

    /**
     * Send an invitation email to a new user
     *
     * @param request the invitation email request containing user details and activation link
     */
    @PostMapping("/api/v1/notifications/email/invitation")
    void sendInvitationEmail(@RequestBody InvitationEmailDto request);
}
