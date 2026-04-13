package ae.vdrive.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for generic email requests
 * Shared across microservices for sending emails via notification service
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequestDto {
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
     * Template variables for rendering (key-value pairs)
     */
    private Map<String, Object> templateVariables;
}
