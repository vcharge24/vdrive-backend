package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreateRoleRequest;
import ae.vdrive.user.dto.response.RoleResponse;

import java.util.List;
import java.util.UUID;

public interface RoleService {

    RoleResponse createRole(CreateRoleRequest request, UUID creatorUserId);

    RoleResponse getRole(UUID roleId);

    List<RoleResponse> getAllRoles();

    List<RoleResponse> getRolesByTenant(UUID tenantId);

    RoleResponse updateRole(UUID roleId, CreateRoleRequest request);

    void deleteRole(UUID roleId);
}
