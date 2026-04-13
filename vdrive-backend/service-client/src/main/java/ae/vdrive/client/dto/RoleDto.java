package ae.vdrive.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Role entity
 * Shared between user service and other microservices
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDto {
    /**
     * Unique role identifier
     */
    private String id;

    /**
     * Role name (e.g., ADMIN, USER, OPERATOR)
     */
    private String name;

    /**
     * Role description
     */
    private String description;
}
