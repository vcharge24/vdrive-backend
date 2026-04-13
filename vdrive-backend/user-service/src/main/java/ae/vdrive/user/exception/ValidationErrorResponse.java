package ae.vdrive.user.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidationErrorResponse {

    private String message;
    private int status;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> errors;
}
