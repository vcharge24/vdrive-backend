package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.TenantResponse;
import ae.vdrive.user.entity.Tenant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TenantMapper {

    TenantResponse toTenantResponse(Tenant tenant);

    Tenant toTenantEntity(TenantResponse tenantResponse);
}
