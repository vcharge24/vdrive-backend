# User Management Microservice

User Management microservice for the Vdrive mobility platform (EV charging + parking + payments). Handles users, roles, privileges, screen endpoints, and multi-tenant hierarchy.

## Technology Stack

- **Java 21** - Latest LTS version
- **Spring Boot 3.3.x** - Framework
- **Spring Cloud** - Service discovery (Eureka) and OpenFeign for inter-service communication
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Primary database
- **Flyway** - Database migrations
- **JWT (io.jsonwebtoken 0.12.6)** - Token-based authentication
- **MapStruct 1.5.5.Final** - Entity-DTO mapping
- **Lombok** - Boilerplate reduction
- **Spring Security** - Authentication and authorization

## Project Structure

```
user-service/
├── pom.xml
├── src/main/java/ae/vdrive/user/
│   ├── UserServiceApplication.java          # Main application entry
│   ├── config/
│   │   ├── AuditConfig.java                 # JPA auditing configuration
│   │   └── SecurityConfig.java              # Password encoder and CORS
│   ├── controller/
│   │   ├── AuthController.java              # Login and activation endpoints
│   │   ├── UserController.java              # User CRUD endpoints
│   │   ├── RoleController.java              # Role CRUD endpoints
│   │   ├── PrivilegeController.java         # Privilege CRUD endpoints
│   │   ├── ScreenEndpointController.java    # Screen endpoint CRUD
│   │   ├── TenantController.java            # Tenant CRUD endpoints
│   │   ├── CompanyController.java           # Company CRUD endpoints
│   │   └── LocationController.java          # Location CRUD endpoints
│   ├── dto/
│   │   ├── request/                         # Request DTOs
│   │   │   ├── CreateUserRequest.java
│   │   │   ├── UpdateUserRequest.java
│   │   │   ├── ActivateAccountRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AssignRolesRequest.java
│   │   │   ├── CreateRoleRequest.java
│   │   │   ├── CreatePrivilegeRequest.java
│   │   │   ├── CreateScreenEndpointRequest.java
│   │   │   ├── CreateTenantRequest.java
│   │   │   ├── CreateCompanyRequest.java
│   │   │   └── CreateLocationRequest.java
│   │   └── response/                        # Response DTOs
│   │       ├── UserResponse.java
│   │       ├── RoleResponse.java
│   │       ├── PrivilegeResponse.java
│   │       ├── ScreenEndpointResponse.java
│   │       ├── TenantResponse.java
│   │       ├── CompanyResponse.java
│   │       ├── LocationResponse.java
│   │       ├── DocumentResponse.java
│   │       ├── AuthResponse.java
│   │       └── MessageResponse.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── Privilege.java
│   │   ├── ScreenEndpoint.java
│   │   ├── Tenant.java
│   │   ├── Company.java
│   │   ├── Location.java
│   │   └── Document.java
│   ├── enums/
│   │   ├── UserStatus.java
│   │   ├── PortalType.java
│   │   ├── DocumentType.java
│   │   ├── TenantStatus.java
│   │   └── ResourceStatus.java
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   ├── DuplicateResourceException.java
│   │   ├── InvalidTokenException.java
│   │   ├── UnauthorizedException.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ErrorResponse.java
│   │   └── ValidationErrorResponse.java
│   ├── mapper/
│   │   ├── UserMapper.java
│   │   ├── RoleMapper.java
│   │   ├── PrivilegeMapper.java
│   │   ├── ScreenEndpointMapper.java
│   │   ├── TenantMapper.java
│   │   ├── CompanyMapper.java
│   │   ├── LocationMapper.java
│   │   └── DocumentMapper.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── RoleRepository.java
│   │   ├── PrivilegeRepository.java
│   │   ├── ScreenEndpointRepository.java
│   │   ├── TenantRepository.java
│   │   ├── CompanyRepository.java
│   │   ├── LocationRepository.java
│   │   └── DocumentRepository.java
│   └── service/
│       ├── JwtService.java                  # JWT token generation and validation
│       ├── NotificationClient.java          # Feign client for notifications
│       ├── UserService.java / UserServiceImpl.java
│       ├── RoleService.java / RoleServiceImpl.java
│       ├── PrivilegeService.java / PrivilegeServiceImpl.java
│       ├── ScreenEndpointService.java / ScreenEndpointServiceImpl.java
│       ├── TenantService.java / TenantServiceImpl.java
│       ├── CompanyService.java / CompanyServiceImpl.java
│       └── LocationService.java / LocationServiceImpl.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
│       ├── V1__create_tables.sql            # Create all tables and indexes
│       └── V2__seed_screen_endpoints.sql    # Seed screen endpoints
```

