package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreateTenantRequest;
import ae.vdrive.user.dto.response.TenantResponse;
import ae.vdrive.user.entity.Tenant;
import ae.vdrive.user.enums.TenantStatus;
import ae.vdrive.user.exception.DuplicateResourceException;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.TenantMapper;
import ae.vdrive.user.repository.TenantRepository;
import ae.vdrive.user.service.TenantService;
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
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;

    @Override
    public TenantResponse createTenant(CreateTenantRequest request, UUID creatorUserId) {
        log.info("Creating new tenant: {}", request.getName());

        tenantRepository.findByCode(request.getCode())
                .ifPresent(t -> {
                    throw new DuplicateResourceException("Tenant with code " + request.getCode() + " already exists");
                });

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .code(request.getCode())
                .status(TenantStatus.ACTIVE)
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .createdBy(creatorUserId)
                .build();

        Tenant savedTenant = tenantRepository.save(tenant);
        log.info("Tenant created successfully with id: {}", savedTenant.getId());

        return tenantMapper.toTenantResponse(savedTenant);
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponse getTenant(UUID tenantId) {
        log.info("Fetching tenant with id: {}", tenantId);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + tenantId));

        return tenantMapper.toTenantResponse(tenant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantResponse> getAllTenants() {
        log.info("Fetching all tenants");

        return tenantRepository.findAll().stream()
                .map(tenantMapper::toTenantResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TenantResponse updateTenant(UUID tenantId, CreateTenantRequest request) {
        log.info("Updating tenant with id: {}", tenantId);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + tenantId));

        tenant.setName(request.getName());
        tenant.setCode(request.getCode());
        tenant.setContactEmail(request.getContactEmail());
        tenant.setContactPhone(request.getContactPhone());

        Tenant updatedTenant = tenantRepository.save(tenant);
        log.info("Tenant updated successfully: {}", tenantId);

        return tenantMapper.toTenantResponse(updatedTenant);
    }

    @Override
    public void deleteTenant(UUID tenantId) {
        log.info("Deleting tenant with id: {}", tenantId);

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found with id: " + tenantId));

        tenantRepository.delete(tenant);
        log.info("Tenant deleted successfully: {}", tenantId);
    }
}
