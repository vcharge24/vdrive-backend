package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.CreateLocationRequest;
import ae.vdrive.user.dto.response.LocationResponse;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.service.LocationService;
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
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
@Slf4j
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationResponse> createLocation(
            @Valid @RequestBody CreateLocationRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating location: {}", request.getName());
        LocationResponse response = locationService.createLocation(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<LocationResponse> getLocation(@PathVariable UUID locationId) {
        log.info("Fetching location: {}", locationId);
        LocationResponse response = locationService.getLocation(locationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<LocationResponse>> getAllLocations() {
        log.info("Fetching all locations");
        List<LocationResponse> response = locationService.getAllLocations();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<LocationResponse>> getLocationsByCompany(@PathVariable UUID companyId) {
        log.info("Fetching locations for company: {}", companyId);
        List<LocationResponse> response = locationService.getLocationsByCompany(companyId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<LocationResponse> updateLocation(
            @PathVariable UUID locationId,
            @Valid @RequestBody CreateLocationRequest request) {
        log.info("Updating location: {}", locationId);
        LocationResponse response = locationService.updateLocation(locationId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<MessageResponse> deleteLocation(@PathVariable UUID locationId) {
        log.info("Deleting location: {}", locationId);
        locationService.deleteLocation(locationId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Location deleted successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }
}
