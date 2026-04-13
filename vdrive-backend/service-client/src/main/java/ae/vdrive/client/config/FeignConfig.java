package ae.vdrive.client.config;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * Configuration for Feign clients
 * Handles request interceptors and error decoding
 */
@Configuration
@Slf4j
public class FeignConfig {

    /**
     * Request interceptor that forwards security headers from the current request context
     * to Feign calls made to other services
     *
     * @return RequestInterceptor instance
     */
    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();

                    // Forward user identity headers
                    String userId = request.getHeader("X-User-Id");
                    if (userId != null && !userId.isEmpty()) {
                        template.header("X-User-Id", userId);
                    }

                    String userEmail = request.getHeader("X-User-Email");
                    if (userEmail != null && !userEmail.isEmpty()) {
                        template.header("X-User-Email", userEmail);
                    }

                    String userRoles = request.getHeader("X-User-Roles");
                    if (userRoles != null && !userRoles.isEmpty()) {
                        template.header("X-User-Roles", userRoles);
                    }

                    log.debug("Forwarding headers for user: {}", userId);
                }
            } catch (IllegalStateException e) {
                // RequestContextHolder will throw IllegalStateException if called outside of a servlet context
                log.debug("Not in servlet request context, skipping header forwarding");
            }
        };
    }

    /**
     * Custom error decoder for mapping HTTP status codes to exceptions
     *
     * @return ErrorDecoder instance
     */
    @Bean
    public ErrorDecoder errorDecoder() {
        return new FeignErrorDecoder();
    }
}
