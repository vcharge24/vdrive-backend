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
public class CreateLocationRequest {

    @NotBlank(message = "Location name is required")
    private String name;

    @NotNull(message = "Company ID is required")
    private UUID companyId;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Emirate is required")
    private String emirate;
}
