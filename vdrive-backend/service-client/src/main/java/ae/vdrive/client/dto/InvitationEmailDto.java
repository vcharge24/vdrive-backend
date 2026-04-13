package ae.vdrive.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for invitation email requests
 * Shared across microservices for sending invitation emails via notification service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationEmailDto {
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
