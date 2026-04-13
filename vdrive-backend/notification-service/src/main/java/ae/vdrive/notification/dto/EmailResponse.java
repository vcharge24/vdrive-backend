package ae.vdrive.notification.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for email operations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailResponse {
    /**
     * Whether the email was sent successfully
     */
    private boolean success;

    /**
     * Response message
     */
    private String message;

    /**
     * Timestamp of the response
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
}
