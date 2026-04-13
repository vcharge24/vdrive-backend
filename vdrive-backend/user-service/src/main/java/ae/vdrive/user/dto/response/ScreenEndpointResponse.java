package ae.vdrive.user.dto.response;

import ae.vdrive.user.enums.PortalType;
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
public class ScreenEndpointResponse {

    private UUID id;
    private String screenName;
    private String endpoint;
    private String httpMethod;
    private String description;
    private PortalType portalType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
