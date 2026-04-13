package ae.vdrive.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePrivilegeRequest {

    @NotBlank(message = "Privilege name is required")
    private String name;

    private String description;

    @NotNull(message = "Screen endpoint ID is required")
    private UUID screenEndpointId;
}
