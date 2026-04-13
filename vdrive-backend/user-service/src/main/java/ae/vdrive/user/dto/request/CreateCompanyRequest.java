package ae.vdrive.user.dto.request;

import jakarta.validation.constraints.Email;
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
public class CreateCompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    @NotNull(message = "Tenant ID is required")
    private UUID tenantId;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email should be valid")
    private String contactEmail;
}
