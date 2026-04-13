package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.RoleResponse;
import ae.vdrive.user.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {PrivilegeMapper.class})
public interface RoleMapper {

    RoleResponse toRoleResponse(Role role);

    Role toRoleEntity(RoleResponse roleResponse);
}
