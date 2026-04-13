import client from './client';

export const getUsers = async () => {
  const response = await client.get('/api/v1/users');
  return response.data;
};

export const getUser = async (id) => {
  const response = await client.get(`/api/v1/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await client.post('/api/v1/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await client.put(`/api/v1/users/${id}`, data);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await client.delete(`/api/v1/users/${id}`);
  return response.data;
};

export const assignRoles = async (userId, roleIds) => {
  const response = await client.put(`/api/v1/users/${userId}/roles`, { roleIds });
  return response.data;
};
