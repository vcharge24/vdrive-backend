package ae.vdrive.client.user;

import ae.vdrive.client.config.FeignConfig;
import ae.vdrive.client.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign client for User Service
 * Provides REST client methods to interact with the user-service microservice
 */
@FeignClient(name = "user-service", configuration = FeignConfig.class)
public interface UserServiceClient {

    /**
     * Get a user by their ID
     *
     * @param id the user ID
     * @return the user details
     */
    @GetMapping("/api/v1/users/{id}")
    UserDto getUserById(@PathVariable("id") String id);

    /**
     * Get a user by their email address
     *
     * @param email the user's email address
     * @return the user details
     */
    @GetMapping("/api/v1/users/email/{email}")
    UserDto getUserByEmail(@PathVariable("email") String email);

    /**
     * Get all users
     *
     * @return list of all users
     */
    @GetMapping("/api/v1/users")
    List<UserDto> getAllUsers();
}
