package ae.vdrive.user.dto.response;

import ae.vdrive.user.enums.ResourceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {

    private UUID id;
    private String name;
    private UUID companyId;
    private String address;
    private String emirate;
    private ResourceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
