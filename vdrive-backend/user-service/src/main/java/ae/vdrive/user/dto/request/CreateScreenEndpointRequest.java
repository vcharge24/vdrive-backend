package ae.vdrive.user.dto.request;

import ae.vdrive.user.enums.PortalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateScreenEndpointRequest {

    @NotBlank(message = "Screen name is required")
    private String screenName;

    @NotBlank(message = "Endpoint is required")
    private String endpoint;

    @NotBlank(message = "HTTP method is required")
    private String httpMethod;

    private String description;

    @NotNull(message = "Portal type is required")
    private PortalType portalType;
}
