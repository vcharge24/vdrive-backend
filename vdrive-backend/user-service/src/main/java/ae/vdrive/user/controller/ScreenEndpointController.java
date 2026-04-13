package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreateScreenEndpointRequest;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.dto.response.ScreenEndpointResponse;
import ae.vdrive.user.enums.PortalType;
import ae.vdrive.user.service.ScreenEndpointService;
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
@RequestMapping("/api/v1/screens")
@RequiredArgsConstructor
@Slf4j
public class ScreenEndpointController {

    private final ScreenEndpointService screenEndpointService;

    @PostMapping
    public ResponseEntity<ScreenEndpointResponse> createScreenEndpoint(
            @Valid @RequestBody CreateScreenEndpointRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating screen endpoint: {}", request.getScreenName());
        ScreenEndpointResponse response = screenEndpointService.createScreenEndpoint(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{endpointId}")
    public ResponseEntity<ScreenEndpointResponse> getScreenEndpoint(@PathVariable UUID endpointId) {
        log.info("Fetching screen endpoint: {}", endpointId);
        ScreenEndpointResponse response = screenEndpointService.getScreenEndpoint(endpointId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ScreenEndpointResponse>> getAllScreenEndpoints() {
        log.info("Fetching all screen endpoints");
        List<ScreenEndpointResponse> response = screenEndpointService.getAllScreenEndpoints();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/portal/{portalType}")
    public ResponseEntity<List<ScreenEndpointResponse>> getScreenEndpointsByPortalType(
            @PathVariable PortalType portalType) {
        log.info("Fetching screen endpoints for portal type: {}", portalType);
        List<ScreenEndpointResponse> response = screenEndpointService.getScreenEndpointsByPortalType(portalType);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{endpointId}")
    public ResponseEntity<ScreenEndpointResponse> updateScreenEndpoint(
            @PathVariable UUID endpointId,
            @Valid @RequestBody CreateScreenEndpointRequest request) {
        log.info("Updating screen endpoint: {}", endpointId);
        ScreenEndpointResponse response = screenEndpointService.updateScreenEndpoint(endpointId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{endpointId}")
    public ResponseEntity<MessageResponse> deleteScreenEndpoint(@PathVariable UUID endpointId) {
        log.info("Deleting screen endpoint: {}", endpointId);
        screenEndpointService.deleteScreenEndpoint(endpointId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Screen endpoint deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
