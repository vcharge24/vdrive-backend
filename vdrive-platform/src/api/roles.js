import client from './client';

export const getRoles = async () => {
  const response = await client.get('/api/v1/roles');
  return response.data;
};

export const createRole = async (data) => {
  const response = await client.post('/api/v1/roles', data);
  return response.data;
};

export const getPrivileges = async () => {
  const response = await client.get('/api/v1/privileges');
  return response.data;
};

export const createPrivilege = async (data) => {
  const response = await client.post('/api/v1/privileges', data);
  return response.data;
};

export const getScreenEndpoints = async () => {
  const response = await client.get('/api/v1/screens');
  return response.data;
};

export const createScreenEndpoint = async (data) => {
  const response = await client.post('/api/v1/screens', data);
  return response.data;
};
