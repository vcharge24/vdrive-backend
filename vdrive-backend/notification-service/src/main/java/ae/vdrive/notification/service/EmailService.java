package ae.vdrive.notification.service;

import ae.vdrive.notification.dto.InvitationEmailRequest;
import ae.vdrive.notification.dto.SendEmailRequest;

/**
 * Service interface for email operations
 */
public interface EmailService {

    /**
     * Send a generic email using a Thymeleaf template
     *
     * @param request the email request containing recipient, subject, template name and variables
     */
    void sendEmail(SendEmailRequest request);

    /**
     * Send an invitation email to a new user
     *
     * @param request the invitation email request containing user details and activation link
     */
    void sendInvitationEmail(InvitationEmailRequest request);
}
