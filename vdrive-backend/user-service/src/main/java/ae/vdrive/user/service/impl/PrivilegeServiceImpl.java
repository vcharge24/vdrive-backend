package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreatePrivilegeRequest;
import ae.vdrive.user.dto.response.PrivilegeResponse;
import ae.vdrive.user.entity.Privilege;
import ae.vdrive.user.entity.ScreenEndpoint;
import ae.vdrive.user.exception.DuplicateResourceException;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.PrivilegeMapper;
import ae.vdrive.user.repository.PrivilegeRepository;
import ae.vdrive.user.repository.ScreenEndpointRepository;
import ae.vdrive.user.service.PrivilegeService;
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
public class PrivilegeServiceImpl implements PrivilegeService {

    private final PrivilegeRepository privilegeRepository;
    private final ScreenEndpointRepository screenEndpointRepository;
    private final PrivilegeMapper privilegeMapper;

    @Override
    public PrivilegeResponse createPrivilege(CreatePrivilegeRequest request, UUID creatorUserId) {
        log.info("Creating new privilege: {}", request.getName());

        privilegeRepository.findByName(request.getName())
                .ifPresent(p -> {
                    throw new DuplicateResourceException("Privilege with name " + request.getName() + " already exists");
                });

        ScreenEndpoint screenEndpoint = screenEndpointRepository.findById(request.getScreenEndpointId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen endpoint not found"));

        Privilege privilege = Privilege.builder()
                .name(request.getName())
                .description(request.getDescription())
                .screenEndpoint(screenEndpoint)
                .createdBy(creatorUserId)
                .build();

        Privilege savedPrivilege = privilegeRepository.save(privilege);
        log.info("Privilege created successfully with id: {}", savedPrivilege.getId());

        return privilegeMapper.toPrivilegeResponse(savedPrivilege);
    }

    @Override
    @Transactional(readOnly = true)
    public PrivilegeResponse getPrivilege(UUID privilegeId) {
        log.info("Fetching privilege with id: {}", privilegeId);

        Privilege privilege = privilegeRepository.findById(privilegeId)
                .orElseThrow(() -> new ResourceNotFoundException("Privilege not found with id: " + privilegeId));

        return privilegeMapper.toPrivilegeResponse(privilege);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrivilegeResponse> getAllPrivileges() {
        log.info("Fetching all privileges");

        return privilegeRepository.findAll().stream()
                .map(privilegeMapper::toPrivilegeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PrivilegeResponse updatePrivilege(UUID privilegeId, CreatePrivilegeRequest request) {
        log.info("Updating privilege with id: {}", privilegeId);

        Privilege privilege = privilegeRepository.findById(privilegeId)
                .orElseThrow(() -> new ResourceNotFoundException("Privilege not found with id: " + privilegeId));

        privilege.setName(request.getName());
        privilege.setDescription(request.getDescription());

        ScreenEndpoint screenEndpoint = screenEndpointRepository.findById(request.getScreenEndpointId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen endpoint not found"));
        privilege.setScreenEndpoint(screenEndpoint);

        Privilege updatedPrivilege = privilegeRepository.save(privilege);
        log.info("Privilege updated successfully: {}", privilegeId);

        return privilegeMapper.toPrivilegeResponse(updatedPrivilege);
    }

    @Override
    public void deletePrivilege(UUID privilegeId) {
        log.info("Deleting privilege with id: {}", privilegeId);

        Privilege privilege = privilegeRepository.findById(privilegeId)
                .orElseThrow(() -> new ResourceNotFoundException("Privilege not found with id: " + privilegeId));

        privilegeRepository.delete(privilege);
        log.info("Privilege deleted successfully: {}", privilegeId);
    }
}
