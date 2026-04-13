package ae.vdrive.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {

    private UUID id;
    private String name;
    private String description;
    private UUID tenantId;
    private Set<PrivilegeResponse> privileges;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