## Database Schema

### Entities

1. **Tenant** - Multi-tenancy root entity
   - id (UUID PK)
   - name, code (unique), status, contactEmail, contactPhone
   - Audited with createdAt/updatedAt

2. **Company** - Organization within a tenant
   - id (UUID PK)
   - name, tenantId (FK), status, contactEmail
   - Audited

3. **Location** - Physical location of a company
   - id (UUID PK)
   - name, companyId (FK), address, emirate, status
   - Audited

4. **ScreenEndpoint** - UI screen with associated endpoint
   - id (UUID PK)
   - screenName, endpoint, httpMethod, description, portalType (ADMIN/MERCHANT)
   - Audited

5. **Privilege** - Permission to access a screen endpoint
   - id (UUID PK)
   - name (unique), description, screenEndpointId (FK)
   - Audited

6. **Role** - Collection of privileges
   - id (UUID PK)
   - name (unique), description, tenantId (nullable for multi-tenant roles)
   - ManyToMany with Privilege
   - Audited

7. **User** - System user with multi-level hierarchy
   - id (UUID PK)
   - firstName, lastName, email (unique), phoneCode, phoneNumber
   - password (hashed), status (PENDING_ACTIVATION, ACTIVE, DEACTIVATED, SUSPENDED)
   - activationToken, activationTokenExpiry
   - tenantId, companyId, locationId (hierarchical relationship)
   - ManyToMany with Role
   - Audited

8. **Document** - User documents (ID, passport, driving license, etc.)
   - id (UUID PK)
   - userId (FK), documentType, fileName, fileUrl
   - Audited

## API Endpoints

### Authentication Endpoints (`/api/v1/auth`)
- `POST /login` - User login with email and password
- `POST /activate` - Activate account with token and set password

### User Endpoints (`/api/v1/users`)
- `POST /` - Create user (requires X-User-Id header)
- `GET /{userId}` - Get user by ID
- `GET /` - Get all users
- `PUT /{userId}` - Update user profile
- `DELETE /{userId}` - Deactivate user
- `POST /{userId}/roles` - Assign roles to user

### Role Endpoints (`/api/v1/roles`)
- `POST /` - Create role
- `GET /{roleId}` - Get role by ID
- `GET /` - Get all roles
- `GET /tenant/{tenantId}` - Get roles by tenant
- `PUT /{roleId}` - Update role
- `DELETE /{roleId}` - Delete role

### Privilege Endpoints (`/api/v1/privileges`)
- `POST /` - Create privilege
- `GET /{privilegeId}` - Get privilege by ID
- `GET /` - Get all privileges
- `PUT /{privilegeId}` - Update privilege
- `DELETE /{privilegeId}` - Delete privilege

### Screen Endpoint Endpoints (`/api/v1/screens`)
- `POST /` - Create screen endpoint
- `GET /{endpointId}` - Get screen endpoint
- `GET /` - Get all screen endpoints
- `GET /portal/{portalType}` - Get screens by portal type (ADMIN/MERCHANT)
- `PUT /{endpointId}` - Update screen endpoint
- `DELETE /{endpointId}` - Delete screen endpoint

### Tenant Endpoints (`/api/v1/tenants`)
- `POST /` - Create tenant
- `GET /{tenantId}` - Get tenant
- `GET /` - Get all tenants
- `PUT /{tenantId}` - Update tenant
- `DELETE /{tenantId}` - Delete tenant

### Company Endpoints (`/api/v1/companies`)
- `POST /` - Create company
- `GET /{companyId}` - Get company
- `GET /` - Get all companies
- `GET /tenant/{tenantId}` - Get companies by tenant
- `PUT /{companyId}` - Update company
- `DELETE /{companyId}` - Delete company

