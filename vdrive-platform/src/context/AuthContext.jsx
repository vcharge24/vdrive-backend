import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // Validate JWT by checking expiration
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to validate stored token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { accessToken, userId, firstName, lastName, roles } = response;

      const userData = {
        id: userId,
        email,
        firstName,
        lastName,
        roles: roles || [],
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const activate = async (activationToken, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.activateAccount(activationToken, password);
      const { accessToken, userId, email, firstName, lastName, roles } = response;

      const userData = {
        id: userId,
        email,
        firstName,
        lastName,
        roles: roles || [],
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((role) => {
      if (typeof role === 'string') return role === roleName;
      if (typeof role === 'object' && role.name) return role.name === roleName;
      return false;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    activate,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
