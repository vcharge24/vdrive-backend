package ae.vdrive.user.service.impl;

import ae.vdrive.user.dto.request.ActivateAccountRequest;
import ae.vdrive.user.dto.request.AssignRolesRequest;
import ae.vdrive.user.dto.request.CreateUserRequest;
import ae.vdrive.user.dto.request.LoginRequest;
import ae.vdrive.user.dto.request.UpdateUserRequest;
import ae.vdrive.user.dto.response.AuthResponse;
import ae.vdrive.user.dto.response.UserResponse;
import ae.vdrive.user.entity.Document;
import ae.vdrive.user.entity.Role;
import ae.vdrive.user.entity.User;
import ae.vdrive.user.enums.UserStatus;
import ae.vdrive.user.exception.DuplicateResourceException;
import ae.vdrive.user.exception.InvalidTokenException;
import ae.vdrive.user.exception.ResourceNotFoundException;
import ae.vdrive.user.mapper.UserMapper;
import ae.vdrive.user.repository.DocumentRepository;
import ae.vdrive.user.repository.RoleRepository;
import ae.vdrive.user.repository.UserRepository;
import ae.vdrive.user.service.JwtService;
import ae.vdrive.user.service.NotificationClient;
import ae.vdrive.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DocumentRepository documentRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationClient notificationClient;

    @Override
    public UserResponse createUser(CreateUserRequest request, UUID creatorUserId) {
        log.info("Creating new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }

        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneCode(request.getPhoneCode())
                .phoneNumber(request.getPhoneNumber())
                .iconImageUrl(request.getIconImageUrl())
                .status(UserStatus.PENDING_ACTIVATION)
                .activationToken(UUID.randomUUID().toString())
                .activationTokenExpiry(LocalDateTime.now().plusHours(24))
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .createdBy(creatorUserId)
                .build();

        if (creator.getTenantId() != null) {
            user.setTenantId(creator.getTenantId());
        }
        if (creator.getCompanyId() != null) {
            user.setCompanyId(creator.getCompanyId());
        }
        if (creator.getLocationId() != null) {
            user.setLocationId(creator.getLocationId());
        }

        Set<Role> roles = roleRepository.findAllById(request.getRoleIds()).stream().collect(Collectors.toSet());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        if (request.getDocuments() != null && !request.getDocuments().isEmpty()) {
            request.getDocuments().forEach(docReq -> {
                Document document = Document.builder()
                        .userId(savedUser.getId())
                        .documentType(docReq.getDocumentType())
                        .fileName(docReq.getFileName())
                        .fileUrl(docReq.getFileUrl())
                        .createdBy(creatorUserId)
                        .build();
                documentRepository.save(document);
            });
        }

        try {
            String activationLink = "http://localhost:3000/activate?token=" + user.getActivationToken();
            notificationClient.sendInvitationEmail(
                    new NotificationClient.InvitationEmailRequest(
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            activationLink
                    )
            );
        } catch (Exception e) {
            log.warn("Failed to send invitation email to {}: {}", user.getEmail(), e.getMessage());
        }

        log.info("User created successfully with id: {}", savedUser.getId());
        return userMapper.toUserResponse(savedUser);
    }

    @Override
    public AuthResponse activateAccount(ActivateAccountRequest request) {
        log.info("Activating account with token");

        User user = userRepository.findByActivationToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid activation token"));

        if (user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Activation token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);

        User savedUser = userRepository.save(user);

        Set<String> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), roleNames);
        String refreshToken = jwtService.generateRefreshToken(savedUser.getId(), savedUser.getEmail());

        log.info("Account activated successfully for user: {}", savedUser.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .roles(roleNames)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("User login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResourceNotFoundException("User account is not active");
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String accessToken = jwtService.generateToken(user.getId(), user.getEmail(), roleNames);
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        log.info("User logged in successfully: {}", user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(roleNames)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUser(UUID userId) {
        log.info("Fetching user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return userMapper.toUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.info("Fetching all users");

        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        log.info("Updating user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneCode(request.getPhoneCode());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIconImageUrl(request.getIconImageUrl());

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully: {}", userId);

        return userMapper.toUserResponse(updatedUser);
    }

    @Override
    public void deactivateUser(UUID userId) {
        log.info("Deactivating user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setStatus(UserStatus.DEACTIVATED);
        userRepository.save(user);

        log.info("User deactivated successfully: {}", userId);
    }

    @Override
    public UserResponse assignRoles(UUID userId, AssignRolesRequest request) {
        log.info("Assigning roles to user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Set<Role> roles = roleRepository.findAllById(request.getRoleIds()).stream().collect(Collectors.toSet());
        user.setRoles(roles);

        User updatedUser = userRepository.save(user);
        log.info("Roles assigned successfully to user: {}", userId);

        return userMapper.toUserResponse(updatedUser);
    }
}
