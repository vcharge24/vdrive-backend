package ae.vdrive.user.controller;

import ae.vdrive.user.dto.request.ActivateAccountRequest;
import ae.vdrive.user.dto.request.LoginRequest;
import ae.vdrive.user.dto.response.AuthResponse;
import ae.vdrive.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/activate")
    public ResponseEntity<AuthResponse> activateAccount(@Valid @RequestBody ActivateAccountRequest request) {
        log.info("Account activation request");
        AuthResponse response = userService.activateAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
