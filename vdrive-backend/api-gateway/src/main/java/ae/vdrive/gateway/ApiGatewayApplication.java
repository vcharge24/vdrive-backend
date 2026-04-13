package ae.vdrive.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * API Gateway application for Vdrive platform.
 *
 * Serves as the entry point for all API requests, providing:
 * - Request routing to appropriate microservices
 * - JWT authentication and authorization
 * - Service discovery integration
 * - Cross-cutting concerns (logging, error handling, etc.)
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

}
