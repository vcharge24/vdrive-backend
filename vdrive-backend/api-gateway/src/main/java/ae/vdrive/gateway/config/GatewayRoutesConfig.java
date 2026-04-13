package ae.vdrive.gateway.config;

import ae.vdrive.gateway.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Cloud Gateway route definitions for Vdrive microservices.
 *
 * Defines the routing rules that map incoming API requests to their
 * corresponding microservices based on URL patterns.
 */
@Configuration
public class GatewayRoutesConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            // User Service Routes
            .route("user-service-users", r -> r
                .path("/api/v1/users/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-auth", r -> r
                .path("/api/v1/auth/**")
                .uri("lb://user-service"))
            .route("user-service-roles", r -> r
                .path("/api/v1/roles/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-privileges", r -> r
                .path("/api/v1/privileges/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-screens", r -> r
                .path("/api/v1/screens/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-tenants", r -> r
                .path("/api/v1/tenants/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-companies", r -> r
                .path("/api/v1/companies/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))
            .route("user-service-locations", r -> r
                .path("/api/v1/locations/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://user-service"))

            // Notification Service Routes
            .route("notification-service", r -> r
                .path("/api/v1/notifications/**")
                .filters(f -> f.filter(jwtAuthenticationFilter))
                .uri("lb://notification-service"))

            .build();
    }

}
