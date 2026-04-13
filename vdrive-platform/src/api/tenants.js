import client from './client';

// Tenants
export const getTenants = async () => {
  const response = await client.get('/api/v1/tenants');
  return response.data;
};

export const getTenant = async (id) => {
  const response = await client.get(`/api/v1/tenants/${id}`);
  return response.data;
};

export const createTenant = async (data) => {
  const response = await client.post('/api/v1/tenants', data);
  return response.data;
};

export const updateTenant = async (id, data) => {
  const response = await client.put(`/api/v1/tenants/${id}`, data);
  return response.data;
};

export const deleteTenant = async (id) => {
  const response = await client.delete(`/api/v1/tenants/${id}`);
  return response.data;
};

// Companies
export const getCompanies = async () => {
  const response = await client.get('/api/v1/companies');
  return response.data;
};

export const getCompany = async (id) => {
  const response = await client.get(`/api/v1/companies/${id}`);
  return response.data;
};

export const createCompany = async (data) => {
  const response = await client.post('/api/v1/companies', data);
  return response.data;
};

export const updateCompany = async (id, data) => {
  const response = await client.put(`/api/v1/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await client.delete(`/api/v1/companies/${id}`);
  return response.data;
};

// Locations
export const getLocations = async () => {
  const response = await client.get('/api/v1/locations');
  return response.data;
};

export const getLocation = async (id) => {
  const response = await client.get(`/api/v1/locations/${id}`);
  return response.data;
};

export const createLocation = async (data) => {
  const response = await client.post('/api/v1/locations', data);
  return response.data;
};

export const updateLocation = async (id, data) => {
  const response = await client.put(`/api/v1/locations/${id}`, data);
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await client.delete(`/api/v1/locations/${id}`);
  return response.data;
};
