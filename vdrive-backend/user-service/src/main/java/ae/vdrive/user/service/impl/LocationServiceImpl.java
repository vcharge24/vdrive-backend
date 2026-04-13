package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreateLocationRequest;
import ae.vdrive.user.dto.response.LocationResponse;
import ae.vdrive.user.entity.Location;
import ae.vdrive.user.enums.ResourceStatus;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.LocationMapper;
import ae.vdrive.user.repository.LocationRepository;
import ae.vdrive.user.service.LocationService;
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
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    public LocationResponse createLocation(CreateLocationRequest request, UUID creatorUserId) {
        log.info("Creating new location: {}", request.getName());

        Location location = Location.builder()
                .name(request.getName())
                .companyId(request.getCompanyId())
                .address(request.getAddress())
                .emirate(request.getEmirate())
                .status(ResourceStatus.ACTIVE)
                .createdBy(creatorUserId)
                .build();

        Location savedLocation = locationRepository.save(location);
        log.info("Location created successfully with id: {}", savedLocation.getId());

        return locationMapper.toLocationResponse(savedLocation);
    }

    @Override
    @Transactional(readOnly = true)
    public LocationResponse getLocation(UUID locationId) {
        log.info("Fetching location with id: {}", locationId);

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + locationId));

        return locationMapper.toLocationResponse(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAllLocations() {
        log.info("Fetching all locations");

        return locationRepository.findAll().stream()
                .map(locationMapper::toLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getLocationsByCompany(UUID companyId) {
        log.info("Fetching locations for company: {}", companyId);

        return locationRepository.findAllByCompanyId(companyId).stream()
                .map(locationMapper::toLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LocationResponse updateLocation(UUID locationId, CreateLocationRequest request) {
        log.info("Updating location with id: {}", locationId);

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + locationId));

        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setEmirate(request.getEmirate());

        Location updatedLocation = locationRepository.save(location);
        log.info("Location updated successfully: {}", locationId);

        return locationMapper.toLocationResponse(updatedLocation);
    }

    @Override
    public void deleteLocation(UUID locationId) {
        log.info("Deleting location with id: {}", locationId);

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + locationId));

        locationRepository.delete(location);
        log.info("Location deleted successfully: {}", locationId);
    }
}
