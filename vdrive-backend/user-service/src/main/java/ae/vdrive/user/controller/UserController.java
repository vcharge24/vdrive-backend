package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.AssignRolesRequest;
import ae.vdrive.user.dto.request.CreateUserRequest;
import ae.vdrive.user.dto.request.UpdateUserRequest;
import ae.vdrive.user.dto.response.MessageResponse;
import ae.vdrive.user.dto.response.UserResponse;
import ae.vdrive.user.service.UserService;
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
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request,
            @RequestHeader("X-User-Id") UUID creatorUserId) {
        log.info("Creating user with email: {}", request.getEmail());
        UserResponse response = userService.createUser(request, creatorUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID userId) {
        log.info("Fetching user: {}", userId);
        UserResponse response = userService.getUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("Fetching all users");
        List<UserResponse> response = userService.getAllUsers();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("Updating user: {}", userId);
        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<MessageResponse> deactivateUser(@PathVariable UUID userId) {
        log.info("Deactivating user: {}", userId);
        userService.deactivateUser(userId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("User deactivated successfully")
                .timestamp(LocalDateTime.now())
                .build());
    }

    @PostMapping("/{userId}/roles")
    public ResponseEntity<UserResponse> assignRoles(
            @PathVariable UUID userId,
            @Valid @RequestBody AssignRolesRequest request) {
        log.info("Assigning roles to user: {}", userId);
        UserResponse response = userService.assignRoles(userId, request);
        return ResponseEntity.ok(response);
    }
}
