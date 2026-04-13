package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreateTenantRequest;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.dto.response.TenantResponse;
import ae.vdrive.user.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Slf4j
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<TenantResponse> createTenant(
            @Valid @RequestBody CreateTenantRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating tenant: {}", request.getName());
        TenantResponse response = tenantService.createTenant(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{tenantId}")
    public ResponseEntity<TenantResponse> getTenant(@PathVariable UUID tenantId) {
        log.info("Fetching tenant: {}", tenantId);
        TenantResponse response = tenantService.getTenant(tenantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        log.info("Fetching all tenants");
        List<TenantResponse> response = tenantService.getAllTenants();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{tenantId}")
    public ResponseEntity<TenantResponse> updateTenant(
            @PathVariable UUID tenantId,
            @Valid @RequestBody CreateTenantRequest request) {
        log.info("Updating tenant: {}", tenantId);
        TenantResponse response = tenantService.updateTenant(tenantId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{tenantId}")
    public ResponseEntity<MessageResponse> deleteTenant(@PathVariable UUID tenantId) {
        log.info("Deleting tenant: {}", tenantId);
        tenantService.deleteTenant(tenantId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Tenant deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
