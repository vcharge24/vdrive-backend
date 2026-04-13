package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.LocationResponse;
import ae.vdrive.user.entity.Location;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationResponse toLocationResponse(Location location);

    Location toLocationEntity(LocationResponse locationResponse);
}
