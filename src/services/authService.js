import api from './api';

// Login
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Register
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Store auth data
export const storeAuthData = (token, username, userId = null) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    if (userId) {
        localStorage.setItem('userId', userId);
    }
};

// Get stored auth data
export const getAuthData = () => {
    return {
        token: localStorage.getItem('authToken'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
    };
};

// Clear auth data
export const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};
