package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.CreateRoleRequest;
import ae.vdrive.user.dto.response.RoleResponse;
import ae.vdrive.user.entity.Privilege;
import ae.vdrive.user.entity.Role;
import ae.vdrive.user.exception.DuplicateResourceException;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.RoleMapper;
import ae.vdrive.user.repository.PrivilegeRepository;
import ae.vdrive.user.repository.RoleRepository;
import ae.vdrive.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PrivilegeRepository privilegeRepository;
    private final RoleMapper roleMapper;

    @Override
    public RoleResponse createRole(CreateRoleRequest request, UUID creatorUserId) {
        log.info("Creating new role: {}", request.getName());

        roleRepository.findByName(request.getName())
                .ifPresent(r -> {
                    throw new DuplicateResourceException("Role with name " + request.getName() + " already exists");
                });

        Set<Privilege> privileges = privilegeRepository.findAllById(request.getPrivilegeIds())
                .stream()
                .collect(Collectors.toSet());

        Role role = Role.builder()
                .name(request.getName())
                .description(request.getDescription())
                .privileges(privileges)
                .createdBy(creatorUserId)
                .build();

        Role savedRole = roleRepository.save(role);
        log.info("Role created successfully with id: {}", savedRole.getId());

        return roleMapper.toRoleResponse(savedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRole(UUID roleId) {
        log.info("Fetching role with id: {}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        return roleMapper.toRoleResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        log.info("Fetching all roles");

        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getRolesByTenant(UUID tenantId) {
        log.info("Fetching roles for tenant: {}", tenantId);

        return roleRepository.findAllByTenantId(tenantId).stream()
                .map(roleMapper::toRoleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse updateRole(UUID roleId, CreateRoleRequest request) {
        log.info("Updating role with id: {}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        Set<Privilege> privileges = privilegeRepository.findAllById(request.getPrivilegeIds())
                .stream()
                .collect(Collectors.toSet());
        role.setPrivileges(privileges);

        Role updatedRole = roleRepository.save(role);
        log.info("Role updated successfully: {}", roleId);

        return roleMapper.toRoleResponse(updatedRole);
    }

    @Override
    public void deleteRole(UUID roleId) {
        log.info("Deleting role with id: {}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        roleRepository.delete(role);
        log.info("Role deleted successfully: {}", roleId);
    }
}
