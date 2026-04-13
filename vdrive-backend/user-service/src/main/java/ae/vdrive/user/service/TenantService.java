package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreateTenantRequest;
import ae.vdrive.user.dto.response.TenantResponse;

import java.util.List;
import java.util.UUID;

public interface TenantService {

    TenantResponse createTenant(CreateTenantRequest request, UUID creatorUserId);

    TenantResponse getTenant(UUID tenantId);

    List<TenantResponse> getAllTenants();

    TenantResponse updateTenant(UUID tenantId, CreateTenantRequest request);

    void deleteTenant(UUID tenantId);
}