### Location Endpoints (`/api/v1/locations`)
- `POST /` - Create location
- `GET /{locationId}` - Get location
- `GET /` - Get all locations
- `GET /company/{companyId}` - Get locations by company
- `PUT /{locationId}` - Update location
- `DELETE /{locationId}` - Delete location

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/vdrive_users
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# Server
SERVER_PORT=8081

# Eureka Discovery
EUREKA_SERVER_URL=http://localhost:8761/eureka
EUREKA_INSTANCE_HOSTNAME=localhost

# JWT
JWT_SECRET=your_very_long_secret_key_for_hs256
JWT_EXPIRATION=3600000            # 1 hour in milliseconds
JWT_REFRESH_EXPIRATION=604800000  # 7 days in milliseconds

# Notification Service
NOTIFICATION_SERVICE_URL=http://notification-service:8082
```

### application.yml

Located at `src/main/resources/application.yml`. Key settings:
- JPA: Hibernate dialect for PostgreSQL, validation mode
- Flyway: Enabled with migration location
- Logging: DEBUG for user-service, INFO for others
- Server: Port 8081

## Key Features

### User Management
- User registration with invitation email (via NotificationClient)
- Account activation workflow
- User role assignment
- Support for multi-level hierarchy (tenant → company → location)
- Document upload tracking

### Authentication & Authorization
- JWT-based stateless authentication (HS256)
- Role-based access control (RBAC)
- Screen endpoint-based privilege system
- Supports both ADMIN and MERCHANT portals

### Multi-Tenancy
- Tenant isolation at database level
- Hierarchical user structure (Tenant → Company → Location)
- Tenant-scoped roles

### Database
- UUID primary keys for better distribution
- JPA auditing (createdAt, createdBy, updatedAt, updatedBy)
- Flyway migrations for version control
- Comprehensive indexes for performance

## Running the Service

### Prerequisites
- Java 21
- Maven 3.8+
- PostgreSQL 12+
- Eureka Discovery Server running on localhost:8761

### Build & Run

```bash
# Build
mvn clean package

# Run
java -jar target/user-service-1.0.0.jar

# Or with custom configuration
java -jar target/user-service-1.0.0.jar \
  --spring.datasource.url=jdbc:postgresql://db:5432/vdrive_users \
  --eureka.client.service-url.defaultZone=http://eureka:8761/eureka
```

### Docker Build

```bash
docker build -t vdrive/user-service:1.0.0 .
docker run -p 8081:8081 \
  -e DATABASE_URL=jdbc:postgresql://db:5432/vdrive_users \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=password \
  vdrive/user-service:1.0.0
```

## Integration Points

### Eureka Discovery
- Registers as `user-service`
- Connects to Eureka for service discovery

### Notification Service (Feign)
- Sends invitation emails when users are created
- Uses `NotificationClient` interface
- Endpoint: POST `/api/v1/notifications/send-invitation`

### API Gateway
- Expects X-User-Id and X-User-Email headers from gateway
- SecurityConfig creates SecurityContext from headers

## Error Handling

Custom exception hierarchy with specific HTTP status codes:

- **ResourceNotFoundException** → 404 Not Found
- **DuplicateResourceException** → 409 Conflict
- **InvalidTokenException** → 401 Unauthorized
- **UnauthorizedException** → 403 Forbidden
- **Validation errors** → 400 Bad Request with field-level errors
- **Generic exceptions** → 500 Internal Server Error

## Logging

- SLF4J with logback configuration
- DEBUG level for `ae.vdrive.user` package
- INFO level for others
- File rotation: 10MB max size, 10 files retention
- Log file: `logs/user-service.log`

## Security Considerations

- Passwords hashed with BCrypt
- JWT tokens with HS256 algorithm
- CORS enabled for all origins (configure appropriately)
- CSRF disabled (stateless JWT authentication)
- Sensitive fields (password) excluded from responses

## Future Enhancements

- OAuth2/OIDC integration
- Role hierarchy and permission inheritance
- User groups and bulk operations
- Two-factor authentication
- Audit log persistence
- Rate limiting
- API versioning
