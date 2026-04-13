package ae.vdrive.client.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Custom Feign error decoder that maps HTTP status codes to appropriate exceptions
 */
@Slf4j
public class FeignErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder delegate = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Feign client error - Method: {}, Status: {}", methodKey, response.status());

        String body = extractResponseBody(response);
        String errorMessage = String.format("Service call failed: %s - Status: %d - Body: %s",
                methodKey, response.status(), body);

        switch (response.status()) {
            case 400:
                return new BadRequestException(errorMessage);
            case 401:
                return new UnauthorizedException(errorMessage);
            case 403:
                return new ForbiddenException(errorMessage);
            case 404:
                return new ResourceNotFoundException(errorMessage);
            case 409:
                return new ConflictException(errorMessage);
            case 500:
            case 502:
            case 503:
                return new ServiceUnavailableException(errorMessage);
            default:
                return delegate.decode(methodKey, response);
        }
    }

    /**
     * Extract response body as string for logging and error messages
     *
     * @param response the Feign response
     * @return response body as string, or empty string if unavailable
     */
    private String extractResponseBody(Response response) {
        try {
            if (response.body() != null) {
                byte[] bodyBytes = getBytes(response.body());
                return new String(bodyBytes, StandardCharsets.UTF_8);
            }
        } catch (IOException e) {
            log.debug("Unable to extract response body", e);
        }
        return "";
    }

    /**
     * Get all bytes from an InputStream
     *
     * @param body the InputStream (response body)
     * @return byte array
     * @throws IOException if reading fails
     */
    private byte[] getBytes(Response.Body body) throws IOException {
        return body.asInputStream().readAllBytes();
    }

    /**
     * Exception for bad request (HTTP 400)
     */
    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String message) {
            super(message);
        }
    }

    /**
     * Exception for unauthorized (HTTP 401)
     */
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    /**
     * Exception for forbidden (HTTP 403)
     */
    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException(String message) {
            super(message);
        }
    }

    /**
     * Exception for resource not found (HTTP 404)
     */
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    /**
     * Exception for conflict (HTTP 409)
     */
    public static class ConflictException extends RuntimeException {
        public ConflictException(String message) {
            super(message);
        }
    }

    /**
     * Exception for service unavailable (HTTP 5xx)
     */
    public static class ServiceUnavailableException extends RuntimeException {
        public ServiceUnavailableException(String message) {
            super(message);
        }
    }
}
