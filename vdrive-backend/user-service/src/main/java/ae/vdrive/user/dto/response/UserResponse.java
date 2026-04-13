package ae.vdrive.user.dto.response;

import ae.vdrive.user.enums.UserStatus;
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
public class UserResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneCode;
    private String phoneNumber;
    private String iconImageUrl;
    private UserStatus status;
    private UUID tenantId;
    private UUID companyId;
    private UUID locationId;
    private Set<RoleResponse> roles;
    private List<DocumentResponse> documents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
