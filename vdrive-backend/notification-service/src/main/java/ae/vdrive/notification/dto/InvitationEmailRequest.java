package ae.vdrive.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sending invitation email
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationEmailRequest {
    /**
     * Recipient email address
     */
    private String to;

    /**
     * Name of the user being invited
     */
    private String userName;

    /**
     * Name of the user sending the invitation
     */
    private String inviterName;

    /**
     * Name of the company
     */
    private String companyName;

    /**
     * Account activation link with token
     */
    private String activationLink;
}
