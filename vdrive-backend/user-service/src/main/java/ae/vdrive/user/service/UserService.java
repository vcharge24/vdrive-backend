package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.ActivateAccountRequest;
import ae.vdrive.user.dto.request.AssignRolesRequest;
import ae.vdrive.user.dto.request.CreateUserRequest;
import ae.vdrive.user.dto.request.LoginRequest;
import ae.vdrive.user.dto.request.UpdateUserRequest;
import ae.vdrive.user.dto.response.AuthResponse;
import ae.vdrive.user.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserResponse createUser(CreateUserRequest request, UUID creatorUserId);

    AuthResponse activateAccount(ActivateAccountRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getUser(UUID userId);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(UUID userId, UpdateUserRequest request);

    void deactivateUser(UUID userId);

    UserResponse assignRoles(UUID userId, AssignRolesRequest request);
}
