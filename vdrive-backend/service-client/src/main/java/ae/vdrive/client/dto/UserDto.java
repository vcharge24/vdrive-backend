package ae.vdrive.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for User entity
 * Shared between user service and other microservices
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    /**
     * Unique user identifier
     */
    private String id;

    /**
     * User's first name
     */
    private String firstName;

    /**
     * User's last name
     */
    private String lastName;

    /**
     * User's email address
     */
    private String email;

    /**
     * Phone number country code (e.g., +971 for UAE)
     */
    private String phoneCode;

    /**
     * Phone number (without country code)
     */
    private String phoneNumber;

    /**
     * User account status (ACTIVE, INACTIVE, SUSPENDED, etc.)
     */
    private String status;

    /**
     * Tenant/Organization identifier
     */
    private String tenantId;

    /**
     * Company identifier
     */
    private String companyId;

    /**
     * Location/Branch identifier
     */
    private String locationId;

    /**
     * User's assigned roles
     */
    private List<RoleDto> roles;
}
