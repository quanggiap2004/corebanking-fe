import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getAuthData, storeAuthData, clearAuthData } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const authData = getAuthData();
    
    if (authData.token && authData.username) {
      setToken(authData.token);
      setUser({
        username: authData.username,
        userId: authData.userId,
        transactionLimit: authData.transactionLimit,
      });
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      
      const { token: newToken, username, userId, transactionLimit } = response;
      
      // Store in localStorage
      storeAuthData(newToken, username, userId, transactionLimit);
      
      // Update state
      setToken(newToken);
      setUser({ username, userId, transactionLimit });
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
