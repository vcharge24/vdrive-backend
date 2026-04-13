package ae.vdrive.user.entity;

import ae.vdrive.user.enums.PortalType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedAt;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedAt;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "screen_endpoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ScreenEndpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String screenName;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private String httpMethod;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PortalType portalType;

    @CreatedAt
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private UUID createdBy;

    @LastModifiedAt
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @LastModifiedBy
    @Column(name = "updated_by")
    private UUID updatedBy;
}
