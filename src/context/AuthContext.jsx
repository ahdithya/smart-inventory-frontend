import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = localStorage.getItem('access_token');
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
      setToken(currentToken);
    } catch {
      setUser(null);
      setToken(null);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initAuth() {
      const currentToken = localStorage.getItem('access_token');
      if (!currentToken) {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const userData = await authService.getMe();
        if (active) {
          setUser(userData);
          setToken(currentToken);
        }
      } catch {
        if (active) {
          setUser(null);
          setToken(null);
        }
        authService.logout();
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    const handleUnauthorized = () => {
      if (active) {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      active = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const newAccessToken = res.access || localStorage.getItem('access_token');
    setToken(newAccessToken);

    if (res.user) {
      setUser(res.user);
    } else {
      const profile = await authService.getMe();
      setUser(profile);
    }
    return res;
  };

  const register = async (registrationData) => {
    const res = await authService.register(registrationData);
    const newAccessToken = res.access || localStorage.getItem('access_token');
    setToken(newAccessToken);

    if (res.user) {
      setUser(res.user);
    } else {
      const profile = await authService.getMe();
      setUser(profile);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
