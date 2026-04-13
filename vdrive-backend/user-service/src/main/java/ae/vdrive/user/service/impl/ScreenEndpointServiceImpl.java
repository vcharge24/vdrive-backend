package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreateScreenEndpointRequest;
import ae.vdrive.user.dto.response.ScreenEndpointResponse;
import ae.vdrive.user.entity.ScreenEndpoint;
import ae.vdrive.user.enums.PortalType;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.ScreenEndpointMapper;
import ae.vdrive.user.repository.ScreenEndpointRepository;
import ae.vdrive.user.service.ScreenEndpointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ScreenEndpointServiceImpl implements ScreenEndpointService {

    private final ScreenEndpointRepository screenEndpointRepository;
    private final ScreenEndpointMapper screenEndpointMapper;

    @Override
    public ScreenEndpointResponse createScreenEndpoint(CreateScreenEndpointRequest request, UUID creatorUserId) {
        log.info("Creating new screen endpoint: {}", request.getScreenName());

        ScreenEndpoint screenEndpoint = ScreenEndpoint.builder()
                .screenName(request.getScreenName())
                .endpoint(request.getEndpoint())
                .httpMethod(request.getHttpMethod())
                .description(request.getDescription())
                .portalType(request.getPortalType())
                .createdBy(creatorUserId)
                .build();

        ScreenEndpoint savedScreenEndpoint = screenEndpointRepository.save(screenEndpoint);
        log.info("Screen endpoint created successfully with id: {}", savedScreenEndpoint.getId());

        return screenEndpointMapper.toScreenEndpointResponse(savedScreenEndpoint);
    }

    @Override
    @Transactional(readOnly = true)
    public ScreenEndpointResponse getScreenEndpoint(UUID endpointId) {
        log.info("Fetching screen endpoint with id: {}", endpointId);

        ScreenEndpoint screenEndpoint = screenEndpointRepository.findById(endpointId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen endpoint not found with id: " + endpointId));

        return screenEndpointMapper.toScreenEndpointResponse(screenEndpoint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScreenEndpointResponse> getAllScreenEndpoints() {
        log.info("Fetching all screen endpoints");

        return screenEndpointRepository.findAll().stream()
                .map(screenEndpointMapper::toScreenEndpointResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScreenEndpointResponse> getScreenEndpointsByPortalType(PortalType portalType) {
        log.info("Fetching screen endpoints for portal type: {}", portalType);

        return screenEndpointRepository.findAllByPortalType(portalType).stream()
                .map(screenEndpointMapper::toScreenEndpointResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScreenEndpointResponse updateScreenEndpoint(UUID endpointId, CreateScreenEndpointRequest request) {
        log.info("Updating screen endpoint with id: {}", endpointId);

        ScreenEndpoint screenEndpoint = screenEndpointRepository.findById(endpointId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen endpoint not found with id: " + endpointId));

        screenEndpoint.setScreenName(request.getScreenName());
        screenEndpoint.setEndpoint(request.getEndpoint());
        screenEndpoint.setHttpMethod(request.getHttpMethod());
        screenEndpoint.setDescription(request.getDescription());
        screenEndpoint.setPortalType(request.getPortalType());

        ScreenEndpoint updatedScreenEndpoint = screenEndpointRepository.save(screenEndpoint);
        log.info("Screen endpoint updated successfully: {}", endpointId);

        return screenEndpointMapper.toScreenEndpointResponse(updatedScreenEndpoint);
    }

    @Override
    public void deleteScreenEndpoint(UUID endpointId) {
        log.info("Deleting screen endpoint with id: {}", endpointId);

        ScreenEndpoint screenEndpoint = screenEndpointRepository.findById(endpointId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen endpoint not found with id: " + endpointId));

        screenEndpointRepository.delete(screenEndpoint);
        log.info("Screen endpoint deleted successfully: {}", endpointId);
    }
}
