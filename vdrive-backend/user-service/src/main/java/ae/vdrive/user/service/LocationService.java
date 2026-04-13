package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreateLocationRequest;
import ae.vdrive.user.dto.response.LocationResponse;

import java.util.List;
import java.util.UUID;

public interface LocationService {

    LocationResponse createLocation(CreateLocationRequest request, UUID creatorUserId);

    LocationResponse getLocation(UUID locationId);

    List<LocationResponse> getAllLocations();

    List<LocationResponse> getLocationsByCompany(UUID companyId);

    LocationResponse updateLocation(UUID locationId, CreateLocationRequest request);

    void deleteLocation(UUID locationId);
}
