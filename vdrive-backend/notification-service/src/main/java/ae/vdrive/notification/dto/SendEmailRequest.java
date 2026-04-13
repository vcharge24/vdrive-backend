package ae.vdrive.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Request DTO for sending generic email
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendEmailRequest {
    /**
     * Recipient email address
     */
    private String to;

    /**
     * Email subject line
     */
    private String subject;

    /**
     * Name of the Thymeleaf template to use
     */
    private String templateName;

    /**
     * Variables to pass to the template for rendering
     */
    private Map<String, Object> templateVariables;
}
