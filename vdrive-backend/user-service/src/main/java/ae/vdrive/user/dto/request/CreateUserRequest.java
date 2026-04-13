package ae.vdrive.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone code is required")
    private String phoneCode;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotEmpty(message = "At least one role must be assigned")
    private Set<UUID> roleIds;

    private String iconImageUrl;

    private List<DocumentUploadRequest> documents;
}
