import client from './client';

export const login = async (email, password) => {
  const response = await client.post('/api/v1/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const activateAccount = async (token, password) => {
  const response = await client.post('/api/v1/auth/activate', {
    token,
    password,
  });
  return response.data;
};
