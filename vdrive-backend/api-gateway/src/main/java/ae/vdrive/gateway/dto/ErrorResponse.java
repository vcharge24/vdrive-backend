package ae.vdrive.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Standard error response DTO for API Gateway.
 *
 * Provides consistent error information to API clients:
 * - HTTP status code
 * - Error message
 * - Timestamp of the error
 */
public class ErrorResponse {

    @JsonProperty("status")
    private int status;

    @JsonProperty("message")
    private String message;

    @JsonProperty("timestamp")
    private long timestamp;

    public ErrorResponse() {
    }

    /**
     * Constructs an ErrorResponse with status, message, and timestamp.
     *
     * @param status the HTTP status code
     * @param message the error message
     * @param timestamp the timestamp when the error occurred
     */
    public ErrorResponse(int status, String message, long timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
            "status=" + status +
            ", message='" + message + '\'' +
            ", timestamp=" + timestamp +
            '}';
    }

}
