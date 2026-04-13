package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreatePrivilegeRequest;
import ae.vdrive.user.dto.response.PrivilegeResponse;

import java.util.List;
import java.util.UUID;

public interface PrivilegeService {

    PrivilegeResponse createPrivilege(CreatePrivilegeRequest request, UUID creatorUserId);

    PrivilegeResponse getPrivilege(UUID privilegeId);

    List<PrivilegeResponse> getAllPrivileges();

    PrivilegeResponse updatePrivilege(UUID privilegeId, CreatePrivilegeRequest request);

    void deletePrivilege(UUID privilegeId);
}
