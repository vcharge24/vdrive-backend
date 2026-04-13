package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreateRoleRequest;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.dto.response.RoleResponse;
import ae.vdrive.user.service.RoleService;
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
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Slf4j
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating role: {}", request.getName());
        RoleResponse response = roleService.createRole(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{roleId}")
    public ResponseEntity<RoleResponse> getRole(@PathVariable UUID roleId) {
        log.info("Fetching role: {}", roleId);
        RoleResponse response = roleService.getRole(roleId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        log.info("Fetching all roles");
        List<RoleResponse> response = roleService.getAllRoles();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<RoleResponse>> getRolesByTenant(@PathVariable UUID tenantId) {
        log.info("Fetching roles for tenant: {}", tenantId);
        List<RoleResponse> response = roleService.getRolesByTenant(tenantId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{roleId}")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable UUID roleId,
            @Valid @RequestBody CreateRoleRequest request) {
        log.info("Updating role: {}", roleId);
        RoleResponse response = roleService.updateRole(roleId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roleId}")
    public ResponseEntity<MessageResponse> deleteRole(@PathVariable UUID roleId) {
        log.info("Deleting role: {}", roleId);
        roleService.deleteRole(roleId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Role deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
