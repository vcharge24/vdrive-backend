package ae.vdrive.user.dto.response;

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
public class PrivilegeResponse {

    private UUID id;
    private String name;
    private String description;
    private ScreenEndpointResponse screenEndpoint;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
