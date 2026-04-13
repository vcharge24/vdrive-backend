package ae.vdrive.gateway.filter;

import ae.vdrive.gateway.dto.ErrorResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * JWT Authentication Gateway Filter for Spring Cloud Gateway.
 *
 * Intercepts incoming requests to:
 * - Extract Bearer token from Authorization header
 * - Validate JWT signature and expiration
 * - Extract user information (userId, email, roles) from claims
 * - Add X-User-Id, X-User-Email, X-User-Roles headers for downstream services
 * - Return 401 Unauthorized for missing or invalid tokens on protected routes
 */
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Check if the request has an Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
            }

            // Extract the Bearer token from the Authorization header
            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid authorization header format", HttpStatus.UNAUTHORIZED);
            }

            // Extract token without "Bearer " prefix
            String token = authorizationHeader.substring(7).trim();

            // Validate the JWT token
            if (!jwtUtil.isTokenValid(token)) {
                return onError(exchange, "Invalid or expired JWT token", HttpStatus.UNAUTHORIZED);
            }

            // Extract claims from the token
            String userId = jwtUtil.getUserIdFromToken(token);
            String email = jwtUtil.getEmailFromToken(token);
            List<String> roles = jwtUtil.getRolesFromToken(token);

            // Build modified request with headers containing user information
            ServerHttpRequest modifiedRequest = request.mutate()
                .header("X-User-Id", userId != null ? userId : "")
                .header("X-User-Email", email != null ? email : "")
                .header("X-User-Roles", roles != null ? String.join(",", roles) : "")
                .build();

            // Replace the original request with the modified one
            ServerWebExchange modifiedExchange = exchange.mutate()
                .request(modifiedRequest)
                .build();

            // Continue to the next filter in the chain
            return chain.filter(modifiedExchange);
        };
    }

    /**
     * Handles error responses by sending a 401 Unauthorized status with error details.
     *
     * @param exchange the ServerWebExchange
     * @param message the error message
     * @param status the HTTP status
     * @return a Mono representing the error response
     */
    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().set("Content-Type", "application/json");

        ErrorResponse errorResponse = new ErrorResponse(
            status.value(),
            message,
            System.currentTimeMillis()
        );

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(errorResponse);
            DataBuffer dataBuffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Flux.just(dataBuffer));
        } catch (JsonProcessingException e) {
            return response.setComplete();
        }
    }

    public static class Config {
        // Configuration for the filter (can be extended as needed)
    }

}
