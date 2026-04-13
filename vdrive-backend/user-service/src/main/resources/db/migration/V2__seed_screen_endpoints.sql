-- Admin Portal Screens
INSERT INTO screen_endpoints (id, screen_name, endpoint, http_method, description, portal_type, created_at) VALUES
(gen_random_uuid(), 'Dashboard', '/api/v1/admin/dashboard', 'GET', 'Admin dashboard overview', 'ADMIN', NOW()),
(gen_random_uuid(), 'Merchants', '/api/v1/admin/merchants', 'GET', 'Manage merchants', 'ADMIN', NOW()),
(gen_random_uuid(), 'Merchants', '/api/v1/admin/merchants', 'POST', 'Create merchant', 'ADMIN', NOW()),
(gen_random_uuid(), 'Sites', '/api/v1/admin/sites', 'GET', 'Manage charging sites', 'ADMIN', NOW()),
(gen_random_uuid(), 'Sites', '/api/v1/admin/sites', 'POST', 'Create charging site', 'ADMIN', NOW()),
(gen_random_uuid(), 'Chargers', '/api/v1/admin/chargers', 'GET', 'Manage chargers', 'ADMIN', NOW()),
(gen_random_uuid(), 'Chargers', '/api/v1/admin/chargers', 'POST', 'Create charger', 'ADMIN', NOW()),
(gen_random_uuid(), 'Revenue', '/api/v1/admin/revenue', 'GET', 'Revenue analytics', 'ADMIN', NOW()),
(gen_random_uuid(), 'Vehicles', '/api/v1/admin/vehicles', 'GET', 'Manage vehicles', 'ADMIN', NOW()),
(gen_random_uuid(), 'Transactions', '/api/v1/admin/transactions', 'GET', 'View transactions', 'ADMIN', NOW()),
(gen_random_uuid(), 'Users', '/api/v1/admin/users', 'GET', 'Manage users', 'ADMIN', NOW()),
(gen_random_uuid(), 'Users', '/api/v1/admin/users', 'POST', 'Create user', 'ADMIN', NOW()),
(gen_random_uuid(), 'Settings', '/api/v1/admin/settings', 'GET', 'System settings', 'ADMIN', NOW()),
(gen_random_uuid(), 'Settings', '/api/v1/admin/settings', 'PUT', 'Update settings', 'ADMIN', NOW()),
(gen_random_uuid(), 'System Health', '/api/v1/admin/health', 'GET', 'System health status', 'ADMIN', NOW());

-- Merchant Portal Screens
INSERT INTO screen_endpoints (id, screen_name, endpoint, http_method, description, portal_type, created_at) VALUES
(gen_random_uuid(), 'Dashboard', '/api/v1/merchant/dashboard', 'GET', 'Merchant dashboard', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Building Setup', '/api/v1/merchant/buildings', 'GET', 'Manage building setup', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Building Setup', '/api/v1/merchant/buildings', 'POST', 'Create building', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Building Setup', '/api/v1/merchant/buildings', 'PUT', 'Update building', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Tenants', '/api/v1/merchant/tenants', 'GET', 'Manage tenants', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Tenants', '/api/v1/merchant/tenants', 'POST', 'Create tenant', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Vehicles', '/api/v1/merchant/vehicles', 'GET', 'Manage vehicles', 'MERCHANT', NOW()),
(gen_random_uuid(), 'ANPR', '/api/v1/merchant/anpr', 'GET', 'ANPR management', 'MERCHANT', NOW()),
(gen_random_uuid(), 'Revenue', '/api/v1/merchant/revenue', 'GET', 'Revenue reports', 'MERCHANT', NOW());
