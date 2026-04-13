package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreatePrivilegeRequest;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.dto.response.PrivilegeResponse;
import ae.vdrive.user.service.PrivilegeService;
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
@RequestMapping("/api/v1/privileges")
@RequiredArgsConstructor
@Slf4j
public class PrivilegeController {

    private final PrivilegeService privilegeService;

    @PostMapping
    public ResponseEntity<PrivilegeResponse> createPrivilege(
            @Valid @RequestBody CreatePrivilegeRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating privilege: {}", request.getName());
        PrivilegeResponse response = privilegeService.createPrivilege(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{privilegeId}")
    public ResponseEntity<PrivilegeResponse> getPrivilege(@PathVariable UUID privilegeId) {
        log.info("Fetching privilege: {}", privilegeId);
        PrivilegeResponse response = privilegeService.getPrivilege(privilegeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PrivilegeResponse>> getAllPrivileges() {
        log.info("Fetching all privileges");
        List<PrivilegeResponse> response = privilegeService.getAllPrivileges();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{privilegeId}")
    public ResponseEntity<PrivilegeResponse> updatePrivilege(
            @PathVariable UUID privilegeId,
            @Valid @RequestBody CreatePrivilegeRequest request) {
        log.info("Updating privilege: {}", privilegeId);
        PrivilegeResponse response = privilegeService.updatePrivilege(privilegeId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{privilegeId}")
    public ResponseEntity<MessageResponse> deletePrivilege(@PathVariable UUID privilegeId) {
        log.info("Deleting privilege: {}", privilegeId);
        privilegeService.deletePrivilege(privilegeId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Privilege deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
