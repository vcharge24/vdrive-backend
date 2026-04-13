package ae.vdrive.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTenantRequest {

    @NotBlank(message = "Tenant name is required")
    private String name;

    @NotBlank(message = "Tenant code is required")
    private String code;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email should be valid")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;
}
