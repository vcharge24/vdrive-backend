package ae.vdrive.user.dto.response;

import ae.vdrive.user.enums.DocumentType;
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
public class DocumentResponse {

    private UUID id;
    private UUID userId;
    private DocumentType documentType;
    private String fileName;
    private String fileUrl;
    private LocalDateTime createdAt;
}
