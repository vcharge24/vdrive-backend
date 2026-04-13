package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.UserResponse;
import ae.vdrive.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {RoleMapper.class, DocumentMapper.class})
public interface UserMapper {

    UserResponse toUserResponse(User user);

    User toUserEntity(UserResponse userResponse);
}
