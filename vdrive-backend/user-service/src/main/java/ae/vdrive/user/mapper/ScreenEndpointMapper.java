package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.ScreenEndpointResponse;
import ae.vdrive.user.entity.ScreenEndpoint;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ScreenEndpointMapper {

    ScreenEndpointResponse toScreenEndpointResponse(ScreenEndpoint screenEndpoint);

    ScreenEndpoint toScreenEndpointEntity(ScreenEndpointResponse screenEndpointResponse);
}
