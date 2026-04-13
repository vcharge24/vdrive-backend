package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.PrivilegeResponse;
import ae.vdrive.user.entity.Privilege;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ScreenEndpointMapper.class})
public interface PrivilegeMapper {

    PrivilegeResponse toPrivilegeResponse(Privilege privilege);

    Privilege toPrivilegeEntity(PrivilegeResponse privilegeResponse);
}
