-- Create Tenant table
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create Company table
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    status VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create Location table
CREATE TABLE locations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id),
    address VARCHAR(500) NOT NULL,
    emirate VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create ScreenEndpoint table
CREATE TABLE screen_endpoints (
    id UUID PRIMARY KEY,
    screen_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    http_method VARCHAR(20) NOT NULL,
    description VARCHAR(500),
    portal_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create Privilege table
CREATE TABLE privileges (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    screen_endpoint_id UUID NOT NULL REFERENCES screen_endpoints(id),
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create Role table
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    tenant_id UUID,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create Role-Privilege join table
CREATE TABLE role_privileges (
    role_id UUID NOT NULL REFERENCES roles(id),
    privilege_id UUID NOT NULL REFERENCES privileges(id),
    PRIMARY KEY (role_id, privilege_id)
);

-- Create User table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    icon_image_url VARCHAR(500),
    status VARCHAR(50) NOT NULL,
    activation_token VARCHAR(500),
    activation_token_expiry TIMESTAMP,
    tenant_id UUID REFERENCES tenants(id),
    company_id UUID REFERENCES companies(id),
    location_id UUID REFERENCES locations(id),
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create User-Role join table
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Create Document table
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_at TIMESTAMP,
    updated_by UUID
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_activation_token ON users(activation_token);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_companies_tenant_id ON companies(tenant_id);
CREATE INDEX idx_locations_company_id ON locations(company_id);
CREATE INDEX idx_privileges_screen_endpoint_id ON privileges(screen_endpoint_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_screen_endpoints_portal_type ON screen_endpoints(portal_type);
CREATE INDEX idx_roles_tenant_id ON roles(tenant_id);
