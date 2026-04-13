package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreateScreenEndpointRequest;
import ae.vdrive.user.dto.response.ScreenEndpointResponse;
import ae.vdrive.user.enums.PortalType;

import java.util.List;
import java.util.UUID;

public interface ScreenEndpointService {

    ScreenEndpointResponse createScreenEndpoint(CreateScreenEndpointRequest request, UUID creatorUserId);

    ScreenEndpointResponse getScreenEndpoint(UUID endpointId);

    List<ScreenEndpointResponse> getAllScreenEndpoints();

    List<ScreenEndpointResponse> getScreenEndpointsByPortalType(PortalType portalType);

    ScreenEndpointResponse updateScreenEndpoint(UUID endpointId, CreateScreenEndpointRequest request);

    void deleteScreenEndpoint(UUID endpointId);
}
